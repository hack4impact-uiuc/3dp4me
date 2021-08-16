const mongoose = require('mongoose');

module.exports.languageSchema = new mongoose.Schema({
    EN: { type: String, required: true },
    AR: { type: String, required: true },
});
