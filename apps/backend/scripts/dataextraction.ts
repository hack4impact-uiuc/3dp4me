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

import fs, { createWriteStream, mkdtempSync } from 'fs';
import path, { join } from 'path';
import mongoose from 'mongoose';
import { PatientModel } from '../src/models/Patient';
import { StepModel } from '../src/models/Metadata';
import { fileExistsInS3, downloadAndSaveFileWithTypeDetection, sanitizeFilename } from '../src/utils/aws/awsS3Helpers';
import archiver from 'archiver';
import { Field, FieldType, Language, Patient, Step } from '@3dp4me/types';
import { format } from '@fast-csv/format';
import { tmpdir } from 'os';

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
async function writePatientCSV(logger: Logger, filepath: string) {
    const stream = createCsvWriteStream(filepath);
    const patients = await PatientModel.find();
    patients.forEach(p => {
        const obj = p.toObject();
        const row = patientToCsvRow(logger, obj);
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
    const { includeDeleted = false, includeHidden = false } = options;

    // Build query filter based on options
    const stepFilter: any = {};
    if (!includeDeleted) {
        stepFilter.isDeleted = { $ne: true };
    }
    if (!includeHidden) {
        stepFilter.isHidden = { $ne: true };
    }

    // Get step definitions based on filter
    const stepDefinitions = await StepModel.find(stepFilter).lean();
    console.log(`Found ${stepDefinitions.length} step definitions`);

    return stepDefinitions;
}



async function generateStepCSVs(directoryLocation: string, options: ExportOptions) {
    const { logger } = options;
    logger.info('=== STEP 2: Generating Step CSVs ===');

    fs.mkdirSync(directoryLocation)

    // Get step definitions using the global getSteps function
    const steps = await getSteps(options);
    const patients = await PatientModel.find().lean();
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
    const { includeDeleted, includeHidden, logger } = options;
    const stepKey = step.key;
    console.log(`Processing step: ${stepKey}`);

    if (!getStepModel(stepKey)) {
        logger.info(`No model found for step ${stepKey}, skipping`);
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

    await writeRegularFieldsToCSV(directoryLocation, step, patients, regularFields, logger)
    // await writeFieldGroupsToCSV(directoryLocation, step, patients, fieldGroups)
}

/**
 * Writes all patients in this step to a single CSV file
 */
async function writeRegularFieldsToCSV(directoryLocation: string, stepMeta: Step, patients: Patient[], fields: Field[], logger: Logger) {
    const StepDataModel = getStepModel(stepMeta.key)!;
    const stream = createCsvWriteStream(path.join(directoryLocation, `${stepMeta.key}.csv`));
    const patientPromises = patients.map(async (patient) => {
        const row: Record<string, any> = {
            'Order ID': patient.orderId,
        };

        // Process each field in the step definition
        const stepDoc = await StepDataModel.findOne({ patientId: patient._id });
        for (const field of fields) {
            row[field.key] = formatField(stepDoc[field.key], field, Language.EN);
        }

        stream.write(row);
    })

    await Promise.all(patientPromises);
    logger.debug(`Wrote ${patientPromises.length} records to ${stepMeta.key}.csv`);
}


async function writeFieldGroupsToCSV(directoryLocation: string, step: Step, patients: Patient[], options: ExportOptions) {
    // Process steps with field groups - create individual CSVs per patient
    console.log(`Step ${stepKey} has field groups, creating individual CSVs per patient`);

    for (const patient of patients) {
        const stepDoc = await StepDataModel.findOne({ patientId: patient._id });
        if (!stepDoc) continue;

        const patientDir = path.join(EXPORT_DIR, patient.orderId);
        if (!fs.existsSync(patientDir)) fs.mkdirSync(patientDir, { recursive: true });

        const records = [];

        // Get field group data (stored as arrays in the document)
        const fieldGroupData = new Map<string, any[]>();

        // Collect all field group arrays
        for (const field of stepDef.fields) {
            if (field.fieldType === FieldType.FIELD_GROUP && Array.isArray(field.subFields)) {
                const groupData = stepDoc[field.key];
                if (Array.isArray(groupData)) {
                    fieldGroupData.set(field.key, groupData);
                }
            }
        }

        // Find the maximum number of entries across all field groups for this patient
        const maxEntries = Math.max(...Array.from(fieldGroupData.values()).map(arr => arr.length), 0);

        // Create a record for each entry in the field groups
        for (let i = 0; i < maxEntries; i++) {
            const row: Record<string, any> = {
                entryNumber: i + 1,
            };

            // Process each field in the step definition
            for (const field of stepDef.fields) {
                // Skip hidden or deleted fields if not including them
                if (!includeHidden && field.isHidden) continue;
                if (!includeDeleted && field.isDeleted) continue;

                if (IGNORED_FIELD_TYPES.includes(field.fieldType)) continue;

                if (field.fieldType === FieldType.FIELD_GROUP && Array.isArray(field.subFields)) {
                    // Handle field groups (nested fields)
                    const groupData = fieldGroupData.get(field.key);
                    if (groupData && groupData[i]) {
                        for (const subField of field.subFields) {
                            // Skip hidden or deleted subfields if not including them
                            if (!includeHidden && subField.isHidden) continue;
                            if (!includeDeleted && subField.isDeleted) continue;

                            if (INCLUDED_TYPES.includes(subField.fieldType)) {
                                row[subField.key] = formatField(groupData[i][subField.key], subField, 'EN');
                            }
                        }
                    }
                } else if (INCLUDED_TYPES.includes(field.fieldType)) {
                    // Handle regular fields (non-field-group fields)
                    row[field.key] = formatField(stepDoc[field.key], field, 'EN');
                }
            }

            records.push(row);
        }

        if (records.length > 0) {
            // Create a mapping of field keys to their display names
            const fieldDisplayNames = new Map<string, string>();
            // Add entry number display name
            fieldDisplayNames.set('entryNumber', 'Entry Number');

            // Map field keys to display names from step definition
            for (const field of stepDef.fields) {
                if (!includeHidden && field.isHidden) continue;
                if (!includeDeleted && field.isDeleted) continue;
                if (IGNORED_FIELD_TYPES.includes(field.fieldType)) continue;

                if (field.fieldType === FieldType.FIELD_GROUP && Array.isArray(field.subFields)) {
                    for (const subField of field.subFields) {
                        if (!includeHidden && subField.isHidden) continue;
                        if (!includeDeleted && subField.isDeleted) continue;
                        if (INCLUDED_TYPES.includes(subField.fieldType)) {
                            fieldDisplayNames.set(subField.key, subField.displayName?.EN || subField.key);
                        }
                    }
                } else if (INCLUDED_TYPES.includes(field.fieldType)) {
                    fieldDisplayNames.set(field.key, field.displayName?.EN || field.key);
                }
            }

            const csvWriter = createObjectCsvWriter({
                path: path.join(patientDir, `${stepKey}.csv`),
                header: Object.keys(records[0]).map(key => ({
                    id: key,
                    title: fieldDisplayNames.get(key) || key
                })),
            });

            await csvWriter.writeRecords(records);
            console.log(`Wrote ${records.length} records to ${patientDir}/${stepKey}.csv`);
        }
    }

}

// STEP 3: Export media files (makes patients/*/*.jpg)
async function exportStepMedia(options: ExportOptions = {}) {
    const { includeDeleted = false, includeHidden = false } = options;

    console.log('\n=== STEP 3: Exporting Media Files ===');
    console.log(`Options: includeDeleted=${includeDeleted}, includeHidden=${includeHidden}`);

    if (!fs.existsSync(MEDIA_EXPORT_DIR)) fs.mkdirSync(MEDIA_EXPORT_DIR);

    const stepDefinitions = await getSteps(options);

    const patients = await PatientModel.find();
    console.log(`Found ${patients.length} patients`);

    let totalFilesDownloaded = 0;

    for (const stepDef of stepDefinitions) {
        const stepKey = stepDef.key;
        console.log(`Processing step: ${stepKey}`);

        // Get the mongoose model for this step
        let StepDataModel;
        try {
            StepDataModel = mongoose.model(stepKey);
        } catch (error) {
            console.log(`No model found for step ${stepKey}, skip`);
            continue;
        }

        for (const patient of patients) {
            const stepDoc = await StepDataModel.findOne({ patientId: patient._id });
            if (!stepDoc) continue;

            const patientDir = path.join(MEDIA_EXPORT_DIR, patient.orderId);
            const stepDir = path.join(patientDir, stepKey);

            // Track if we actually downloaded any files for this step
            let hasDownloadedFiles = false;

            // Process regular fields
            for (const field of stepDef.fields) {
                // Check if field should be included based on options
                if (!includeHidden && field.isHidden) continue;
                if (!includeDeleted && field.isDeleted) continue;

                if (MEDIA_FIELD_TYPES.includes(field.fieldType)) {
                    const fileData = stepDoc[field.key];
                    if (Array.isArray(fileData)) {
                        // Handle array of files
                        for (const file of fileData) {
                            if (file && file.filename) {
                                const s3Key = `${patient._id}/${stepKey}/${field.key}/${file.filename}`;
                                const fileExists = await fileExistsInS3(s3Key);

                                if (fileExists) {
                                    // Create directory only when we have actual files
                                    if (!hasDownloadedFiles) {
                                        fs.mkdirSync(patientDir, { recursive: true });
                                        fs.mkdirSync(stepDir, { recursive: true });
                                        hasDownloadedFiles = true;
                                    }

                                    const sanitizedFilename = sanitizeFilename(file.filename);
                                    const localPath = path.join(stepDir, sanitizedFilename);
                                    const success = await downloadAndSaveFileWithTypeDetection(s3Key, localPath, file.filename);

                                    if (success) {
                                        console.log(`Downloaded: ${localPath}`);
                                        totalFilesDownloaded++;
                                    }
                                }
                            }
                        }
                    } else if (fileData && fileData.filename) {
                        // Handle single file
                        const result = await downloadSingleFile(
                            patient,
                            stepKey,
                            field.key,
                            fileData,
                            patientDir,
                            stepDir,
                            hasDownloadedFiles
                        );

                        if (result.success) {
                            totalFilesDownloaded++;
                        }
                        hasDownloadedFiles = result.hasDownloadedFiles;
                    }
                }

            }
        }
    }

    console.log(`Media export completed. Downloaded ${totalFilesDownloaded} files.`);
}

// Function to format field values based on type
function fieldToString(value: any, field: Field, lang: Language): string {
    if (!value) return '';
    switch (field.fieldType) {
        case FieldType.DATE:
            return new Date(value).toISOString();
        case FieldType.MULTI_SELECT:
            return value.map(val => resolveFieldOption(field, val, lang)).filter(Boolean).join(', ');
        case FieldType.RADIO_BUTTON:
    }

    const fieldType = field.fieldType;

    if (fieldType === FieldType.DATE) return new Date(value).toISOString();

    if (fieldType === FieldType.MULTI_SELECT || fieldType === FieldType.TAGS || fieldType === FieldType.RADIO_BUTTON) {
        // Handle array values (MULTI_SELECT, TAGS)
        if (Array.isArray(value)) {
            const resolvedValues = value.map(val => resolveFieldOption(field, val, lang)).filter(Boolean);
            return resolvedValues.join(', ');
        }
        // RADIO_BUTTON: single ID
        return resolveFieldOption(field, value, lang) || value;
    }

    if (fieldType === FieldType.MAP) {
        // Format MAP data as "lat,lng"
        if (value && typeof value === 'object') {
            const lat = value.lat || value.latitude;
            const lng = value.lng || value.longitude;
            if (lat !== undefined && lng !== undefined) {
                return `${lat},${lng}`;
            }
        }
        return value;
    }

    return value;
}

// Helper function to resolve field option IDs to human-readable text
function resolveFieldOption(field: Field, value: any, lang: 'EN' | 'AR' = 'EN'): string | null {
    if (!field.options || !Array.isArray(field.options) || !value) {
        return null;
    }

    // Find the option that matches the value (ID)
    const valStr = value.toString();
    const matchingOption = field.options.find(opt => opt._id?.toString() === valStr);

    if (matchingOption?.Question?.[lang]) {
        return matchingOption.Question[lang];
    }

    return null;
}

async function downloadSingleFile(
    patient: any,
    stepKey: string,
    fieldKey: string,
    fileData: any,
    patientDir: string,
    stepDir: string,
    hasDownloadedFiles: boolean
): Promise<{ success: boolean; hasDownloadedFiles: boolean }> {
    if (!fileData || !fileData.filename) {
        return { success: false, hasDownloadedFiles };
    }

    const s3Key = `${patient._id}/${stepKey}/${fieldKey}/${fileData.filename}`;
    const fileExists = await fileExistsInS3(s3Key);

    if (!fileExists) {
        return { success: false, hasDownloadedFiles };
    }

    // Create directory only when we have actual files
    if (!hasDownloadedFiles) {
        fs.mkdirSync(patientDir, { recursive: true });
        fs.mkdirSync(stepDir, { recursive: true });
        hasDownloadedFiles = true;
    }

    const sanitizedFilename = sanitizeFilename(fileData.filename);
    const localPath = path.join(stepDir, sanitizedFilename);
    const downloadSuccess = await downloadAndSaveFileWithTypeDetection(s3Key, localPath, fileData.filename);

    if (downloadSuccess) {
        console.log(`Downloaded: ${localPath}`);
    }

    return { success: downloadSuccess, hasDownloadedFiles };
}

// Combined export function - now returns a ReadableStream
export async function exportAllPatientsToZip(options: ExportOptions = {}) {
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
        await writePatientCSV(logger, join(destination, 'patients.csv'));
        await generateStepCSVs(logger, { includeDeleted, includeHidden, logger });
        await exportStepMedia({ includeDeleted, includeHidden });

        // Create zip stream instead of file
        const zipStream = await createZipStream();

        console.log('\nExport stream created successfully');

        return zipStream;
    } catch (error) {
        console.error('Error during export process:', error);
        throw error;
    }
}

// New function to create a zip stream instead of a file
async function createZipStream(): Promise<NodeJS.ReadableStream> {
    console.log('\n=== STEP 4: Creating ZIP Stream ===');

    const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
    });

    // Handle archiver events
    archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
            console.warn('Archive warning - file not found:', err.message);
        } else {
            console.error('Archive warning (treating as error):', err);
            throw err;
        }
    });

    archive.on('error', (err) => {
        console.error('Error creating ZIP archive:', err);
        throw err;
    });

    // Add patients.csv if it exists
    const patientsCsvPath = path.join(__dirname, 'patients.csv');
    if (fs.existsSync(patientsCsvPath)) {
        archive.file(patientsCsvPath, { name: 'patients.csv' });
        console.log('Added patients.csv to archive');
    }

    // Add step CSV files if directory exists
    if (fs.existsSync(EXPORT_DIR)) {
        archive.directory(EXPORT_DIR, 'step_csvs');
        console.log('Added step CSV files to archive');
    }

    // Add media files if directory exists
    if (fs.existsSync(MEDIA_EXPORT_DIR)) {
        archive.directory(MEDIA_EXPORT_DIR, 'patients');
        console.log('Added media files to archive');
    }

    // Finalize the archive
    archive.finalize();

    return archive;
}