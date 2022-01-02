import { camelCase } from 'lodash';

/* Returns a string of specified length composed of random alphanumeric characters */
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

/* Converts input into camel case */
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

// Returns the index for a step given its key
export const getStepIndexGivenKey = (stepData, key) => {
    if (!stepData) return -1;
    return stepData.findIndex((step) => step.key === key);
};

// This function is needed because the field number doesn't correspond to the index of a field in
// the fields array. There can be fields with field numbers 1, 2, 4, 5, but no 3, in the fields array.
export const getFieldIndexByNumber = (fields, fieldNumber) => {
    return fields.findIndex((field) => field.fieldNumber === fieldNumber);
};
