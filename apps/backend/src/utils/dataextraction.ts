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

import fs, { createWriteStream, mkdirSync, mkdtempSync, rm, rmdir, rmdirSync, rmSync } from 'fs';
import path, { join } from 'path';
import mongoose from 'mongoose';
import { PatientModel } from '../models/Patient';
import { StepModel } from '../models/Metadata';
import { fileExistsInS3, sanitizeFilename, downloadFileWithTypeDetection } from './aws/awsS3Helpers';
import archiver from 'archiver';
import { Field, FieldType, FieldTypeData, File, Language, MapPoint, Patient, Step } from '@3dp4me/types';
import { format } from '@fast-csv/format';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';

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
    mkdirSync(path.dirname(filepath), { recursive: true })
    const destination = createWriteStream(filepath, { flags: 'w+', flush: true })
    const stream = format({ headers: true, quote: '"', quoteColumns: true, quoteHeaders: true })
    stream.pipe(destination)
    return stream;
}

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

    options.logger.info(`Writing ${regularFields.length} regular fields to ${step.key}.csv`);
    await writeRegularFieldsToCSV(directoryLocation, step, patients, regularFields, options)

    options.logger.info(`Writing ${fieldGroups.length} field groups to ${step.key}.csv`);
    await writeFieldGroupsToCSV(directoryLocation, step, patients, fieldGroups, options)
}

/**
 * Writes all patients in this step to a single CSV file
 */
async function writeRegularFieldsToCSV(directoryLocation: string, stepMeta: Step, patients: Patient[], fields: Field[], options: ExportOptions) {
    const StepDataModel = getStepModel(stepMeta.key)!;
    const patientPromises = patients.map(async (patient) => {
        const row: Record<string, any> = {
            'Order ID': patient.orderId,
        };

        // Process each field in the step definition
        const stepDoc = await StepDataModel.findOne({ patientId: patient._id });
        if (!stepDoc) {
            return null
        }

        for (const field of fields) {
            const fieldName = getFieldName(field, options);
            row[fieldName] = fieldToString(stepDoc?.[field.key], field, options);
        }

        return row
    })

    let rows = await Promise.all(patientPromises);
    rows = rows.filter(r => r !== null);
    if (rows.length === 0) {
        options.logger.debug(`No records found for step ${stepMeta.key}, skipping`);
        return;
    }

    const stream = createCsvWriteStream(path.join(directoryLocation, `${stepMeta.key}.csv`));
    rows.forEach(r => stream.write(r))
    stream.end()
    options.logger.debug(`Wrote ${patientPromises.length} records to ${stepMeta.key}.csv`);
}

function fieldGroupToRows(fieldGroup: Field, stepDoc: Record<string, any> | null, options: ExportOptions): Record<string, any>[] {
    const values = stepDoc?.[fieldGroup.key]
    if (!Array.isArray(values)) return []

    const rows: Record<string, any>[] = [];
    for (const [index, fieldGroupEntry] of values.entries()) {
        const fieldGroupName = getFieldName(fieldGroup, options);
        const row: Record<string, any> = {
            [fieldGroupName]: `Entry ${index + 1}`
        };
        for (const field of fieldGroup.subFields) {
            if (shouldIgnoreField(field, options)) continue;
            const fieldName = getFieldName(field, options);
            row[fieldName] = fieldToString(fieldGroupEntry?.[field?.key], field, options);
        }

        rows.push(row);
    }

    return rows;
}

async function writeFieldGroupsToCSV(directoryLocation: string, stepMeta: Step, patients: Patient[], fieldGroups: Field[], options: ExportOptions) {
    const StepDataModel = getStepModel(stepMeta.key)!;
    const patientPromises = patients.map(async (patient) => {
        for (const fieldGroup of fieldGroups) {
            const stepDoc = await StepDataModel.findOne({ patientId: patient._id });
            const rows = fieldGroupToRows(fieldGroup, stepDoc, options);
            if (rows.length === 0) continue;
            const csvFileName = `${path.join(directoryLocation, patient.orderId, stepMeta.key, fieldGroup.key)}.csv`
            const stream = createCsvWriteStream(csvFileName);
            rows.forEach(r => stream.write(r))
            stream.end()
        }
    })

    await Promise.all(patientPromises);
    options.logger.debug(`Wrote ${patientPromises.length} records for field groups`);
}

function getFieldName(field: Field, options: ExportOptions): string {
    return field.displayName[options.language] || field.key;
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
    const stepDoc = await StepDataModel.findOne({ patientId: patient._id });
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

        // Handle array of files
        for (const file of fileData) {
            if (file && file.filename) {
                const s3Key = `${patient._id}/${step.key}/${field.key}/${file.filename}`;
                const fileExists = await fileExistsInS3(s3Key);
                if (!fileExists) continue;

                fs.mkdirSync(stepDir, { recursive: true });
                const sanitizedFilename = sanitizeFilename(file.filename);
                const filePath = path.join(stepDir, sanitizedFilename);

                try {
                    await downloadFileWithTypeDetection(s3Key, filePath);
                    options.logger.debug(`Downloaded file ${s3Key}`);
                    numFilesDownloaded++;
                } catch (error) {
                    options.logger.error(`Failed to download file ${s3Key}: ${error}`);
                }
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

export async function exportAllPatientsToZip(options: ExportOptions): Promise<string> {
    const {
        includeDeleted = false,
        includeHidden = false,
        logger = console,
    } = options;

    logger.debug('Export Configuration:', { includeDeleted, includeHidden });
    const destination = mkdtempSync(join(tmpdir(), '3dp4me-export-'))
    logger.debug(`Exporting to ${destination}`);

    try {
        logger.info('Generating CSV Files');
        await writePatientCsv(logger, join(destination, 'patients.csv'));
        await writeStepCsvs(destination, options);

        logger.info('Downloading Media Files');
        await writeMediaFiles(destination, options);

        logger.info('Creating ZIP File');
        const zipPath = await zipDirectory(destination, logger);

        logger.info('Doing Cleanup');
        rmSync(destination, { recursive: true })

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