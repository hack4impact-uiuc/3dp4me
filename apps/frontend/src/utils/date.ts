import { Language, Nullish } from '@3dp4me/types';
import { LANGUAGES } from './constants';

/**
 * Formats a date object according to the selected language
 * @param {Date} date The date object to format
 * @param {String} language Should be one of the valid options defined in constants.js
 * @returns The formatted date string
 */
export const formatDate = (date: Nullish<Date | string>, language: Language) => {
    if (date instanceof Date) return dateToString(date, language)
    if (typeof date === 'string') return dateToString(new Date(date), language);
    return "No date"
};

const dateToString = (date: Date, language: Language) => {
    let locale = 'ar-SA';
    if (language === LANGUAGES.EN) locale = 'en-US';

    return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}