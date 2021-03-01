const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    uploadDate: { type: Date, required: true },
});

//Keep this
const overallStatusEnum = {
    ACTIVE: 'Active',
    ARCHIVED: 'Archived',
    FEEDBACK: 'Feedback',
};

//Keep this
const stageStatusEnum = {
    UNFINISHED: 'unfinished',
    PARTIAL: 'partial',
    FINISHED: 'finished',
};

// TODO: add / remove stage fields as needed
const patientSchema = new mongoose.Schema({});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = {
    Patient,
    stageStatusEnum,
    deliveryEnum,
    feedbackEnum,
    fileSchema,
    overallStatusEnum,
};
