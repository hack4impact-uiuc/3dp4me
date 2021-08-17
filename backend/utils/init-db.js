const encrypt = require('mongoose-encryption');
const mongoose = require('mongoose');
const { models } = require('../models');
const { STEP_STATUS_ENUM, FIELDS } = require('./constants');
const { signatureSchema } = require('../schemas/signatureSchema');
const { fileSchema } = require('../schemas/fileSchema');

module.exports.initDB = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.connection
        .once('open', () => {
            console.log('Connected to the DB');
            this.initModels();
        })
        .on('error', (error) =>
            console.log('Error connecting to the database: ', error),
        );

    mongoose.set('useFindAndModify', false);
};

module.exports.initModels = async () => {
    const steps = await models.Step.find();
    for (const step of steps) await this.generateSchemaFromMetadata(step);
};

module.exports.generateSchemaFromMetadata = (stepMetadata) => {
    let stepSchema = {};
    stepSchema.patientId = { type: String, required: true, unique: true };
    stepSchema.status = {
        type: String,
        required: true,
        enum: Object.values(STEP_STATUS_ENUM),
        default: STEP_STATUS_ENUM.UNFINISHED,
    };
    stepSchema.lastEdited = { type: Date, required: true, default: Date.now };
    stepSchema.lastEditedBy = {
        type: String,
        required: true,
        default: 'Admin',
    };
    generateFieldsFromMetadata(stepMetadata.fields, stepSchema);
    const schema = new mongoose.Schema(stepSchema);

    schema.plugin(encrypt, {
        encryptionKey: process.env.ENCRYPTION_KEY,
        signingKey: process.env.SIGNING_KEY,
        excludeFromEncryption: ['patientId'],
    });
    mongoose.model(stepMetadata.key, schema, stepMetadata.key);
};

module.exports.generateFieldSchema = (field) => {
    switch (field.fieldType) {
        case FIELDS.STRING:
            return {
                type: String,
                default: '',
            };
        case FIELDS.MULTILINE_STRING:
            return {
                type: String,
                default: '',
            };
        case FIELDS.NUMBER:
            return {
                type: Number,
                default: 0,
            };
        case FIELDS.DATE:
            return {
                type: Date,
                default: Date.now,
            };
        case FIELDS.PHONE:
            return {
                type: String,
                default: '',
            };
        case FIELDS.RADIO_BUTTON:
            if (!field?.options?.length)
                throw new Error('Radio button must have options');

            return {
                type: String,
                default: '',
            };
        case FIELDS.FILE:
            return {
                type: [fileSchema],
                default: [],
            };
        case FIELDS.AUDIO:
            return {
                type: [fileSchema],
                default: [],
            };
        case FIELDS.FIELD_GROUP:
            if (!field?.subFields?.length)
                throw new Error('Field groups must have sub fields');

            return {
                type: [generateFieldsFromMetadata(field.subFields)],
                required: true,
                default: [],
            };
        case FIELDS.SIGNATURE:
            const defaultURL = field?.additionalData?.defaultDocumentURL;
            if (!defaultURL?.EN || !defaultURL?.AR)
                throw new Error(
                    'Signatures must have a default document for both English and Arabic',
                );

            return { type: signatureSchema };
        case FIELDS.DIVIDER:
            return null;
        default:
            throw new Error(`Unrecognized field type, ${field.type}`);
    }
};

const generateFieldsFromMetadata = (fieldsMetadata, schema = {}) => {
    fieldsMetadata.forEach((field) => {
        const generatedSchema = this.generateFieldSchema(field);
        if (generatedSchema) schema[field.key] = generatedSchema;
    });

    return schema;
};
