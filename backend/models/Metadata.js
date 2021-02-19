const mongoose = require('mongoose');

const fieldEnum = {
    STRING: 'String',
    MULTILINE_STRING: 'String',
    FILE: 'File',
    NUMBER: 'Number',
    DATE: 'Date',
    ENUM: 'Enum',
};

const fieldSchema = new mongoose.Schema({
    fieldNumber: { type: Number, required: true },
    key: { type: String, required: true },
    fieldType: {
        type: String,
        enum: Object.values(fieldEnum),
        required: true,
        default: fieldEnum.STRING,
    },
    isVisibleOnDashboard: { type: Boolean, required: true },
    displayName: {
        EN: { type: String, required: true },
        AR: { type: String, required: true },
    },
    readableGroups: { type: [String], required: true },
    writableGroups: { type: [String], required: true },
});

const validateStep = async (fieldSchema) => {
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

const stepSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    displayName: {
        EN: { type: String, required: true },
        AR: { type: String, required: true },
    },
    stepNumber: { type: Number, required: true, unique: true },
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
});

const Step = mongoose.model('steps', stepSchema);
module.exports = { Step, fieldEnum };
