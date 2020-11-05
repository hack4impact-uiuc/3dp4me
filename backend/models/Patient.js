const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    uploadDate: { type: Date, required: true }
}, {
    _id: false
});

const statusEnum = {
    NOTTOUCHED: "NOT TOUCHED",
    PARTIALLYDONE: "PARTIALLY DONE",
    COMPLETE: "COMPLETE"
};

// TODO: add / remove stage fields as needed
const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    serial: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    folder: { type: String, required: true },
    medicalInformation: {
        status: {
            type: String,
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
        },
        lastEdit: { type: Date, default: Date.now },
        lastEditBy: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: [fileSchema]
    },
    scan: {
        status: {
            type: String,
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
        },
        lastEdit: { type: Date, default: Date.now },
        lastEditBy: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: [{type: fileSchema}]
    },
    cad: {
        status: {
            type: String,
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
        },
        lastEdit: { type: Date, default: Date.now },
        lastEditBy: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: [fileSchema]
    },
    manufacture: {
        status: {
            type: String,
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
        },
        lastEdit: { type: Date, default: Date.now },
        lastEditBy: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: [{type: fileSchema}]
    },
    postProcessing: {
        status: {
            type: String,
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
        },
        lastEdit: { type: Date, default: Date.now },
        lastEditBy: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: [{type: fileSchema}]
    },
    delivery: {
        status: {
            type: String,
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
        },
        lastEdit: { type: Date, default: Date.now },
        lastEditBy: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: [{type: fileSchema}]
    },
    feedback: {
        status: {
            type: String,
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
        },
        lastEdit: { type: Date, default: Date.now },
        lastEditBy: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: [{type: fileSchema}]
    }
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = {
    Patient,
    statusEnum
};