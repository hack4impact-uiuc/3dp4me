const mongoose = require('mongoose');

/**
 * Used for any language field to support both English and Arabic.
 */
module.exports.languageSchema = new mongoose.Schema({
    EN: { type: String, required: true },
    AR: { type: String, required: true },
});
