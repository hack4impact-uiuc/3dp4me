const mongoose = require('mongoose');
const { languageSchema } = require('../schemas/languageSchema');
const {
    FIELDS,
    ERR_FIELD_VALIDATION_FAILED,
    STEPS_COLLECTION_NAME,
} = require('../utils/constants');

/**
 * Validates a step's question options by insuring that all of the
 * indices are unique.
 * @returns True if valid, false otherwise.
 */
module.exports.validateOptions = (questionOptionSchema) => {
    var questionIndex = Object.create(null);
    for (var i = 0; i < questionOptionSchema.length; ++i) {
        // Check if we've already seen this index
        var value = questionOptionSchema[i];
        if (value.Index in questionIndex) return false;

        // Else, track this index and continue
        questionIndex[value.Index] = true;
    }

    return true;
};

/**
 * Checks if the step number is unique among all other steps. This
 * function is meant to be called in transactions.
 * @param {Number} stepNumber The step number to check.
 * @param {String} stepKey The stepKey for the step we're validating.
 * @param {Object} session The session object for this transaction.
 * @returns True if the step number is unique.
 */
const isUniqueStepNumber = async (stepNumber, stepKey, session) => {
    // Find all steps with this step number
    const steps = await mongoose.connection.db
        .collection(STEPS_COLLECTION_NAME)
        .find({ stepNumber: stepNumber }, { session: session })
        .toArray();

    // If there's more than one, it's not unique.
    if (steps.length >= 2) return false;

    // If there's zero, then we're about to add it, and it must be unique
    if (steps.length === 0) return true;

    // If there's exactly one, the stepKeys better match
    return steps[0].key === stepKey;
};
module.exports.isUniqueStepNumber = isUniqueStepNumber;

/**
 * Schema for a question option. E.g. radio button field.
 */
module.exports.questionOptionSchema = new mongoose.Schema({
    Index: { type: Number, required: true },
    IsHidden: { type: Boolean, required: true, default: false },
    Question: { type: languageSchema, required: true },
});

/**
 * Validates a step by insuring that all of the fields have unique keys
 * and indices.
 * @returns True if valid, false otherwise.
 */
const validateStep = (fieldSchema) => {
    var fieldNumbers = Object.create(null);
    var fieldKeys = Object.create(null);
    for (var i = 0; i < fieldSchema.length; ++i) {
        // Check if we've already seen this fieldNumber or fieldKey
        var value = fieldSchema[i];
        if (value.fieldNumber in fieldNumbers || value.key in fieldKeys)
            return false;

        // Else, track number/key and continue
        fieldNumbers[value.fieldNumber] = true;
        fieldKeys[value.key] = true;
    }

    return true;
};

/**
 * Schema for an individual field in a step.
 */
const fieldSchema = new mongoose.Schema({
    fieldNumber: { type: Number, required: true },
    key: { type: String, required: true },
    fieldType: {
        type: String,
        enum: Object.values(FIELDS),
        default: FIELDS.STRING,
        required: true,
    },
    options: {
        type: [this.questionOptionSchema],
        validate: {
            validator: this.validateOptions,
            message: 'Index must be unique',
        },
        required: false,
    },
    isVisibleOnDashboard: { type: Boolean, required: true, default: false },
    displayName: { type: languageSchema, required: true },
    readableGroups: { type: [String], required: true, default: [] },
    writableGroups: { type: [String], required: true, default: [] },

    // This field is for any additional data that doesn't fit in this schema. Try to avoid using this if possible.
    // If you must use this, add asserts to generateFieldSchema to make sure this has the proper data
    additionalData: { type: mongoose.Schema.Types.Mixed, required: false },
});

// We need to allow fields to have sub-fields (for fieldGroups, see the devices tab). This
// forces us to have a recursive schema...
fieldSchema.add({
    subFields: {
        type: [fieldSchema],
        required: false,
    },
});

/**
 * Schema for a step's metadata.
 */
const stepSchema = new mongoose.Schema({
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
});

// Run validator when stepNumber is changed.
stepSchema.path('stepNumber').validate(async function () {
    return await isUniqueStepNumber(this.stepNumber, this.key);
});

module.exports.Step = mongoose.model(STEPS_COLLECTION_NAME, stepSchema);
