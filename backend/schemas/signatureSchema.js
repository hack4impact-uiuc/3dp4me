const mongoose = require('mongoose');

/**
 * Schema used to collect signature data. SignatureData is all of the data points,
 * while signatureCanvasWidth/Height are for recording the canvas size on which signatureData
 * is collected. DocumentURL records the default document URL for both EN and AR.
 */
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
