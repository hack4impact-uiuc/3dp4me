const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
    displayNameEnglish: { type: String, required: true },
    displayNameArabic: { type: String, required: true },
    stepNumber: { type: Number, required: true },
    fields: { type: { fieldSchema }, required: true, default: [] },
});

const fieldSchema = new mongoose.Schema({
    fieldType: { type: String, required: true },
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
