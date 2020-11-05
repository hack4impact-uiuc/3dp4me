const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    uploadDate: { type: Date, required: true }
});

<<<<<<< HEAD
=======
const statusEnum = {
    NOTTOUCHED: "NOT TOUCHED",
    PARTIALLYDONE: "PARTIALLY DONE",
    COMPLETE: "COMPLETE"
};

>>>>>>> origin/aws-backend-auth
// TODO: add / remove stage fields as needed
const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    serial: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    folder: { type: String, required: true },
    medicalInformation: {
        status: {
            type: String,
<<<<<<< HEAD
            enum: ['Not Touched', 'Partially Done', 'Complete'],
            default: 'Not Touched'
=======
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
>>>>>>> origin/aws-backend-auth
        },
        lastEdit: { type: Date, default: Date.now() },
        lastEditBy: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: { type: [fileSchema], default: [] }
    },
    scan: {
        status: {
            type: String,
<<<<<<< HEAD
            enum: ['Not Touched', 'Partially Done', 'Complete'],
            default: 'Not Touched'
=======
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
>>>>>>> origin/aws-backend-auth
        },
        lastEdit: { type: Date, default: Date.now() },
        lastEditBy: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: { type: [fileSchema], default: [] }
    },
    cad: {
        status: {
            type: String,
<<<<<<< HEAD
            enum: ['Not Touched', 'Partially Done', 'Complete'],
            default: 'Not Touched'
=======
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
>>>>>>> origin/aws-backend-auth
        },
        lastEdit: { type: Date, default: Date.now() },
        lastEditBy: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: { type: [fileSchema], default: [] }
    },
    manufacture: {
        status: {
            type: String,
<<<<<<< HEAD
            enum: ['Not Touched', 'Partially Done', 'Complete'],
            default: 'Not Touched'
=======
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
>>>>>>> origin/aws-backend-auth
        },
        lastEdit: { type: Date, default: Date.now() },
        lastEditBy: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: { type: [fileSchema], default: [] }
    },
    postProcessing: {
        status: {
            type: String,
<<<<<<< HEAD
            enum: ['Not Touched', 'Partially Done', 'Complete'],
            default: 'Not Touched'
=======
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
>>>>>>> origin/aws-backend-auth
        },
        lastEdit: { type: Date, default: Date.now() },
        lastEditBy: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: { type: [fileSchema], default: [] }
    },
    delivery: {
        status: {
            type: String,
<<<<<<< HEAD
            enum: ['Not Touched', 'Partially Done', 'Complete'],
            default: 'Not Touched'
=======
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
>>>>>>> origin/aws-backend-auth
        },
        lastEdit: { type: Date, default: Date.now() },
        lastEditBy: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: { type: [fileSchema], default: [] }
    },
    feedback: {
        status: {
            type: String,
<<<<<<< HEAD
            enum: ['Not Touched', 'Partially Done', 'Complete'],
            default: 'Not Touched'
=======
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
>>>>>>> origin/aws-backend-auth
        },
        lastEdit: { type: Date, default: Date.now() },
        lastEditBy: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: { type: [fileSchema], default: [] }
    }
});

module.exports = mongoose.model("Patient", patientSchema);
<<<<<<< HEAD
=======
module.exports.statusEnum = statusEnum;
>>>>>>> origin/aws-backend-auth
