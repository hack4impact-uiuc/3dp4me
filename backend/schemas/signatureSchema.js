const mongoose = require('mongoose');

module.exports.signatureSchema = new mongoose.Schema({
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
