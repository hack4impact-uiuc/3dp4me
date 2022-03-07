import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';

import finishedIcon from '../assets/check.svg';
import unfinishedIcon from '../assets/exclamation.svg';
import partiallyIcon from '../assets/half-circle.svg';
import translations from '../translations.json';

import {
    ACCESS_LEVELS, ERR_LANGUAGE_VALIDATION_FAILED,
    ERR_OPTION_VALIDATION_FAILED, FIELD_TYPES,
    PATIENT_STATUS,
    SIGNATURE_STATUS,
    STEP_STATUS
} from './constants';
import { formatDate } from './date';



/**
 * Converts a step status to a string
 */
const stepStatusToString = (status, selectedLang) => {
    const bottomBarTranslations =
        translations[selectedLang].components.bottombar;

    if (!status) return bottomBarTranslations.unfinished;

    switch (status) {
        case STEP_STATUS.FINISHED:
            return bottomBarTranslations.finished;
        case STEP_STATUS.PARTIALLY_FINISHED:
            return bottomBarTranslations.partial;
        case STEP_STATUS.UNFINISHED:
            return bottomBarTranslations.unfinished;
        default:
            console.error(`statusToString(): Unrecognized status: ${status}`);
    }

    return status;
};

/**
 * Converts a patient status to a string
 */
const patientStatusToString = (status, selectedLang) => {
    const bottomBarTranslations =
        translations[selectedLang].components.bottombar;

    switch (status) {
        case PATIENT_STATUS.ACTIVE:
            return bottomBarTranslations.active;
        case PATIENT_STATUS.ARCHIVE:
            return bottomBarTranslations.archived;
        case PATIENT_STATUS.FEEDBACK:
            return bottomBarTranslations.feedback;
        default:
            console.error(`statusToString(): Unrecognized status: ${status}`);
    }

    return status;
};

/**
 * Gets the icon associated with the status.
 */
const getStepStatusIcon = (status) => {
    if (!status) return unfinishedIcon;

    switch (status) {
        case STEP_STATUS.FINISHED:
            return finishedIcon;
        case STEP_STATUS.PARTIALLY_FINISHED:
            return partiallyIcon;
        case STEP_STATUS.UNFINISHED:
            return unfinishedIcon;
        default:
            console.error(
                `getStepStatusIcon(): Unrecognized status: ${status}`,
            );
    }

    return null;
};

/**
 * Gets the color associated with the status.
 */
const getPatientStatusColor = (status) => {
    switch (status) {
        case PATIENT_STATUS.ACTIVE:
            return '#65d991';
        case PATIENT_STATUS.ARCHIVE:
            return 'black';
        case PATIENT_STATUS.FEEDBACK:
            return '#5395f8';
        default:
            console.error(
                `getPatientStatusColor(): Unrecognized status: ${status}`,
            );
    }

    return 'black';
};

/**
 * Converts a step status value to JSX.
 */
const stepStatusToJSX = (status, selectedLang) => {
    const statusStringified = stepStatusToString(status, selectedLang);
    const statusIcon = getStepStatusIcon(status);

    return (
        <div>
            <img
                alt={status}
                style={{ marginRight: '6px' }}
                width="16px"
                src={statusIcon}
            />
            {` ${statusStringified}`}
        </div>
    );
};

/**
 * Converts a patient's overall status value to JSX.
 */
const patientStatusToJSX = (status, selectedLang) => {
    const statusStringified = patientStatusToString(status, selectedLang);
    const statusColor = getPatientStatusColor(status);

    return (
        <b>
            <div style={{ color: statusColor }}>{statusStringified}</div>
        </b>
    );
};

/**
 * Converts an access level value to string
 */
const accessToString = (access, selectedLang) => {
    const accessTranslations = translations[selectedLang].accountManagement;

    switch (access) {
        case ACCESS_LEVELS.GRANTED:
            return accessTranslations.Approved;
        case ACCESS_LEVELS.PENDING:
            return accessTranslations.Pending;
        case ACCESS_LEVELS.REVOKED:
            return accessTranslations.Revoked;
        default:
            console.error(`Unrecognized access level: ${access}`);
    }

    return access;
};

/**
 * Gets the color associated with an access level
 */
const getAccessColor = (access) => {
    switch (access) {
        case ACCESS_LEVELS.GRANTED:
            return '#65d991';
        case ACCESS_LEVELS.PENDING:
            return 'black';
        case ACCESS_LEVELS.REVOKED:
            return 'red';
        default:
            console.error(
                `getAccessColor(): Unrecognized accces level ${access}`,
            );
    }

    return 'black';
};

/**
 * Gets the JSX associated with an access level
 */
const accessToJSX = (access, selectedLang) => {
    const accessString = accessToString(access, selectedLang);
    const accessColor = getAccessColor(access);
    return (
        <div style={{ color: accessColor }}>
            <b>{accessString}</b>
        </div>
    );
};

/**
 * Given signature data, converts it to a standard enum value
 */
const signatureDataToValue = (signatureData) => {
    return signatureData?.signatureData
        ? SIGNATURE_STATUS.SIGNED
        : SIGNATURE_STATUS.UNSIGNED;
};

/**
 * Gets the JSX associated with the given signature data
 */
const signatureToJSX = (signatureData) => {
    const signatureStatus = signatureDataToValue(signatureData);

    switch (signatureStatus) {
        case SIGNATURE_STATUS.SIGNED:
            return (
                <div style={{ color: '#65d991' }}>
                    <CheckIcon />
                </div>
            );
        case SIGNATURE_STATUS.UNSIGNED:
            return (
                <div style={{ color: 'red' }}>
                    <CloseIcon />
                </div>
            );
        default:
            console.error(
                `signatureToJSX(): Unrecognized signature status ${signatureStatus}`,
            );
    }

    return null;
};

/**
 * Returns the user-friendly name for a field type
 * @param {String} fieldType Type of field
 * @returns The user-friendly name
 */
export const getFieldName = (fieldType) => {
    switch(fieldType) {
        case FIELD_TYPES.AUDIO:
            return "Audo Recording"
        case FIELD_TYPES.DATE:
            return "Date"
        case FIELD_TYPES.DIVIDER:
            return "Divider"
        case FIELD_TYPES.FIELD_GROUP:
            return "Field Group"
        case FIELD_TYPES.FILE:
            return "File"
        case FIELD_TYPES.HEADER:
            return "Header"
        case FIELD_TYPES.MAP:
            return "Location"
        case FIELD_TYPES.MULTILINE_STRING:
            return "Long text"
        case FIELD_TYPES.NUMBER:
            return "Number"
        case FIELD_TYPES.PHONE:
            return "Phone Number"
        case FIELD_TYPES.PHOTO:
            return "Photograph"
        case FIELD_TYPES.RADIO_BUTTON:
            return "Multiple Choice Question"
        case FIELD_TYPES.SIGNATURE:
            return "Signature"
        case FIELD_TYPES.STRING:
            return "Short text"
        default:
            return fieldType
    }
}

/**
 * Returns whether or not a field can be added to a step
 * @param {String} fieldType Type of field
 * @returns The user-friendly name
 */
export const canFieldBeAddedToStep = (fieldType) => {
    switch(fieldType) {
        case FIELD_TYPES.AUDIO:
        case FIELD_TYPES.DATE:
        case FIELD_TYPES.DIVIDER:
        case FIELD_TYPES.FIELD_GROUP:
        case FIELD_TYPES.FILE:
        case FIELD_TYPES.HEADER:
        case FIELD_TYPES.MAP:
        case FIELD_TYPES.MULTILINE_STRING:
        case FIELD_TYPES.NUMBER:
        case FIELD_TYPES.PHONE:
        case FIELD_TYPES.PHOTO:
        case FIELD_TYPES.RADIO_BUTTON:
        case FIELD_TYPES.SIGNATURE:
        case FIELD_TYPES.STRING:
            return true;

        default:
            return false;
    }
}

/**
 * Turn field data into a string
 * @param {Any} fieldData The data to stringify
 * @param {String} fieldType The type of this data
 * @param {String} selectedLang The currently selected language
 * @returns The stringified field
 */
export const fieldToString = (fieldData, fieldType, selectedLang) => {
    switch (fieldType) {
        case FIELD_TYPES.MULTILINE_STRING:
        case FIELD_TYPES.STRING:
        case FIELD_TYPES.NUMBER:
        case FIELD_TYPES.PHONE:
            return fieldData;
        case FIELD_TYPES.DATE:
            return formatDate(new Date(fieldData), selectedLang);
        case FIELD_TYPES.STEP_STATUS:
            return stepStatusToString(fieldData, selectedLang);
        case FIELD_TYPES.PATIENT_STATUS:
            return patientStatusToString(fieldData, selectedLang);
        case FIELD_TYPES.ACCESS:
            return accessToString(fieldData, selectedLang);
        case FIELD_TYPES.SIGNATURE:
            return signatureDataToValue(fieldData);
        default:
            console.error(`fieldToString(): Unrecognized field: ${fieldType}`);
    }

    return fieldData;
};

/**
 * Turn field data into JSX. I.e. apply formatting to it.
 * @param {Any} fieldData The data to get JSX for.
 * @param {String} fieldType The type of this data.
 * @param {String} selectedLang The currently selected language
 * @returns The JSX
 */
export const fieldToJSX = (fieldData, fieldType, selectedLang) => {
    const stringifiedField = fieldToString(fieldData, fieldType, selectedLang);

    switch (fieldType) {
        case FIELD_TYPES.MULTILINE_STRING:
        case FIELD_TYPES.STRING:
        case FIELD_TYPES.NUMBER:
        case FIELD_TYPES.PHONE:
        case FIELD_TYPES.DATE:
            return stringifiedField;
        case FIELD_TYPES.SIGNATURE:
            return signatureToJSX(fieldData);
        case FIELD_TYPES.STEP_STATUS:
            return stepStatusToJSX(fieldData, selectedLang);
        case FIELD_TYPES.PATIENT_STATUS:
            return patientStatusToJSX(fieldData, selectedLang);
        case FIELD_TYPES.ACCESS:
            return accessToJSX(fieldData, selectedLang);
        default:
            console.error(`fieldToJSX(): Unrecognized field: ${fieldType}`);
    }

    return stringifiedField;
};

/**
 * Validates a field's data.
 * @param {JSON} fieldData
 */
export const validateField = (fieldData) => {
    if (
        fieldData.displayName.EN.trim() === '' ||
        fieldData.displayName.AR.trim() === ''
    ) {
        throw new Error(ERR_LANGUAGE_VALIDATION_FAILED);
    }

    if (
        fieldData.fieldType === FIELD_TYPES.RADIO_BUTTON &&
        fieldData.options.length === 0
    ) {
        throw new Error(ERR_OPTION_VALIDATION_FAILED);
    }
};
