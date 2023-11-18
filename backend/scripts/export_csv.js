/* eslint-disable import/no-extraneous-dependencies, no-restricted-syntax, max-len, no-nested-ternary, no-case-declarations, no-param-reassign, no-await-in-loop */
require('dotenv').config({ path: `${process.env.NODE_ENV}.env` });
require('../utils/aws/awsSetup');
const { exit } = require('process');
const {
    appendFileSync, writeFile, writeFileSync, mkdirSync, existsSync, createWriteStream,
} = require('fs');
const { join } = require('path');

const { createCanvas } = require('canvas');
const ExcelJS = require('exceljs');
const mongoose = require('mongoose');

const { Step } = require('../models/Metadata');
const { Patient } = require('../models/Patient');
const { initDB } = require('../utils/initDb');
const { FIELDS } = require('../utils/constants');
const { downloadFile } = require('../utils/aws/awsS3Helpers');

const PATIENT_INDEX_FILENAME = './patient-directory.csv';
const PATIENT_FILE_DIR = './patients';
const LANGUAGES = ['EN', 'AR'];

const exportToCSV = async () => {
    console.log('Exporting to CSV');
    initDB(async () => {
        console.log('Connected to DB');
        await createPatientIndex();
        await createPatientFiles();
        exit(0);
    });
};

const createPatientFiles = async () => {
    if (!existsSync(PATIENT_FILE_DIR)) mkdirSync(PATIENT_FILE_DIR);

    const patients = await Patient.find({});
    return Promise.all(patients.map(createPatientFile));
};

const createPatientFile = async (patient) => {
    if (!existsSync(join(PATIENT_FILE_DIR, patient.orderId))) mkdirSync(join(PATIENT_FILE_DIR, patient.orderId));
    console.log(`Writing patient ${patient.orderId}`);
    await Promise.all(LANGUAGES.map((l) => createPatientFileInLanguage(patient, l)));
    console.log(`Done with patient ${patient.orderId}`);
};

const download = (patient, stepKey, fieldKey, fileName) => {
    const localPath = join(PATIENT_FILE_DIR, patient.orderId, fileName);
    const ws = createWriteStream(localPath);

    return new Promise((res, rej) => {
        downloadFile(
            `${patient._id}/${stepKey}/${fieldKey}/${fileName}`,
        ).createReadStream()
            .pipe(ws)
            .on('end', res)
            .on('error', rej);
    });
};

function signatureToPNG(touchpoints, outputPath) {
    return new Promise((resolve, reject) => {
        let minX = Infinity; let maxX = 0; let minY = Infinity; let
            maxY = 0;
        for (const point of touchpoints) {
            if (point.x < minX) minX = point.x;
            if (point.x > maxX) maxX = point.x;
            if (point.y < minY) minY = point.y;
            if (point.y > maxY) maxY = point.y;
        }

        const width = maxX - minX + 10;
        const height = maxY - minY + 10;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Set the background to white
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = 'black';

        for (let i = 1; i < touchpoints.length; i++) {
            const prevPoint = touchpoints[i - 1];
            const currentPoint = touchpoints[i];
            const timeDifference = currentPoint.time - prevPoint.time;

            // Adjust the line width based on the time difference
            ctx.lineWidth = timeDifference < 10 ? 1 : (timeDifference < 50 ? 2 : 3);

            ctx.beginPath();
            ctx.moveTo(prevPoint.x - minX + 5, prevPoint.y - minY + 5);
            ctx.lineTo(currentPoint.x - minX + 5, currentPoint.y - minY + 5);
            ctx.stroke();
        }

        const buffer = canvas.toBuffer('image/png');
        writeFile(outputPath, buffer, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

function flatten(arr) {
    return arr.reduce((flat, toFlatten) => flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten), []);
}

const decodeValue = async (patient, fieldMeta, stepData, langKey, stepKey) => {
    switch (fieldMeta.fieldType) {
    // There's no valuable data for dividers
    case FIELDS.HEADER:
    case FIELDS.DIVIDER:
        return null;

    case FIELDS.MAP:
    case FIELDS.ACCESS:
        throw new Error(`Cannot process field ${fieldMeta.fieldType}`);

        // Recurse on field groups
    case FIELDS.FIELD_GROUP:
        const output = [];

        for (let i = 0; i < stepData[fieldMeta.key].length; i++) {
            const data = stepData[fieldMeta.key][i];
            for (const subfield of fieldMeta.subFields) {
                const key = `${fieldMeta.displayName[langKey]} ${i + 1} - ${subfield.displayName[langKey]}`;
                const value = await decodeValue(patient, subfield, data, langKey, stepKey);
                output.push([key, value]);
            }
        }

        return output;

        // TODO: Take image of signature
    case FIELDS.SIGNATURE:
        const data = stepData[fieldMeta.key]?.signatureData;
        if (!data?.length) return null;

        await signatureToPNG(flatten(data), join(PATIENT_FILE_DIR, patient.orderId, `${fieldMeta.displayName[langKey]}.png`));
        return 'Signature on file';

        // TODO: Upload files to folder
    case FIELDS.FILE:
    case FIELDS.PHOTO:
    case FIELDS.AUDIO:
        const files = stepData[fieldMeta.key];
        await Promise.all(files.map((file) => download(patient, stepKey, fieldMeta.key, file.filename)));

        return `${files.length} files. See patient folder for raw files.`;

        // Match radio button ID with human-friendly value
    case FIELDS.RADIO_BUTTON:
        const id = stepData[fieldMeta.key].toString();

        // Question is unanswered
        if (!id) return null;

        // Return the string value of the option choosen
        const opt = fieldMeta.options.find((o) => o._id.toString() === id);
        if (!opt) {
            console.warn(`Invalid radio button choice "${id}" on field ${fieldMeta.key}`);
            return null;
        }

        return opt.Question[langKey];

        // Stringify date
    case FIELDS.DATE:
        return stepData[fieldMeta.key].toString();

        // For string based fields we can just return the value
    case FIELDS.MULTILINE_STRING:
    case FIELDS.NUMBER:
    case FIELDS.PATIENT_STATUS:
    case FIELDS.PHONE:
    case FIELDS.STEP_STATUS:
    case FIELDS.STRING:
        return stepData[fieldMeta.key];

    default:
        throw new Error(`Invalid key type: ${fieldMeta.fieldType}`);
    }
};

const autosizeColumns = (worksheet) => {
    worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
            const columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength) {
                maxLength = columnLength;
            }
        });
        column.width = maxLength < 10 ? 10 : maxLength;
    });
};

const createPatientFileInLanguage = async (patient, langKey) => {
    const languageString = langKey === 'EN' ? 'English' : 'Arabic';
    const workbook = new ExcelJS.Workbook();

    const steps = await Step.find({ isDeleted: { $ne: true } });
    await Promise.all(steps.map(async (stepMeta) => {
        const sheet = workbook.addWorksheet(stepMeta.displayName[langKey]);

        const stepData = await mongoose
            .model(stepMeta.key)
            .findOne({ patientId: patient.id });

        if (stepData === null) return;

        // TODO: Match up meta to data
        const keyValuePairs = [];
        await Promise.all(stepMeta.fields.map(async (fieldMeta) => {
            if (fieldMeta.isHidden || fieldMeta.isDeleted || [FIELDS.HEADER, FIELDS.DIVIDER].includes(fieldMeta.fieldType)) { return; }

            const key = fieldMeta.displayName[langKey];
            const value = await decodeValue(patient, fieldMeta, stepData, langKey, stepMeta.key);
            if (Array.isArray(value)) keyValuePairs.push(...value);
            else keyValuePairs.push([key, value]);
        }));

        keyValuePairs.forEach((p) => sheet.addRow(p));
        autosizeColumns(sheet);
    }));

    await workbook.xlsx.writeFile(join(PATIENT_FILE_DIR, patient.orderId, `${patient.orderId} (${languageString}).xlsx`));
};

const createPatientIndex = async () => {
    await createEmptyFile(PATIENT_INDEX_FILENAME);

    const props = getSchemaProperties(Patient);
    writeLine(PATIENT_INDEX_FILENAME, props);

    const patients = await Patient.find({});
    for (const patient of patients) {
        await writePatientToFile(patient, PATIENT_INDEX_FILENAME);
    }
};

// Function to get all top-level properties of a Mongoose Schema
function getSchemaProperties(model) {
    const { schema } = model;
    const { paths } = schema;
    const properties = Object.keys(paths)
        .filter((key) => !key.includes('.')) // This line ensures we only get top-level properties
        .map((key) => key); // Modify this line if you want to manipulate the key or paths[key] in any way

    return properties;
}

const writePatientToFile = async (patient, filename) => {
    const props = getSchemaProperties(Patient);
    writeLine(filename, props.map((p) => patient[p]));
};

async function createEmptyFile(filePath) {
    try {
        writeFileSync(filePath, '');
        console.log(`File created successfully at ${filePath}`);
    } catch (error) {
        console.error('Error creating file:', error);
    }
}

const writeLine = (filename, items) => {
    items.forEach((element) => {
        writeLineItem(filename, element);
        writeLineItem(filename, ',');
    });

    writeLineItem(filename, '\n');
};

const writeLineItem = (filename, item) => {
    if (item === undefined || item === null) return appendFileSync(filename, '');
    if (item instanceof (Date)) return appendFileSync(filename, item.toISOString());
    return appendFileSync(filename, item.toString());
};

exportToCSV();
