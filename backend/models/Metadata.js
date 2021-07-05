const mongoose = require('mongoose');

const fieldEnum = {
    AUDIO: 'Audio',
    STRING: 'String',
    MULTILINE_STRING: 'MultilineString',
    FILE: 'File',
    NUMBER: 'Number',
    DATE: 'Date',
    PHONE: 'Phone',
    DIVIDER: 'Divider',
    HEADER: 'Header',
    RADIO_BUTTON: 'RadioButton',
    MULTI_SELECT: 'MultiSelect',
    AUDIO: 'Audio',
    SIGNATURE: 'Signature',
    PHOTO: 'Photo',
    FIELD_GROUP: 'FieldGroup',
};

const languageSchema = new mongoose.Schema({
    EN: { type: String, required: true },
    AR: { type: String, required: true },
});

const validateOptions = (questionOptionSchema) => {
    var questionIndex = Object.create(null);
    for (var i = 0; i < questionOptionSchema.length; ++i) {
        var value = questionOptionSchema[i];
        if (value.Index in questionIndex) {
            return false;
        }
        questionIndex[value.Index] = true;
    }
    return true;
};

const questionOptionSchema = new mongoose.Schema({
    Index: { type: Number, required: true },
    IsHidden: { type: Boolean, required: true, default: false },
    Question: { type: languageSchema, required: true },
});

const fieldSchema = new mongoose.Schema({
    fieldNumber: { type: Number, required: true },
    key: { type: String, required: true },
    fieldType: {
        type: String,
        enum: Object.values(fieldEnum),
        required: true,
        default: fieldEnum.STRING,
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
    displayName: {
        EN: { type: String, required: true },
        AR: { type: String, required: true },
    },
    readableGroups: { type: [String], required: true, default: [] },
    writableGroups: { type: [String], required: true, default: [] },
});

fieldSchema.add({
    // Yes, this is a recursive schema. Yes, I am ashamed of what I have done
    subFields: {
        type: [fieldSchema],
        required: false,
    },
});

const validateStep = (fieldSchema) => {
    var fieldNumbers = Object.create(null);
    var fieldKeys = Object.create(null);
    for (var i = 0; i < fieldSchema.length; ++i) {
        var value = fieldSchema[i];
        if (value.fieldNumber in fieldNumbers || value.key in fieldKeys) {
            return false;
        }
        fieldNumbers[value.fieldNumber] = true;
        fieldKeys[value.key] = true;
    }
    return true;
};

// Take in session from transaction to check database
const isUniqueStepNumber = async (value, stepKey, session) => {
    const step = await mongoose.connection.db
        .collection('steps')
        .find({ stepNumber: value }, { session: session })
        .toArray();

    if (step.length >= 2) {
        return false;
    } else if (step.length == 0) {
        return true;
    }

    return step[0].key === stepKey;
};

const stepSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    displayName: {
        EN: { type: String, required: true },
        AR: { type: String, required: true },
    },
    stepNumber: {
        type: Number,
        required: true,
    },
    fields: {
        type: [fieldSchema],
        required: true,
        default: [],
        validate: {
            validator: validateStep,
            message: 'fieldKeys and fieldNumbers must be unique',
        },
    },
    readableGroups: { type: [String], required: true },
    writableGroups: { type: [String], required: true },
    defaultToListView: { type: Boolean, default: true },
});

// Add validator to run during other that change stepNumber
stepSchema.path('stepNumber').validate(async function () {
    return await isUniqueStepNumber(this.stepNumber, this.key);
});

const Step = mongoose.model('steps', stepSchema);
module.exports = {
    Step,
    isUniqueStepNumber,
    fieldEnum,
    questionOptionSchema,
    validateOptions,
};
