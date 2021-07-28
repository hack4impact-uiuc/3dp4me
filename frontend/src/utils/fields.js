import React from 'react';
import {
    FIELD_TYPES,
    PATIENT_STATUS,
    SIGNATURE_STATUS,
    STEP_STATUS,
} from './constants';
import { formatDate } from './date';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import finishedIcon from '../assets/check.svg';
import partiallyIcon from '../assets/half-circle.svg';
import unfinishedIcon from '../assets/exclamation.svg';
import translations from '../translations.json';

const statusToString = (status, selectedLang) => {
    const bottomBarTranslations =
        translations[selectedLang].components.bottombar;

    switch (status) {
        case STEP_STATUS.FINISHED:
            return bottomBarTranslations.finished;
        case STEP_STATUS.PARTIALLY_FINISHED:
            return bottomBarTranslations.partial;
        case STEP_STATUS.UNFINISHED:
            return bottomBarTranslations.unfinished;
        case STEP_STATUS.ACTIVE:
            return bottomBarTranslations.active;
        case STEP_STATUS.ARCHIVE:
            return bottomBarTranslations.archived;
        case STEP_STATUS.FEEDBACK:
            return bottomBarTranslations.feedback;
        default:
            return status;
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case STEP_STATUS.FINISHED:
            return finishedIcon;
        case STEP_STATUS.PARTIALLY_FINISHED:
            return partiallyIcon;
        case STEP_STATUS.UNFINISHED:
            return unfinishedIcon;
        default:
            return null;
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case PATIENT_STATUS.ACTIVE:
            return '#65d991';
        case PATIENT_STATUS.ARCHIVE:
            return 'black';
        case PATIENT_STATUS.FEEDBACK:
            return '#5395f8';
        default:
            return 'black';
    }
};

const statusToJSX = (status, selectedLang) => {
    const statusStringified = statusToString(status, selectedLang);
    const statusIcon = getStatusIcon(status);
    const statusColor = getStatusColor(status);

    if (!statusIcon) {
        return <div style={{ color: statusColor }}>{statusStringified}</div>;
    }

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

const signatureToJSX = (signature) => {
    switch (signature) {
        case SIGNATURE_STATUS.SIGNED:
            return (
                <div style={{ color: '#65d991' }}>
                    <CheckIcon />
                </div>
            );
        case SIGNATURE_STATUS.UNSIGNED:
        default:
            return (
                <div style={{ color: 'red' }}>
                    <CloseIcon />
                </div>
            );
    }
};

export const fieldToString = (fieldData, fieldType, selectedLang) => {
    // TODO: Do all of the field types and add an assert that checks it
    switch (fieldType) {
        case FIELD_TYPES.STRING:
        case FIELD_TYPES.NUMBER:
            return fieldData;
        case FIELD_TYPES.DATE:
            return formatDate(new Date(fieldData), selectedLang);
        case FIELD_TYPES.STATUS:
            return statusToString(fieldData, selectedLang);
        default:
            return fieldData;
    }
};

export const fieldToJSX = (fieldData, fieldType, selectedLang) => {
    const stringifiedField = fieldToString(fieldData, fieldType, selectedLang);

    switch (fieldType) {
        case FIELD_TYPES.SIGNATURE:
            return signatureToJSX(fieldData);
        case FIELD_TYPES.STATUS:
            return statusToJSX(fieldData, selectedLang);
        default:
            return stringifiedField;
    }
};