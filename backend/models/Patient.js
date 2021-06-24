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
    dateCreated: { type: Date, required: false, default: Date.now },
    orderId: { type: String, required: false, default: '' },
    lastEdited: { type: Date, required: false, default: Date.now },
    lastEditedBy: { type: String, required: true },
    status: {
        type: overallStatusEnum,
        required: false,
        default: overallStatusEnum.ACTIVE,
    },
});

const Patient = mongoose.model('Patient', patientSchema, 'Patient');

module.exports = {
    Patient,
    overallStatusEnum,
};
