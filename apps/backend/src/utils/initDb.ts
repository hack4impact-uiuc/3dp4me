import { Field, FieldType, Step, StepStatus } from '@3dp4me/types'
import _ from 'lodash'
import log from 'loglevel'
import mongoose, { SchemaDefinitionProperty } from 'mongoose'
import encrypt from 'mongoose-encryption'

import { StepModel } from '../models/Metadata'
import { fileSchema } from '../schemas/fileSchema'
import { signatureSchema } from '../schemas/signatureSchema'

/**
 * Initalizes and connects to the DB. Should be called at app startup.
 */
export const initDB = (callback?: Function) => {
    mongoose.connect(process.env.DB_URI!, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    })

    mongoose.connection
        .once('open', () => {
            log.info('Connected to the DB')
            initModels()
            callback?.()
        })
        .on('error', (error) => log.error('Error connecting to the database: ', error))
}

const clearModels = async () => {
    const steps = await StepModel.find()
    steps.forEach((step) => {
        // @ts-ignore
        delete mongoose.connection.models[step.key]
    })
}

export const reinitModels = async () => {
    await clearModels()
    await initModels()
}

/**
 * Initializes all of the dynamic models in the DB. Should be called immediately after initDB.
 */
export const initModels = async () => {
    const steps = await StepModel.find()
    steps.forEach((step) => generateSchemaFromMetadata(step))
}

/**
 * Generate and registers a schema based off the provided metadata.
 */
export const generateSchemaFromMetadata = (stepMetadata: Step) => {
    const stepSchema = generateFieldsFromMetadata(stepMetadata.fields, getStepBaseSchema())
    const schema = new mongoose.Schema(stepSchema)

    schema.plugin(encrypt, {
        encryptionKey: process.env.ENCRYPTION_KEY,
        signingKey: process.env.SIGNING_KEY,
        excludeFromEncryption: ['patientId'],
    })
    mongoose.model(stepMetadata.key, schema, stepMetadata.key)
}

/**
 * Returns a list of keys that are included in the base schema for a step.
 * @returns An array of strings
 */
export const getStepBaseSchemaKeys = () => {
    const baseSchema = getStepBaseSchema()
    const keys = Object.keys(baseSchema)
    keys.push('_id')
    return keys
}

/**
 * Be careful modifying this base schema. We use it all over the app! Do a string search
 * for the field name across the entire project to find references before changing something.
 */
const getStepBaseSchema = () => ({
    patientId: { type: String, required: true, unique: true },
    lastEdited: { type: Date, required: true, default: Date.now },
    status: {
        type: String,
        required: true,
        enum: Object.values(StepStatus),
        default: StepStatus.UNFINISHED,
    },
    lastEditedBy: {
        type: String,
        required: true,
        default: 'Admin',
    },
})

/**
 * Generates the schema for a given field type.
 * @param {String} field Field type (see constants.js).
 * @returns An object describing the field schema.
 */
export const generateFieldSchema = (field: Field): SchemaDefinitionProperty | null => {
    switch (field.fieldType) {
        case FieldType.STRING:
            return getStringSchema()
        case FieldType.MULTILINE_STRING:
            return getStringSchema()
        case FieldType.NUMBER:
            return getNumberSchema()
        case FieldType.DATE:
            return getDateSchema()
        case FieldType.PHONE:
            return getStringSchema()
        case FieldType.RADIO_BUTTON:
            return getRadioButtonSchema(field)
        case FieldType.FILE:
            return getFileSchema()
        case FieldType.PHOTO:
            return getFileSchema()
        case FieldType.AUDIO:
            return getFileSchema()
        case FieldType.FIELD_GROUP:
            return getFieldGroupSchema(field)
        case FieldType.SIGNATURE:
            return getSignatureSchema(field)
        case FieldType.DIVIDER:
            return null
        case FieldType.MAP:
            return getMapSchema()
        default:
            log.error(`Unrecognized field type, ${field.fieldType}`)
            return null
    }
}

const getStringSchema = () => ({
    type: String,
    default: '',
})

const getNumberSchema = () => ({
    type: Number,
    default: 0,
})

const getDateSchema = () => ({
    type: Date,
    default: Date.now,
})

const getRadioButtonSchema = (fieldMetadata: Field) => {
    if (!fieldMetadata?.options?.length) {
        throw new Error('Radio button must have options')
    }

    return {
        type: String,
        default: '',
    }
}

const getFieldGroupSchema = (fieldMetadata: Field) => {
    // Field groups can have 0 sub fields.
    if (!fieldMetadata?.subFields) {
        throw new Error('Field groups must have sub fields')
    }

    return {
        type: [generateFieldsFromMetadata(fieldMetadata.subFields)],
        required: true,
        default: [],
    }
}

const getFileSchema = () => ({
    type: [fileSchema],
    default: [],
})

const getSignatureSchema = (fieldMetadata: Field) => {
    const defaultURL = fieldMetadata?.additionalData?.defaultDocumentURL
    if (!defaultURL?.EN || !defaultURL?.AR) {
        throw new Error('Signatures must have a default document for both English and Arabic')
    }

    return { type: signatureSchema }
}

const getMapSchema = () => ({
    type: {
        latitude: Number,
        longitude: Number,
    },
})

const generateFieldsFromMetadata = (fieldsMetadata: Field[], baseSchema = {}) => {
    const generatedSchema = fieldsMetadata.map((field) => {
        const s = generateFieldSchema(field)
        if (!s) return null

        return {
            [field.key]: s,
        }
    })

    return Object.assign(_.cloneDeep(baseSchema), ...generatedSchema)
}
