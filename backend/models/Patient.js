const mongoose = require('mongoose');

const overallStatusEnum = {
    ACTIVE: 'Active',
    ARCHIVED: 'Archived',
    FEEDBACK: 'Feedback',
};

const patientSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    fathersName: { type: String, required: false, default: '' },
    grandfathersName: { type: String, required: false, default: '' },
    familyName: { type: String, required: true },
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
