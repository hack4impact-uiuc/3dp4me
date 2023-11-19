import { LANGUAGES } from './constants.js';

/**
 * Formats a date object according to the selected language
 * @param {Date} date The date object to format
 * @param {String} language Should be one of the valid options defined in constants.js
 * @returns The formatted date string
 */
export const formatDate = (date, language) => {
    if (date == null) return 'Undefined';

    let parsedDate = date;
    if (!(typeof date === 'object' || date instanceof Object))
        parsedDate = new Date(date);

    let locale = 'ar-SA';
    if (language === LANGUAGES.EN) locale = 'en-US';

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };

    return parsedDate.toLocaleDateString(locale, options);
};
