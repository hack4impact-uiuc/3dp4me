const mongoose = require('mongoose');

/**
 * Schema for storing files. The file contents are stored in S3, this records
 * the location of the file in the S3.
 */
module.exports.fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    uploadDate: { type: Date, required: true },
});
