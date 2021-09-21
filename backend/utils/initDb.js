const log = require('loglevel');
const _ = require('lodash');
const encrypt = require('mongoose-encryption');
const mongoose = require('mongoose');

const { models } = require('../models');
const { signatureSchema } = require('../schemas/signatureSchema');
const { fileSchema } = require('../schemas/fileSchema');

const { STEP_STATUS_ENUM, FIELDS } = require('./constants');

/**
 * Initalizes and connects to the DB. Should be called at app startup.
 */
module.exports.initDB = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.connection
        .once('open', () => {
            log.info('Connected to the DB');
            this.initModels();
        })
        .on('error', (error) => log.error('Error connecting to the database: ', error));
};

/**
 * Initializes all of the dynamic models in the DB. Should be called immediately after initDB.
 */
module.exports.initModels = async () => {
    const steps = await models.Step.find();
    steps.forEach((step) => this.generateSchemaFromMetadata(step));
};

/**
 * Generate and registers a schema based off the provided metadata.
 */
module.exports.generateSchemaFromMetadata = (stepMetadata) => {
    let stepSchema = getStepBaseSchema();
    stepSchema = generateFieldsFromMetadata(stepMetadata.fields, stepSchema);
    const schema = new mongoose.Schema(stepSchema);

    schema.plugin(encrypt, {
        encryptionKey: process.env.ENCRYPTION_KEY,
        signingKey: process.env.SIGNING_KEY,
        excludeFromEncryption: ['patientId'],
    });
    mongoose.model(stepMetadata.key, schema, stepMetadata.key);
};

/**
 * Returns a list of keys that are included in the base schema for a step.
 * @returns An array of strings
 */
module.exports.getStepBaseSchemaKeys = () => {
    const baseSchema = getStepBaseSchema();
    const keys = Object.keys(baseSchema);
    keys.push('_id');
    return keys;
};

/**
 * Be careful modifying this base schema. We use it all over the app! Do a string search
 * for the field name across the entire project to find references before changing something.
 */
const getStepBaseSchema = () => {
    const stepSchema = {};
    stepSchema.patientId = { type: String, required: true, unique: true };
    stepSchema.lastEdited = { type: Date, required: true, default: Date.now };
    stepSchema.status = {
        type: String,
        required: true,
        enum: Object.values(STEP_STATUS_ENUM),
        default: STEP_STATUS_ENUM.UNFINISHED,
    };
    stepSchema.lastEditedBy = {
        type: String,
        required: true,
        default: 'Admin',
    };
    return stepSchema;
};

/**
 * Generates the schema for a given field type.
 * @param {String} field Field type (see constants.js).
 * @returns An object describing the field schema.
 */
module.exports.generateFieldSchema = (field) => {
    switch (field.fieldType) {
    case FIELDS.STRING:
        return getStringSchema();
    case FIELDS.MULTILINE_STRING:
        return getStringSchema();
    case FIELDS.NUMBER:
        return getNumberSchema();
    case FIELDS.DATE:
        return getDateSchema();
    case FIELDS.PHONE:
        return getStringSchema();
    case FIELDS.RADIO_BUTTON:
        return getRadioButtonSchema(field);
    case FIELDS.FILE:
        return getFileSchema();
    case FIELDS.AUDIO:
        return getFileSchema();
    case FIELDS.FIELD_GROUP:
        return getFieldGroupSchema(field);
    case FIELDS.SIGNATURE:
        return getSignatureSchema(field);
    case FIELDS.DIVIDER:
        return null;
    default:
        throw new Error(`Unrecognized field type, ${field.type}`);
    }
};

const getStringSchema = () => ({
    type: String,
    default: '',
});

const getNumberSchema = () => ({
    type: Number,
    default: 0,
});

const getDateSchema = () => ({
    type: Date,
    default: Date.now,
});

const getRadioButtonSchema = (fieldMetadata) => {
    if (!fieldMetadata?.options?.length) throw new Error('Radio button must have options');

    return {
        type: String,
        default: '',
    };
};

const getFieldGroupSchema = (fieldMetadata) => {
    if (!fieldMetadata?.subFields?.length) throw new Error('Field groups must have sub fields');

    return {
        type: [generateFieldsFromMetadata(fieldMetadata.subFields)],
        required: true,
        default: [],
    };
};

const getFileSchema = () => ({
    type: [fileSchema],
    default: [],
});

const getSignatureSchema = (fieldMetadata) => {
    const defaultURL = fieldMetadata?.additionalData?.defaultDocumentURL;
    if (!defaultURL?.EN || !defaultURL?.AR) {
        throw new Error(
            'Signatures must have a default document for both English and Arabic',
        );
    }

    return { type: signatureSchema };
};

const generateFieldsFromMetadata = (fieldsMetadata, schema = {}) => {
    const updatedSchema = _.cloneDeep(schema);

    fieldsMetadata.forEach((field) => {
        const generatedSchema = this.generateFieldSchema(field);
        if (generatedSchema) updatedSchema[field.key] = generatedSchema;
    });

    return updatedSchema;
};
