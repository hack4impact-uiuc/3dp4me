import log from 'loglevel';
import _ from 'lodash';
import encrypt from 'mongoose-encryption';
import mongoose, { Schema, SchemaDefinition, SchemaDefinitionProperty } from 'mongoose';

import { signatureSchema } from '../schemas/signatureSchema';
import { fileSchema } from '../schemas/fileSchema';

import { STEP_STATUS_ENUM, FIELDS } from './constants';
import { StepModel, Step, Field } from '../models/Metadata';

/**
 * Initalizes and connects to the DB. Should be called at app startup.
 */
export const initDB = (callback?: Function) => {
    mongoose.connect(process.env.DB_URI!, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    });

    mongoose.connection
        .once('open', () => {
            log.info('Connected to the DB');
            initModels();
            callback?.();
        })
        .on('error', (error) =>
            log.error('Error connecting to the database: ', error),
        );
};

const clearModels = async () => {
    const steps = await StepModel.find();
    steps.forEach((step) => {
        // @ts-ignore
        delete mongoose.connection.models[step.key];
    });
};

export const reinitModels = async () => {
    await clearModels();
    await initModels();
};

/**
 * Initializes all of the dynamic models in the DB. Should be called immediately after initDB.
 */
export const initModels = async () => {
    const steps = await StepModel.find();
    steps.forEach((step) => generateSchemaFromMetadata(step));
};

/**
 * Generate and registers a schema based off the provided metadata.
 */
export const generateSchemaFromMetadata = (stepMetadata: Step) => {
    const stepSchema = generateFieldsFromMetadata(stepMetadata.fields, getStepBaseSchema());
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
export const getStepBaseSchemaKeys = () => {
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
    return {
        patientId: { type: String, required: true, unique: true },
        lastEdited: { type: Date, required: true, default: Date.now },
        status: {
            type: String,
            required: true,
            enum: Object.values(STEP_STATUS_ENUM),
            default: STEP_STATUS_ENUM.UNFINISHED,
        },
        lastEditedBy: {
            type: String,
            required: true,
            default: 'Admin',
        }
    };
};

/**
 * Generates the schema for a given field type.
 * @param {String} field Field type (see constants.js).
 * @returns An object describing the field schema.
 */
export const generateFieldSchema = (field: Field): SchemaDefinitionProperty | null => {
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
        case FIELDS.PHOTO:
            return getFileSchema();
        case FIELDS.AUDIO:
            return getFileSchema();
        case FIELDS.FIELD_GROUP:
            return getFieldGroupSchema(field);
        case FIELDS.SIGNATURE:
            return getSignatureSchema(field);
        case FIELDS.DIVIDER:
            return null;
        case FIELDS.MAP:
            return getMapSchema();
        default:
            log.error(`Unrecognized field type, ${field.fieldType}`);
            return null;
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

const getRadioButtonSchema = (fieldMetadata: Field) => {
    if (!fieldMetadata?.options?.length) {
        throw new Error('Radio button must have options');
    }

    return {
        type: String,
        default: '',
    };
};

const getFieldGroupSchema = (fieldMetadata: Field) => {
    // Field groups can have 0 sub fields.
    if (!fieldMetadata?.subFields) {
        throw new Error('Field groups must have sub fields');
    }

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

const getSignatureSchema = (fieldMetadata: Field) => {
    const defaultURL = fieldMetadata?.additionalData?.defaultDocumentURL;
    if (!defaultURL?.EN || !defaultURL?.AR) {
        throw new Error(
            'Signatures must have a default document for both English and Arabic',
        );
    }

    return { type: signatureSchema };
};

const getMapSchema = () => ({
    type: {
        latitude: Number,
        longitude: Number,
    },
});

const generateFieldsFromMetadata = (fieldsMetadata: Field[], baseSchema = {}) => {
    const generatedSchema = fieldsMetadata.map((field) => {
        const s = generateFieldSchema(field);
        if (!s)
            return null

        return {
            [field.key]: s
        }
    });

    return Object.assign(_.cloneDeep(baseSchema), ...generatedSchema)
};
