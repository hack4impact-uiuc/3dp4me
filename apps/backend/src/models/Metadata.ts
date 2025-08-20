import { Field, FieldType, Step } from '@3dp4me/types'
import mongoose, { ClientSession, InferSchemaType } from 'mongoose'

import { languageSchema } from '../schemas/languageSchema'
import { ERR_FIELD_VALIDATION_FAILED, STEPS_COLLECTION_NAME } from '../utils/constants'

/**
 * Validates a step's question options by insuring that all of the
 * indices are unique.
 * @returns True if valid, false otherwise.
 */
export const validateOptions = (
    questionOptions: InferSchemaType<typeof questionOptionSchema>[]
) => {
    const questionIndex = Object.create(null)
    for (let i = 0; i < questionOptions.length; ++i) {
        // Check if we've already seen this index
        const value = questionOptions[i]
        if (value.Index in questionIndex) return false

        // Else, track this index and continue
        questionIndex[value.Index] = true
    }

    return true
}

/**
 * Checks if the step number is unique among all other steps. This
 * function is meant to be called in transactions.
 * @returns True if the step number is unique.
 */
export const isUniqueStepNumber = async (
    stepNumber: number,
    stepKey: string,
    session?: ClientSession
) => {
    // Find all steps with this step number
    const steps = await mongoose.connection.db
        .collection(STEPS_COLLECTION_NAME)
        .find({ stepNumber }, { session })
        .toArray()

    // If there's more than one, it's not unique.
    if (steps.length >= 2) return false

    // If there's zero, then we're about to add it, and it must be unique
    if (steps.length === 0) return true

    // If there's exactly one, the stepKeys better match
    return steps[0].key === stepKey
}

/**
 * Schema for a question option. E.g. radio button field.
 */
export const questionOptionSchema = new mongoose.Schema({
    Index: { type: Number, required: true },
    IsHidden: { type: Boolean, required: true, default: false },
    Question: { type: languageSchema, required: true },
})

/**
 * Validates a step by insuring that all of the fields have unique keys
 * and indices.
 * @returns True if valid, false otherwise.
 */
const validateStep = (field: InferSchemaType<typeof fieldSchema>[]) => {
    const fieldNumbers = Object.create(null)
    const fieldKeys = Object.create(null)
    for (let i = 0; i < field.length; ++i) {
        // Check if we've already seen this fieldNumber or fieldKey
        const value = field[i]
        if (value.fieldNumber in fieldNumbers || value.key in fieldKeys) {
            return false
        }

        // Else, track number/key and continue
        fieldNumbers[value.fieldNumber] = true
        fieldKeys[value.key] = true
    }

    return true
}

/**
 * Schema for an individual field in a step.
 */
export const fieldSchema = new mongoose.Schema<Field>({
    fieldNumber: { type: Number, required: true },
    key: { type: String, required: true },
    fieldType: {
        type: String,
        enum: Object.values(FieldType),
        default: FieldType.STRING,
        required: true,
    },
    options: {
        type: [questionOptionSchema],
        validate: {
            validator: validateOptions,
            message: 'Index must be unique',
        },
        required: false,
    },
    isVisibleOnDashboard: { type: Boolean, required: true, default: false },
    displayName: { type: languageSchema, required: true },
    readableGroups: { type: [String], required: true, default: [] },
    writableGroups: { type: [String], required: true, default: [] },
    isHidden: { type: Boolean, required: false, default: false },
    isDeleted: { type: Boolean, required: false, default: false },
    // This field is for additional data that doesn't fit in this schema. Try to avoid using this.
    // If you must use this, add asserts to generateFieldSchema to ensure this has proper data.
    additionalData: { type: mongoose.Schema.Types.Mixed, required: false },
})

// We need to allow fields to have sub-fields (for fieldGroups, see the devices tab). This
// forces us to have a recursive schema...
fieldSchema.add({
    subFields: {
        type: [fieldSchema],
        required: false,
    },
})

/**
 * Schema for a step's metadata.
 */
const stepSchema = new mongoose.Schema<Step>({
    key: { type: String, required: true, unique: true },
    displayName: { type: languageSchema, required: true },
    stepNumber: { type: Number, required: true },
    readableGroups: { type: [String], required: true },
    writableGroups: { type: [String], required: true },
    defaultToListView: { type: Boolean, default: true },
    fields: {
        type: [fieldSchema],
        required: true,
        default: [],
        validate: {
            validator: validateStep,
            message: ERR_FIELD_VALIDATION_FAILED,
        },
    },
    isHidden: { type: Boolean, required: false, default: false },

    isDeleted: { type: Boolean, required: false, default: false },
})

// Run validator when stepNumber is changed.
stepSchema.path('stepNumber').validate(async function () {
    return isUniqueStepNumber(this.stepNumber, this.key)
})

// This must be at end of file so that isUniqueStepNumber is bound in the stepNumber validator
export const StepModel = mongoose.model<Step>(STEPS_COLLECTION_NAME, stepSchema)
export const FIELD_NUMBER_KEY = 'fieldNumber'
export const STEP_NUMBER_KEY = 'stepNumber'
