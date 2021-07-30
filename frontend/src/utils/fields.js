import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

import finishedIcon from '../assets/check.svg';
import partiallyIcon from '../assets/half-circle.svg';
import unfinishedIcon from '../assets/exclamation.svg';
import translations from '../translations.json';

import { formatDate } from './date';
import {
    ACCESS_LEVELS,
    FIELD_TYPES,
    PATIENT_STATUS,
    SIGNATURE_STATUS,
    STEP_STATUS,
} from './constants';

/**
 * Converts a step status to a string
 */
const stepStatusToString = (status, selectedLang) => {
    const bottomBarTranslations =
        translations[selectedLang].components.bottombar;

    switch (status) {
        case STEP_STATUS.FINISHED:
            return bottomBarTranslations.finished;
        case STEP_STATUS.PARTIALLY_FINISHED:
            return bottomBarTranslations.partial;
        case STEP_STATUS.UNFINISHED:
            return bottomBarTranslations.unfinished;
        case undefined:
        case null:
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
    switch (status) {
        case STEP_STATUS.FINISHED:
            return finishedIcon;
        case STEP_STATUS.PARTIALLY_FINISHED:
            return partiallyIcon;
        case STEP_STATUS.UNFINISHED:
            return unfinishedIcon;
        case undefined:
        case null:
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
