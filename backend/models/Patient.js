const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    uploadDate: { type: Date, required: true },
});

const overallStatusEnum = {
    ACTIVE: 'Active',
    ARCHIVED: 'Archived',
    FEEDBACK: 'Feedback',
};

const stageStatusEnum = {
    UNFINISHED: 'unfinished',
    PARTIAL: 'partial',
    FINISHED: 'finished',
};

const deliveryEnum = {
    DELIVERY: 'delivery',
    PICKUP: 'pickup',
};

const deliveryStatusEnum = {
    NOTREADY: 'notReady',
    READY: 'ready',
    OUT: 'out',
    HANDDELIVERED: 'handDelivered',
    PICKUP: 'pickup',
};

const feedbackEnum = {
    INITIAL: 'Initial',
    SIXMONTH: '6 month',
    ONEYEAR: '1 year',
    TWOYEAR: '2 year',
};

// TODO: add / remove stage fields as needed
const patientSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: [
            overallStatusEnum.ACTIVE,
            overallStatusEnum.ARCHIVED,
            overallStatusEnum.FEEDBACK,
        ],
        default: overallStatusEnum.ACTIVE,
    },
    createdDate: { type: Date, required: true, default: Date.now },
    lastEdited: { type: Date, required: true, default: Date.now },
    patientInfo: {
        name: { type: String, required: true },
        ssn: { type: String, required: true, unique: true },
        orderId: { type: String, required: true, unique: true },
        dob: { type: Date, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        emName: { type: String, required: true },
        relationship: { type: String, required: true },
        emPhone: { type: String, required: true },
        delivery: {
            type: String,
            enum: Object.values(deliveryEnum),
            default: stageStatusEnum.DELIVERY,
        },
        status: {
            type: String,
            enum: Object.values(stageStatusEnum),
            default: stageStatusEnum.UNFINISHED,
        },
        lastEdited: { type: Date, required: true, default: Date.now },
        lastEditedBy: { type: String, default: '' },
        notes: { type: String, default: '' },
        files: { type: [fileSchema], default: [] },
    },
    earScanInfo: {
        status: {
            type: String,
            enum: Object.values(stageStatusEnum),
            default: stageStatusEnum.UNFINISHED,
        },
        lastEdited: { type: Date, required: true, default: Date.now },
        lastEditedBy: { type: String, default: '' },
        notes: { type: String, default: '' },
        files: { type: [fileSchema], default: [] },
    },
    modelInfo: {
        status: {
            type: String,
            enum: Object.values(stageStatusEnum),
            default: stageStatusEnum.UNFINISHED,
        },
        lastEdited: { type: Date, required: true, default: Date.now },
        lastEditedBy: { type: String, default: '' },
        notes: { type: String, default: '' },
        files: { type: [fileSchema], default: [] },
    },
    printingInfo: {
        status: {
            type: String,
            enum: Object.values(stageStatusEnum),
            default: stageStatusEnum.UNFINISHED,
        },
        lastEdited: { type: Date, required: true, default: Date.now },
        lastEditedBy: { type: String, default: '' },
        notes: { type: String, default: '' },
        files: { type: [fileSchema], default: [] },
    },
    processingInfo: {
        status: {
            type: String,
            enum: Object.values(stageStatusEnum),
            default: stageStatusEnum.UNFINISHED,
        },
        lastEdited: { type: Date, required: true, default: Date.now },
        lastEditedBy: { type: String, default: '' },
        notes: { type: String, default: '' },
        files: { type: [fileSchema], default: [] },
    },
    deliveryInfo: {
        deliveryStatus: {
            type: String,
            enum: Object.values(deliveryStatusEnum),
            default: deliveryStatusEnum.NOTREADY,
        },
        status: {
            type: String,
            enum: Object.values(stageStatusEnum),
            default: stageStatusEnum.UNFINISHED,
        },
        lastEdited: { type: Date, required: true, default: Date.now },
        lastEditedBy: { type: String, default: '' },
        notes: { type: String, default: '' },
        files: { type: [fileSchema], default: [] },
    },
    feedbackInfo: {
        status: {
            type: String,
            enum: Object.values(stageStatusEnum),
            default: stageStatusEnum.UNFINISHED,
        },
        feedbackCycle: {
            type: String,
            enum: Object.values(feedbackEnum),
            default: feedbackEnum.INITIAL,
        },
        initial: {
            notes: { type: String, default: '' },
            date: { type: Date },
        },
        sixMonth: {
            notes: { type: String, default: '' },
            date: { type: Date },
        },
        oneYear: {
            notes: { type: String, default: '' },
            date: { type: Date },
        },
        twoYear: {
            notes: { type: String, default: '' },
            date: { type: Date },
        },
        lastEdited: { type: Date, required: true, default: Date.now },
        lastEditedBy: { type: String, default: '' },
        notes: { type: String, default: '' },
        files: { type: [fileSchema], default: [] },
    },
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = {
    Patient,
    stageStatusEnum,
    deliveryEnum,
    feedbackEnum,
    fileSchema,
    overallStatusEnum,
};
