require('dotenv').config({ path: `${process.env.NODE_ENV}.env` });
const { promisify } = require("util")
const { exit } = require("process")
const { initDB } = require("../utils/initDb");
const { appendFileSync, writeFile, writeFileSync, mkdirSync, existsSync } = require('fs');
const { Patient } = require('../models/Patient');
const { join } = require('path');
const ExcelJS = require('exceljs');
const { Step } = require('../models/Metadata');
const mongoose = require('mongoose');
const { FIELDS } = require('../utils/constants');

const PATIENT_INDEX_FILENAME = "./patient-directory.csv"
const PATIENT_FILE_DIR = "./patients"
const LANGUAGES = ["EN", "AR"]

const exportToCSV = async () => {
    console.log("Exporting to CSV")
    initDB(async () => {
        console.log("Connected to DB")
        await createPatientIndex()
        await createPatientFiles()
        exit(0)
    })
}

const createPatientFiles = async () => {
    if (!existsSync(PATIENT_FILE_DIR))
        mkdirSync(PATIENT_FILE_DIR)
    const patients = await Patient.find({ orderId: "A00023"})
    return Promise.all(patients.map(createPatientFile))
}

const createPatientFile = async (patient) => {
    console.log(`Writing patient ${patient.orderId}`)
    await Promise.all(LANGUAGES.map(l => createPatientFileInLanguage(patient, l)))
    console.log(`Done with patient ${patient.orderId}`)
}

const decodeValue = (fieldMeta, stepData, langKey) => {
    switch (fieldMeta.fieldType) {
        case FIELDS.HEADER:
        case FIELDS.DIVIDER:
            return null;

        case FIELDS.MAP:
        case FIELDS.ACCESS:
            //throw new Error("Cannot process field " + fieldMeta.fieldType);
            return null


        // TODO: How to handle field groups?
        case FIELDS.FIELD_GROUP:
            return null

        // TODO: Take image of signature
        case FIELDS.SIGNATURE:
            return null

        // TODO: Upload files to folder
        case FIELDS.FILE:
        case FIELDS.AUDIO:
            return `${stepData[fieldMeta.key].length} files. See patient folder for raw files.`

        case FIELDS.RADIO_BUTTON:
            const id = stepData[fieldMeta.key].toString()

            // Question is unanswered
            if (!id)
                return null;

            // Return the string value of the option choosen
            const opt = fieldMeta.options.find(o => o._id.toString() === id)
            if (!opt) {
                console.warn(`Invalid radio button choice "${id}" on field ${fieldMeta.key}`)
                return null
            }

            return opt.Question[langKey]

        case FIELDS.DATE:
            return stepData[fieldMeta.key].toString()

        case FIELDS.MULTILINE_STRING:
        case FIELDS.NUMBER:
        case FIELDS.PATIENT_STATUS:
        case FIELDS.PHONE:
        case FIELDS.PHOTO:
        case FIELDS.STEP_STATUS:
        case FIELDS.STRING:
            return stepData[fieldMeta.key]

        default:
            throw new Error("Invalid key type: " + fieldMeta.fieldType)
    }
}

const autosizeColumns = (worksheet) => {
    worksheet.columns.forEach(function (column, i) {
        let maxLength = 0;
        column["eachCell"]({ includeEmpty: true }, function (cell) {
            var columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength ) {
                maxLength = columnLength;
            }
        });
        column.width = maxLength < 10 ? 10 : maxLength;
    });
}

const createPatientFileInLanguage = async (patient, langKey) => {
    const languageString = langKey === "EN" ? "English" : "Arabic"
    const workbook = new ExcelJS.Workbook()

    const steps = await Step.find({ isDeleted: { $ne: true } })
    await Promise.all(steps.map(async (stepMeta) => {
        const sheet = workbook.addWorksheet(stepMeta.displayName[langKey])

        let stepData = await mongoose
            .model(stepMeta.key)
            .findOne({ patientId: patient.id });

        if (stepData === null)
            return

        // TODO: Match up meta to data
        keyValuePairs = stepMeta.fields.map(fieldMeta => {
            if (fieldMeta.isHidden || fieldMeta.isDeleted || [FIELDS.HEADER, FIELDS.DIVIDER].includes(fieldMeta.fieldType)) 
                return null

            const key = fieldMeta.displayName[langKey] 
            const value = decodeValue(fieldMeta, stepData, langKey)

            return [key, value]
        }).filter(i => !!i)

        keyValuePairs.forEach(p => sheet.addRow(p))
        autosizeColumns(sheet)
    }))

    await workbook.xlsx.writeFile(join(PATIENT_FILE_DIR, `${patient.orderId} (${languageString}).xlsx`))
}

const createPatientIndex = async () => {
    await createEmptyFile(PATIENT_INDEX_FILENAME)

    const props = getSchemaProperties(Patient)
    writeLine(PATIENT_INDEX_FILENAME, props)

    const patients = await Patient.find({})
    for (const patient of patients) {
        await writePatientToFile(patient, PATIENT_INDEX_FILENAME)
    }
}

// Function to get all top-level properties of a Mongoose Schema
function getSchemaProperties(model) {
    const schema = model.schema
    const paths = schema.paths;
    const properties = Object.keys(paths)
      .filter(key => !key.includes('.'))  // This line ensures we only get top-level properties
      .map(key => key);  // Modify this line if you want to manipulate the key or paths[key] in any way
    
    return properties;
  }

const writePatientToFile = async (patient, filename) => {
    const props = getSchemaProperties(Patient)
    writeLine(filename, props.map(p => patient[p]))
}

async function createEmptyFile(filePath) {
    try {
        writeFileSync(filePath, '');
        console.log(`File created successfully at ${filePath}`);
    } catch (error) {
        console.error('Error creating file:', error);
    }
}

const writeLine = (filename, items) => {
    items.forEach(element => {
        writeLineItem(filename, element)
        writeLineItem(filename, ",")
    });

    writeLineItem(filename, "\n")
}

const writeLineItem = (filename, item) => {
    if (item === undefined || item === null)
        return appendFileSync(filename, "")
    if (item instanceof(Date))
        return appendFileSync(filename, item.toISOString())
    return appendFileSync(filename, item.toString())
}

exportToCSV()