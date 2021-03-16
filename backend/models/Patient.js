const mongoose = require('mongoose');

const overallStatusEnum = {
    ACTIVE: 'Active',
    ARCHIVED: 'Archived',
    FEEDBACK: 'Feedback',
};

// TODO: add / remove stage fields as needed
const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateCreated: { type: Date, required: true, default: new Date() },
    orderId: { type: String, required: true },
    lastEdited: { type: Date, required: true, default: new Date() },
    lastEditedBy: { type: String, required: true },
    status: { type: overallStatusEnum, required: true },
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = {
    Patient,
    overallStatusEnum,
};
