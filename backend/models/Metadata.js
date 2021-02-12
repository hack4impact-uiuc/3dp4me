const mongoose = require('mongoose');

const fieldEnum = {
    STRING: 'String',
    FILE: 'File',
    NUMBER: 'Number',
    DATE: 'Date',
    ENUM: 'Enum',
};

const stepSchema = new mongoose.Schema({
    key: { type: String, required: true },
    displayNameEnglish: { type: String, required: true },
    displayNameArabic: { type: String, required: true },
    stepNumber: { type: Number, required: true },
    fields: { type: [fieldSchema], required: true, default: [] },
});

const fieldSchema = new mongoose.Schema({
    fieldType: {
        type: String,
        enum: Object.values(fieldEnum),
        required: true,
        default: fieldEnum.STRING,
    },
    displayNameEnglish: { type: String, required: true },
    displayNameArabic: { type: String, required: true },
});

const metaDataSchema = new mongoose.Schema({
    steps: {
        type: [stepSchema],
        default: [],
    },
});

const metaData = mongoose.model('metadata', metaDataSchema);

module.exports = { metaData };
