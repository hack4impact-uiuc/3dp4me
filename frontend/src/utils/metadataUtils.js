import { camelCase } from 'lodash';

/**
 * Converts input into camelCase
 * @param {String} input
 * @returns input in camelCase
 */

const randomAlphanumeric = (length) => {
    let result = '';
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        );
    }
    return result;
};

const generateKeyWithCamelCase = (input) => {
    if (input === '') {
        return randomAlphanumeric(10);
    }

    return camelCase(input);
};

const checkKeyCollision = (newKey, otherKeys) => {
    for (let i = 0; i < otherKeys.length; i++) {
        if (otherKeys[i] === newKey) return true;
    }
    return false;
};

export const generateKeyWithoutCollision = (input, otherKeys) => {
    const newKey = generateKeyWithCamelCase(input);

    let keySuffix = 1;

    let noCollisionKey = newKey;

    while (checkKeyCollision(noCollisionKey, otherKeys)) {
        noCollisionKey = newKey + keySuffix;
        keySuffix += 1;
    }

    return noCollisionKey;
};
