import { Field, Patient, Step } from '@3dp4me/types';
import { camelCase } from 'lodash';
import { Nullish } from '../../../../packages/types/dist/src/utils/nullish';


function hasKey<T extends object, K extends PropertyKey>(obj: Nullish<T>, key: K): obj is T & Record<K, unknown> {
    if (!obj) return false
    return key in obj;
}

type PatientDataWithStep<K extends PropertyKey> = Patient & Record<K, Record<string, any>>
export function hasStepData<K extends PropertyKey>(patient: Nullish<Patient>, stepKey: K): patient is PatientDataWithStep<K> {
    if (!hasKey(patient, stepKey)) return false
    return typeof patient[stepKey] === "object"
}

export const hasNotesForStep = (data: Patient, meta: Step): data is PatientDataWithStep<typeof meta['key']> & Record<typeof meta['key'], Record<"notes", string>>  => {
    if (!hasStepData(data, meta.key)) return false
    return hasKey(data[meta.key], 'notes')
}

export const getStepData = <T extends Patient>(data: Nullish<T>, key: string): Nullish<Record<string, any>> => {
    if (hasKey(data, key)) return data[key] as any as Record<string, any>
    return null
}

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

    return camelCase(input);
};

const checkKeyCollision = (newKey: string, otherKeys: string[]) => {
    for (let i = 0; i < otherKeys.length; i++) {
        if (otherKeys[i] === newKey) return true;
    }
    return false;
};

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

// Returns the index for a step given its key
export const getStepIndexGivenKey = (stepData: Step[], key: string) => {
    if (!stepData) return -1;
    return stepData.findIndex((step) => step.key === key);
};

// This function is needed because the field number doesn't correspond to the index of a field in
// the fields array. There can be fields with field numbers 1, 2, 4, 5, but no 3, in the fields array.
export const getFieldIndexByNumber = (fields: Field[], fieldNumber: number) => {
    return fields.findIndex((field) => field.fieldNumber === fieldNumber);
};