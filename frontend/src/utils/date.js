export const formatDate = (date, language) => {
    if (date == null) return 'Undefined';

    let locale = 'ar-SA';
    if (language == 'EN') locale = 'en-US';

    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return date.toLocaleDateString(locale, options);
};
