const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    uploadDate: { type: Date, required: true },
});

const stepStatusEnum = {
    UNFINISHED: 'Unfinished',
    PARTIAL: 'Partial',
    FINISHED: 'Finished',
};

const signatureSchema = new mongoose.Schema({
    signatureData: [
        [
            {
                x: { type: Number, required: true },
                y: { type: Number, required: true },
                time: { type: Number, required: true },
                color: { type: String, required: true },
            },
        ],
    ],
    signatureCanvasWidth: { type: Number, required: true },
    signatureCanvasHeight: { type: Number, required: true },
    documentURL: {
        EN: { type: String, required: true },
        AR: { type: String, required: true },
    },
});

module.exports = { fileSchema, stepStatusEnum, signatureSchema };
