const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    uploadDate: { type: Date, required: true }
});

const statusEnum = {
    NOTTOUCHED: "NOT TOUCHED",
    PARTIALLYDONE: "PARTIALLY DONE",
    COMPLETE: "COMPLETE"
};

const deliveryEnum = {
    DELIVERY: "delivery",
    PICKUP: "pickup"
};

// TODO: add / remove stage fields as needed
const patientSchema = new mongoose.Schema({
    medicalInformation: {
        name: { type: String, required: true },
        serial: { type: String, required: true, unique: true },
        ssn: { type: String, required: true, unique: true },
        orderId: { type: String, required: true, unique: true },
        dob: {type: Date, required: true},
        phone: { type: String, required: true, unique: true },
        address: { type: String, required: true},
        emName: { type: String, required: true},
        relationship: { type: String, required: true},
        emPhone: { type: String, required: true},
        delivery: {
            type: String,
            enum: [deliveryEnum.DELIVERY, deliveryEnum.PICKUP],
            default: statusEnum.DELIVERY
        },
        status: {
            type: String,
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
        },
        editDate: { type: Date, default: Date.now },
        editName: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: { type: [fileSchema], default: [] }
    },
    scan: {
        status: {
            type: String,
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
        },
        editDate: { type: Date, default: Date.now },
        editName: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: { type: [fileSchema], default: [] }
    },
    cad: {
        status: {
            type: String,
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
        },
        editDate: { type: Date, default: Date.now },
        editName: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: { type: [fileSchema], default: [] }
    },
    manufacture: {
        status: {
            type: String,
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
        },
        editDate: { type: Date, default: Date.now },
        editName: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: { type: [fileSchema], default: [] }
    },
    postProcessing: {
        status: {
            type: String,
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
        },
        editDate: { type: Date, default: Date.now },
        editName: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: { type: [fileSchema], default: [] }
    },
    delivery: {
        status: {
            type: String,
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
        },
        editDate: { type: Date, default: Date.now },
        editName: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: { type: [fileSchema], default: [] }
    },
    feedback: {
        status: {
            type: String,
            enum: [statusEnum.NOTTOUCHED, statusEnum.PARTIALLYDONE, statusEnum.COMPLETE],
            default: statusEnum.NOTTOUCHED
        },
        initial: {
            notes: { type: String, default: "" },
            date: { type: Date },
        },
        sixMonth: {
            notes: { type: String, default: "" },
            date: { type: Date },
        },
        oneYear: {
            notes: { type: String, default: "" },
            date: { type: Date },
        },
        twoYear: {
            notes: { type: String, default: "" },
            date: { type: Date },
        },
        editDate: { type: Date, default: Date.now },
        editName: { type: String, default: "" },
        notes: { type: String, default: "" },
        files: { type: [fileSchema], default: [] }
    }
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = {
    Patient,
    statusEnum
};