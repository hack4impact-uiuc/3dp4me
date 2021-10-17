import { camelCase } from 'lodash';

/**
 * Converts input into camelCase
 * @param {String} input
 * @returns input in camelCase
 */

const randomAlphanumeric = (length) => {
    var result = '';
    var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        );
    }
    return result;
};

export const generateKeyWithCamelCase = (input) => {
    if (input === '') {
        return randomAlphanumeric(10);
    }

    return camelCase(input);
};

export const checkKeyCollision = (newKey, otherKeys) => {
    for (const key of otherKeys) if (key === newKey) return true;
    return false;
};
