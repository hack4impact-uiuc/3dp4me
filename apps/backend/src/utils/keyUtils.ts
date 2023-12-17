import _ from 'lodash';

/* Returns a string of specified length composed of random alphanumeric characters */
const randomAlphanumeric = (length: number) => {
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
const generateKeyWithCamelCase = (input: string) => {
    if (input === '') {
        return randomAlphanumeric(10);
    }

    return _.camelCase(input);
};

const checkKeyCollision = (newKey: string, otherKeys: string[]) =>
    checkNumOccurencesInList(newKey, otherKeys) >= 1;

export const generateKeyWithoutCollision = (input: string, otherKeys: string[]) => {
    const newKey = generateKeyWithCamelCase(input);

    let keySuffix = 1;

    let noCollisionKey = newKey;

    while (checkKeyCollision(noCollisionKey, otherKeys)) {
        noCollisionKey = newKey + keySuffix;
        keySuffix += 1;
    }

    return noCollisionKey;
};

// Checks the number of occurences of an element in a list.
// Used for detecting multiple occurences of keys in a list of step keys.
export const checkNumOccurencesInList = (input: string, list: string[]) => {
    let count = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i] === input) {
            count += 1;
        }
    }
    return count;
};