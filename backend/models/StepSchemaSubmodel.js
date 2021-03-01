const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    uploadDate: { type: Date, required: true },
});

const stageStatusEnum = {
    UNFINISHED: 'unfinished',
    PARTIAL: 'partial',
    FINISHED: 'finished',
};

module.exports = { fileSchema, stageStatusEnum };
