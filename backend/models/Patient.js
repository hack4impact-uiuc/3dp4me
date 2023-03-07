const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const { PATIENT_STATUS_ENUM } = require('../utils/constants');

const UNECRYPTED_FIELDS = [
    'dateCreated',
    'orderId',
    'lastEdited',
    'lastEditedBy',
    'status',
    'phoneNumber',
];

/**
 * Schema for basic patient information. This is the bare minnimum of info needed
 * to put a patient into the system.
 */
const patientSchema = new mongoose.Schema({
    firstName: { type: String, required: false },
    fathersName: { type: String, required: false, default: '' },
    grandfathersName: { type: String, required: false, default: '' },
    familyName: { type: String, required: false },
    dateCreated: { type: Date, required: false, default: Date.now },
    orderYear: { type: Number, required: true },
    orderId: { type: String, required: true, unique: true },
    lastEdited: { type: Date, required: false, default: Date.now },
    lastEditedBy: { type: String, required: false },
    status: {
        type: String,
        enum: Object.values(PATIENT_STATUS_ENUM),
        required: false,
        default: PATIENT_STATUS_ENUM.ACTIVE,
    },
    phoneNumber: { type: String, required: false },
    secret: { type: String, required: false },
});

// Encrypt everything personal
patientSchema.plugin(encrypt, {
    encryptionKey: process.env.ENCRYPTION_KEY,
    signingKey: process.env.SIGNING_KEY,
    excludeFromEncryption: UNECRYPTED_FIELDS,
});

module.exports.Patient = mongoose.model('Patient', patientSchema, 'Patient');
