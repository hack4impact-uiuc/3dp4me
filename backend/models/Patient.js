const mongoose = require("mongoose");

// TODO: add / remove stage fields as needed
const Patient = new mongoose.Schema({
    name: { type: String },
    serial: { type: String },
    address: { type: String },
    folder: { type: String },
    patientInformation: {
        status: { type: String },
        lastEdit: { type: Date },
        lastEditBy: { type: String },
        notes: { type: String },
        files: { type: Array }
    },
    scan: {
        status: { type: String },
        lastEdit: { type: Date },
        lastEditBy: { type: String },
        notes: { type: String },
        files: { type: Array }
    },
    cad: {
        status: { type: String },
        lastEdit: { type: Date },
        lastEditBy: { type: String },
        notes: { type: String },
        files: { type: Array }
    },
    manufacture: {
        status: { type: String },
        lastEdit: { type: Date },
        lastEditBy: { type: String },
        notes: { type: String },
        files: { type: Array }
    },
    postProcessing: {
        status: { type: String },
        lastEdit: { type: Date },
        lastEditBy: { type: String },
        notes: { type: String },
        files: { type: Array }
    },
    delivery: {
        status: { type: String },
        lastEdit: { type: Date },
        lastEditBy: { type: String },
        notes: { type: String },
        files: { type: Array }
    },
    feedback: {
        status: { type: String },
        lastEdit: { type: Date },
        lastEditBy: { type: String },
        notes: { type: String },
        files: { type: Array }
    }
});



module.exports = mongoose.model("Patient", Patient);