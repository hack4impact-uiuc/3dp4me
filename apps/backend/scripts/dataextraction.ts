/*
 * Combined Export Script - Steps 1, 2, and 3
 * STEP 1: Generate CSV of all basic patient info
 * STEP 2: Generate CSV of all steps with string-convertible data: String, MultilineString, 
 * Number, Date, Phone, RadioButton, MultiSelect, Tags
 * STEP 3: Export media files (File, Audio, Photo, Signature) from S3 to local filesystem (functions related to S3 are in awsS3Helpers.ts)
 * STEP 4: Package everything into a ZIP file
 * 
 * String CSV excludes: Header, Divider, File, Audio, Photo, Signature, Map
 */

import fs, { createWriteStream, mkdtempSync, rm, rmdir, rmdirSync, rmSync } from 'fs';
import path, { join } from 'path';
import mongoose from 'mongoose';
import { PatientModel } from '../src/models/Patient';
import { StepModel } from '../src/models/Metadata';
import { fileExistsInS3, downloadAndSaveFileWithTypeDetection, sanitizeFilename } from '../src/utils/aws/awsS3Helpers';
import archiver from 'archiver';
import { Field, FieldType, FieldTypeData, File, Language, MapPoint, Patient, Step } from '@3dp4me/types';
import { format } from '@fast-csv/format';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';

const INCLUDED_TYPES = [
    FieldType.STRING,
    FieldType.MULTILINE_STRING,
    FieldType.NUMBER,
    FieldType.DATE,
    FieldType.PHONE,
    FieldType.RADIO_BUTTON,
    FieldType.MULTI_SELECT,
    FieldType.TAGS,
    FieldType.MAP,
];

const IGNORED_FIELD_TYPES = [
    FieldType.FILE,
    FieldType.AUDIO,
    FieldType.PHOTO,
    FieldType.SIGNATURE,
    FieldType.DIVIDER,
    FieldType.HEADER,
];

const MEDIA_FIELD_TYPES = [
    FieldType.FILE,
    FieldType.AUDIO,
    FieldType.PHOTO,
    // FieldType.SIGNATURE, (not media, stored as an array of points on a canvas in mongo. generate an image of this signature and save it)
];


// Generic logging interface so that we can eventually send the progress over websocket or something similar
interface Logger {
    debug: LevelLogger
    info: LevelLogger;
    error: LevelLogger;
}

type LevelLogger = (message: string, ...args: any[]) => void;

// What to export?
interface ExportOptions {
    includeDeleted: boolean;
    includeHidden: boolean;
    logger: Logger
    language: Language
}

const PATIENT_ID_TO_HEADER: Partial<Record<keyof Partial<Patient>, string>> = {
    dateCreated: 'Date Created',
    orderId: 'Order ID',
    lastEdited: 'Last Edited',
    lastEditedBy: 'Last Edited By',
    status: 'Status',
    phoneNumber: 'Phone Number',
    orderYear: 'Order Year',
    firstName: 'First Name',
    fathersName: 'Father\'s Name',
    grandfathersName: 'Grandfather\'s Name',
    familyName: 'Family Name',
}

function createCsvWriteStream(filepath: string) {
    const destination = createWriteStream(filepath, { flags: 'w+', flush: true })
    const stream = format({ headers: true })
    stream.pipe(destination)
    return stream;
}

// STEP 1: Generate patient CSV (makes patients.csv)
async function writePatientCsv(logger: Logger, filepath: string) {
    const stream = createCsvWriteStream(filepath);
    const patients = await PatientModel.find();
    patients.forEach(p => {
        const patient = p.toObject()
        const row = patientToCsvRow(logger, patient);
        stream.write(row);
    })

    logger.info(`Generated patients.csv with ${patients.length} records`);
    stream.end()
}

function patientToCsvRow(logger: Logger, patient: Patient): Record<string, any> {
    const csvRow: Record<string, any> = {};
    for (const [key, value] of Object.entries(patient)) {
        const header = PATIENT_ID_TO_HEADER[key as keyof Patient];
        if (!header) {
            logger.debug(`Skipping unknown patient key: ${key}`);
            continue;
        }

        csvRow[header] = value;
    }

    return csvRow;
}

// STEP 2: Generate step CSVs (makes step_csvs/*.csv)
// Helper function to get filtered step definitions (moved to global scope)
async function getSteps(options: ExportOptions): Promise<Step[]> {
    // Build query filter based on options
    const stepFilter: any = {};
    if (!options.includeDeleted) {
        stepFilter.isDeleted = { $ne: true };
    }
    if (!options.includeHidden) {
        stepFilter.isHidden = { $ne: true };
    }

    // Get step definitions based on filter
    const stepDefinitions = await StepModel.find(stepFilter).lean();
    options.logger.debug(`Found ${stepDefinitions.length} step definitions`);
    return stepDefinitions;
}



async function writeStepCsvs(directoryLocation: string, options: ExportOptions) {
    const { logger } = options;
    logger.info('=== STEP 2: Generating Step CSVs ===');
    fs.mkdirSync(directoryLocation, { recursive: true })

    // Get step definitions using the global getSteps function
    const steps = await getSteps(options);
    const patients = await PatientModel.find();
    logger.info(`Found ${steps.length} steps and ${patients.length} patients`);
    const stepPromises = steps.map(async (step) => {
        return writeStepToCSV(directoryLocation, step, patients, options);
    });
    await Promise.all(stepPromises);
}

function shouldIgnoreField(field: Field, options: ExportOptions) {
    const { includeDeleted, includeHidden } = options;
    if (IGNORED_FIELD_TYPES.includes(field.fieldType)) return true;
    if (!includeHidden && field.isHidden) return true;
    if (!includeDeleted && field.isDeleted) return true;
    return false;
}

function getStepModel(stepKey: string): mongoose.Model<any> | null {
    try {
        return mongoose.model(stepKey);
    } catch (error) {
        return null;
    }
}

async function writeStepToCSV(directoryLocation: string, step: Step, patients: Patient[], options: ExportOptions) {
    const stepKey = step.key;
    console.log(`Processing step: ${stepKey}`);

    if (!getStepModel(stepKey)) {
        options.logger.info(`No model found for step ${stepKey}, skipping`);
        return;
    }

    const fieldsToWrite = step.fields.filter((field: Field) => {
        return !shouldIgnoreField(field, options)
    })

    const regularFields = fieldsToWrite.filter((field: Field) => {
        return field.fieldType !== FieldType.FIELD_GROUP
    })

    const fieldGroups = fieldsToWrite.filter((field: Field) => {
        return field.fieldType === FieldType.FIELD_GROUP && Array.isArray(field.subFields)
    })

    await writeRegularFieldsToCSV(directoryLocation, step, patients, regularFields, options)
    // await writeFieldGroupsToCSV(directoryLocation, step, patients, fieldGroups)
}

/**
 * Writes all patients in this step to a single CSV file
 */
async function writeRegularFieldsToCSV(directoryLocation: string, stepMeta: Step, patients: Patient[], fields: Field[], options: ExportOptions) {
    const StepDataModel = getStepModel(stepMeta.key)!;
    const stream = createCsvWriteStream(path.join(directoryLocation, `${stepMeta.key}.csv`));
    const patientPromises = patients.map(async (patient) => {
        const row: Record<string, any> = {
            'Order ID': patient.orderId,
        };

        // Process each field in the step definition
        const stepDoc = await StepDataModel.findOne({ patientId: patient._id });
        if (!stepDoc) return;
        for (const field of fields) {
            row[field.key] = fieldToString(stepDoc[field.key], field, options);
        }

        stream.write(row);
    })

    await Promise.all(patientPromises);
    options.logger.debug(`Wrote ${patientPromises.length} records to ${stepMeta.key}.csv`);
}

function fieldToString(value: any, field: Field, options: ExportOptions): string {
    if (!value) return '';

    switch (field.fieldType) {
        case FieldType.STRING:
        case FieldType.MULTILINE_STRING:
        case FieldType.PHONE:
            return value as string;
        case FieldType.NUMBER:
            return value.toString();
        case FieldType.DATE:
            return new Date(value).toISOString();
        case FieldType.MULTI_SELECT:
        case FieldType.TAGS:
            // Should always be an array. Fallback to JSON stringify
            if (!Array.isArray(value)) {
                options.logger.error(`Expected ${field.key} (type ${field.fieldType}) to be an array, got ${typeof value}`);
                return JSON.stringify(value);
            }

            const selectedValues = value.map(val => getFieldOptionText(field, val, options.language))
            return selectedValues.join(', ');
        case FieldType.RADIO_BUTTON:
            return getFieldOptionText(field, value, options.language);
        case FieldType.MAP:
            // Format MAP data as "lat,lng"
            if (!isMapPoint(value)) {
                options.logger.error(`Expected ${field.key} (type ${field.fieldType}) to be a MapPoint, got ${typeof value}`);
                return JSON.stringify(value);
            }

            return `${value.latitude},${value.longitude}`;
        case FieldType.RADIO_BUTTON:
            return getFieldOptionText(field, value, options.language);
        default:
            return `Unknown field type: ${field.fieldType}`;
    }
}

function isMapPoint(value: any): value is MapPoint {
    return typeof value === "object" && "latitude" in value && "longitude" in value;
}

// async function writeFieldGroupsToCSV(directoryLocation: string, step: Step, patients: Patient[], options: ExportOptions) {
//     // Process steps with field groups - create individual CSVs per patient
//     console.log(`Step ${stepKey} has field groups, creating individual CSVs per patient`);

//     for (const patient of patients) {
//         const stepDoc = await StepDataModel.findOne({ patientId: patient._id });
//         if (!stepDoc) continue;

//         const patientDir = path.join(EXPORT_DIR, patient.orderId);
//         if (!fs.existsSync(patientDir)) fs.mkdirSync(patientDir, { recursive: true });

//         const records = [];

//         // Get field group data (stored as arrays in the document)
//         const fieldGroupData = new Map<string, any[]>();

//         // Collect all field group arrays
//         for (const field of stepDef.fields) {
//             if (field.fieldType === FieldType.FIELD_GROUP && Array.isArray(field.subFields)) {
//                 const groupData = stepDoc[field.key];
//                 if (Array.isArray(groupData)) {
//                     fieldGroupData.set(field.key, groupData);
//                 }
//             }
//         }

//         // Find the maximum number of entries across all field groups for this patient
//         const maxEntries = Math.max(...Array.from(fieldGroupData.values()).map(arr => arr.length), 0);

//         // Create a record for each entry in the field groups
//         for (let i = 0; i < maxEntries; i++) {
//             const row: Record<string, any> = {
//                 entryNumber: i + 1,
//             };

//             // Process each field in the step definition
//             for (const field of stepDef.fields) {
//                 // Skip hidden or deleted fields if not including them
//                 if (!includeHidden && field.isHidden) continue;
//                 if (!includeDeleted && field.isDeleted) continue;

//                 if (IGNORED_FIELD_TYPES.includes(field.fieldType)) continue;

//                 if (field.fieldType === FieldType.FIELD_GROUP && Array.isArray(field.subFields)) {
//                     // Handle field groups (nested fields)
//                     const groupData = fieldGroupData.get(field.key);
//                     if (groupData && groupData[i]) {
//                         for (const subField of field.subFields) {
//                             // Skip hidden or deleted subfields if not including them
//                             if (!includeHidden && subField.isHidden) continue;
//                             if (!includeDeleted && subField.isDeleted) continue;

//                             if (INCLUDED_TYPES.includes(subField.fieldType)) {
//                                 row[subField.key] = fieldToString(groupData[i][subField.key], subField, 'EN');
//                             }
//                         }
//                     }
//                 } else if (INCLUDED_TYPES.includes(field.fieldType)) {
//                     // Handle regular fields (non-field-group fields)
//                     row[field.key] = fieldToString(stepDoc[field.key], field, 'EN');
//                 }
//             }

//             records.push(row);
//         }

//         if (records.length > 0) {
//             // Create a mapping of field keys to their display names
//             const fieldDisplayNames = new Map<string, string>();
//             // Add entry number display name
//             fieldDisplayNames.set('entryNumber', 'Entry Number');

//             // Map field keys to display names from step definition
//             for (const field of stepDef.fields) {
//                 if (!includeHidden && field.isHidden) continue;
//                 if (!includeDeleted && field.isDeleted) continue;
//                 if (IGNORED_FIELD_TYPES.includes(field.fieldType)) continue;

//                 if (field.fieldType === FieldType.FIELD_GROUP && Array.isArray(field.subFields)) {
//                     for (const subField of field.subFields) {
//                         if (!includeHidden && subField.isHidden) continue;
//                         if (!includeDeleted && subField.isDeleted) continue;
//                         if (INCLUDED_TYPES.includes(subField.fieldType)) {
//                             fieldDisplayNames.set(subField.key, subField.displayName?.EN || subField.key);
//                         }
//                     }
//                 } else if (INCLUDED_TYPES.includes(field.fieldType)) {
//                     fieldDisplayNames.set(field.key, field.displayName?.EN || field.key);
//                 }
//             }

//             const csvWriter = createObjectCsvWriter({
//                 path: path.join(patientDir, `${stepKey}.csv`),
//                 header: Object.keys(records[0]).map(key => ({
//                     id: key,
//                     title: fieldDisplayNames.get(key) || key
//                 })),
//             });

//             await csvWriter.writeRecords(records);
//             console.log(`Wrote ${records.length} records to ${patientDir}/${stepKey}.csv`);
//         }
//     }

// }

// STEP 3: Export media files (makes patients/*/*.jpg)
async function writeMediaFiles(directoryLocation: string, options: ExportOptions) {
    const { includeDeleted, includeHidden, logger } = options;
    logger.info('\n=== STEP 3: Exporting Media Files ===');
    logger.debug(`Options: includeDeleted=${includeDeleted}, includeHidden=${includeHidden}`);

    const stepDefinitions = await getSteps(options);
    const patients = await PatientModel.find();
    logger.info(`Found ${patients.length} patients`);

    const stepPromises = stepDefinitions.map(async (step) => {
        return writeMediaFilesForStep(directoryLocation, step, patients, options);
    });

    await Promise.all(stepPromises);
    logger.info(`Media export complete`);
}

async function writeMediaFilesForStep(directoryLocation: string, step: Step, patients: Patient[], options: ExportOptions) {
    const stepKey = step.key;
    console.log(`Processing step: ${stepKey}`);

    const StepDataModel = getStepModel(stepKey)
    if (!StepDataModel) {
        options.logger.info(`No model found for step ${stepKey}, skipping`);
        return;
    }

    const patientPromises = patients.map(async (patient) => {
        return writeMediaFilesForPatient(directoryLocation, StepDataModel, step, patient, options);
    })

    await Promise.all(patientPromises);
}

async function writeMediaFilesForPatient(directoryLocation: string, StepDataModel: mongoose.Model<any>, step: Step, patient: Patient, options: ExportOptions) {
    const stepDoc = await StepDataModel.findOne({ patientId: patient._id }).lean();
    if (!stepDoc) return;

    const patientDir = path.join(directoryLocation, patient.orderId);
    const stepDir = path.join(patientDir, step.key);

    // Process regular fields
    let numFilesDownloaded = 0;
    const filePromises = step.fields.map(async (field) => {
        if (!options.includeHidden && field.isHidden) return;
        if (!options.includeDeleted && field.isDeleted) return;
        if (!MEDIA_FIELD_TYPES.includes(field.fieldType)) return;


        const fileData = stepDoc?.[field.key] as File[] | null;
        if (!fileData) return;

        console.log("FILE DATA IS", fileData);

        // TODO: IS THIS ALWAYS AN ARRAY?
        // Handle array of files
        for (const file of fileData) {
            if (file && file.filename) {
                const s3Key = `${patient._id}/${step.key}/${field.key}/${file.filename}`;
                const fileExists = await fileExistsInS3(s3Key);
                if (!fileExists) continue;

                fs.mkdirSync(stepDir, { recursive: true });
                const sanitizedFilename = sanitizeFilename(file.filename);
                const filePath = path.join(stepDir, sanitizedFilename);
                const success = await downloadAndSaveFileWithTypeDetection(s3Key, filePath, file.filename);
                if (!success) {
                    options.logger.error(`Failed to download file ${s3Key}`);
                } else {
                    options.logger.debug(`Downloaded file ${s3Key}`);
                }

                numFilesDownloaded++;
            }
        }
    })

    await Promise.all(filePromises);
    options.logger.info(`Downloaded ${numFilesDownloaded} files for patient ${patient.orderId} in step ${step.key}`);
}


// Helper function to resolve field option IDs to human-readable text
function getFieldOptionText(field: Field, value: any, lang: Language): string {
    if (!field.options || !Array.isArray(field.options) || !value) {
        return "";
    }

    // Find the option that matches the value (ID)
    const valStr = value.toString();
    const matchingOption = field.options.find(opt => opt._id?.toString() === valStr);
    if (matchingOption?.Question?.[lang]) {
        return matchingOption.Question[lang];
    }

    return "";
}

// Combined export function - now returns a ReadableStream
export async function exportAllPatientsToZip(options: ExportOptions) {
    const {
        includeDeleted = false,
        includeHidden = false,
        logger = console,
    } = options;

    logger.debug('Export Configuration:', { includeDeleted, includeHidden });
    const destination = mkdtempSync(join(tmpdir(), '3dp4me-export-'))
    logger.debug(`Exporting to ${destination}`);

    try {
        // Generate CSV data in memory
        await writePatientCsv(logger, join(destination, 'patients.csv'));
        await writeStepCsvs(destination, options);
        await writeMediaFiles(destination, options);

        // Create zip file
        const zipPath = await zipDirectory(destination, logger);
        logger.info('Zip file created');

        // Clean up temporary directory
        logger.info('Cleaning up files');
        rmSync(destination, { recursive: true })

        // Return the file path to the zip
        logger.info('Export complete');
        return zipPath;
    } catch (error) {
        logger.error('Error during export process:', error);
        throw error;
    }
}

// New function to create a zip stream instead of a file
async function zipDirectory(directory: string, logger: Logger): Promise<string> {
    logger.info('\n=== STEP 4: Creating ZIP Stream ===');
    const zipPath = join(tmpdir(), `3dp4me-zip-${randomBytes(64).toString('hex')}.zip`)
    const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
    });

    // Write zip to file
    const outputStream = fs.createWriteStream(zipPath, { autoClose: true })
    archive.pipe(outputStream)

    // Handle archiver events
    archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
            logger.info('Archive warning - file not found:', err.message);
        } else {
            logger.error('Archive warning (treating as error):', err);
            throw err;
        }
    });

    archive.on('error', (err) => {
        logger.error('Error creating ZIP archive:', err);
        throw err;
    });

    archive.directory(directory, false)
    await archive.finalize();
    return zipPath
}