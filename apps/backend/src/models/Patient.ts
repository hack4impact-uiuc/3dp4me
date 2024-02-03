import { Patient, PatientStatus } from '@3dp4me/types'
import mongoose from 'mongoose'
import encrypt from 'mongoose-encryption'
import { fileSchema } from 'schemas/fileSchema'

const UNECRYPTED_FIELDS = [
    'dateCreated',
    'orderId',
    'lastEdited',
    'lastEditedBy',
    'status',
    'phoneNumber',
    'orderYear',
]

/**
 * Schema for basic patient information. This is the bare minnimum of info needed
 * to put a patient into the system.
 */
const patientSchema = new mongoose.Schema<Patient>({
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
        enum: Object.values(PatientStatus),
        required: false,
        default: PatientStatus.ACTIVE,
    },
    phoneNumber: { type: String, required: false },
    secret: { type: String, required: false },
    profilePicture: { type: fileSchema, required: false }
})

// Encrypt everything personal
patientSchema.plugin(encrypt, {
    encryptionKey: process.env.ENCRYPTION_KEY,
    signingKey: process.env.SIGNING_KEY,
    excludeFromEncryption: UNECRYPTED_FIELDS,
})

export const PatientModel = mongoose.model<Patient>('Patient', patientSchema, 'Patient')
