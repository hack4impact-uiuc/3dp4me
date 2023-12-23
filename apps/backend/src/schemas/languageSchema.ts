import mongoose, { Schema } from 'mongoose';
import { ERR_LANGUAGE_VALIDATION_FAILED } from '../utils/constants';
import { TranslatedString } from '@3dp4me/types';

const validateLanguage = (languageScheme: string) => languageScheme !== '';

/**
 * Used for any language field to support both English and Arabic.
 */
export const languageSchema = new mongoose.Schema<TranslatedString>({
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