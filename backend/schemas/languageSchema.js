const mongoose = require('mongoose');

const { ERR_LANGUAGE_VALIDATION_FAILED } = require('../utils/constants');

const validateLanguage = (languageScheme) => languageScheme !== '';

/**
 * Used for any language field to support both English and Arabic.
 */
module.exports.languageSchema = new mongoose.Schema({
    EN: {
        type: String,
        validate: {
            validator: validateLanguage,
            message: ERR_LANGUAGE_VALIDATION_FAILED,
        },
        required: [true, ERR_LANGUAGE_VALIDATION_FAILED],
    },
    AR: {
        type: String,
        validate: {
            validator: validateLanguage,
            message: ERR_LANGUAGE_VALIDATION_FAILED,
        },
        required: [true, ERR_LANGUAGE_VALIDATION_FAILED],
    },
});
