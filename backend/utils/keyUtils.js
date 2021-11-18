const _ = require('lodash');

/* Returns a string of specified length composed of random alphanumeric characters */
const randomAlphanumeric = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        );
    }
    return result;
};

/* Converts input into camel case */
const generateKeyWithCamelCase = (input) => {
    if (input === '') {
        return randomAlphanumeric(10);
    }

    return _.camelCase(input);
};

const checkKeyCollision = (newKey, otherKeys) => {
    for (let i = 0; i < otherKeys.length; i++) {
        if (otherKeys[i] === newKey) return true;
    }
    return false;
};

module.exports.generateKeyWithoutCollision = (input, otherKeys) => {
    const newKey = generateKeyWithCamelCase(input);

    let keySuffix = 1;

    let noCollisionKey = newKey;

    while (checkKeyCollision(noCollisionKey, otherKeys)) {
        noCollisionKey = newKey + keySuffix;
        keySuffix += 1;
    }

    return noCollisionKey;
};
