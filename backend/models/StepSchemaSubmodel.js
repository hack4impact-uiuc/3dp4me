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

module.exports = { fileSchema, stepStatusEnum };
