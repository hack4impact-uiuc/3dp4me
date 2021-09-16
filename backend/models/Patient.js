const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const { PATIENT_STATUS_ENUM } = require('../utils/constants');

const UNECRYPTED_FIELDS = [
    'dateCreated',
    'orderId',
    'lastEdited',
    'lastEditedBy',
    'status',
];

/**
 * Schema for basic patient information. This is the bare minnimum of info needed
 * to put a patient into the system.
 */
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
        type: String,
        enum: Object.values(PATIENT_STATUS_ENUM),
        required: false,
        default: PATIENT_STATUS_ENUM.ACTIVE,
    },
});

// Encrypt everything personal
patientSchema.plugin(encrypt, {
    encryptionKey: process.env.ENCRYPTION_KEY,
    signingKey: process.env.SIGNING_KEY,
    excludeFromEncryption: UNECRYPTED_FIELDS,
});

module.exports.Patient = mongoose.model('Patient', patientSchema, 'Patient');
