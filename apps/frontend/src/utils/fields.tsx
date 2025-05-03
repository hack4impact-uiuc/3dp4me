import {
    AccessLevel,
    AdditionalFieldData,
    FieldType,
    Language,
    PatientStatus,
    Signature,
    StepStatus,
} from '@3dp4me/types'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import React from 'react'

import finishedIcon from '../assets/check.svg'
import unfinishedIcon from '../assets/exclamation.svg'
import partiallyIcon from '../assets/half-circle.svg'
import translations from '../translations.json'
import {
    AnyFieldType,
    DisplayFieldType,
    ERR_LANGUAGE_VALIDATION_FAILED,
    ERR_MISSING_SIGNATURE_DOCUMENT,
    ERR_OPTION_VALIDATION_FAILED,
    PATIENT_STATUS,
    SignatureStatus,
    STEP_STATUS,
} from './constants'
import { formatDate } from './date'

export const isFieldType = (maybeFieldType: string): maybeFieldType is FieldType =>
    Object.values(FieldType).includes(maybeFieldType as FieldType)

/**
 * Converts a step status to a string
 */
const stepStatusToString = (status: StepStatus, selectedLang: Language) => {
    const bottomBarTranslations = translations[selectedLang].components.bottombar

    if (!status) return bottomBarTranslations.Unfinished

    switch (status) {
        case STEP_STATUS.FINISHED:
            return bottomBarTranslations.Finished
        case STEP_STATUS.PARTIALLY_FINISHED:
            return bottomBarTranslations.Partial
        case STEP_STATUS.UNFINISHED:
            return bottomBarTranslations.Unfinished
        default:
            console.error(`statusToString(): Unrecognized status: ${status}`)
    }

    return status
}

/**
 * Converts a patient status to a string
 */
const patientStatusToString = (status: PatientStatus, selectedLang: Language) => {
    const bottomBarTranslations = translations[selectedLang].components.bottombar

    switch (status) {
        case PATIENT_STATUS.ACTIVE:
            return bottomBarTranslations.active
        case PATIENT_STATUS.ARCHIVE:
            return bottomBarTranslations.archived
        case PATIENT_STATUS.FEEDBACK:
            return bottomBarTranslations.feedback
        case PATIENT_STATUS.WAITLIST:
            return bottomBarTranslations.waitlisted
        default:
            console.error(`statusToString(): Unrecognized status: ${status}`)
    }

    return status
}

/**
 * Gets the icon associated with the status.
 */
const getStepStatusIcon = (status: StepStatus) => {
    if (!status) return unfinishedIcon

    switch (status) {
        case StepStatus.FINISHED:
            return finishedIcon
        case StepStatus.PARTIAL:
            return partiallyIcon
        case StepStatus.UNFINISHED:
            return unfinishedIcon
        default:
            console.error(`getStepStatusIcon(): Unrecognized status: ${status}`)
    }

    return unfinishedIcon
}

/**
 * Gets the color associated with the status.
 */
const getPatientStatusColor = (status: PatientStatus) => {
    switch (status) {
        case PATIENT_STATUS.ACTIVE:
            return '#65d991'
        case PATIENT_STATUS.ARCHIVE:
            return 'black'
        case PATIENT_STATUS.FEEDBACK:
            return '#5395f8'
        case PATIENT_STATUS.WAITLIST:
            return '#75aaff'
        default:
            console.error(`getPatientStatusColor(): Unrecognized status: ${status}`)
    }

    return 'black'
}

/**
 * Converts a step status value to JSX.
 */
const stepStatusToJSX = (status: StepStatus, selectedLang: Language) => {
    const statusStringified = stepStatusToString(status, selectedLang)
    const statusIcon = getStepStatusIcon(status)

    return (
        <div>
            <img alt={status} style={{ marginRight: '6px' }} width="16px" src={statusIcon} />
            {` ${statusStringified}`}
        </div>
    )
}

/**
 * Converts a patient's overall status value to JSX.
 */
const patientStatusToJSX = (status: PatientStatus, selectedLang: Language) => {
    const statusStringified = patientStatusToString(status, selectedLang)
    const statusColor = getPatientStatusColor(status)

    return (
        <b>
            <div style={{ color: statusColor }}>{statusStringified}</div>
        </b>
    )
}

/**
 * Converts an access level value to string
 */
const accessToString = (access: AccessLevel, selectedLang: Language) => {
    const accessTranslations = translations[selectedLang].accountManagement

    switch (access) {
        case AccessLevel.GRANTED:
            return accessTranslations.Approved
        case AccessLevel.PENDING:
            return accessTranslations.Pending
        case AccessLevel.REVOKED:
            return accessTranslations.Revoked
        default:
            console.error(`Unrecognized access level: ${access}`)
    }

    return access
}

/**
 * Gets the color associated with an access level
 */
const getAccessColor = (access: AccessLevel) => {
    switch (access) {
        case AccessLevel.GRANTED:
            return '#65d991'
        case AccessLevel.PENDING:
            return 'black'
        case AccessLevel.REVOKED:
            return 'red'
        default:
            console.error(`getAccessColor(): Unrecognized accces level ${access}`)
    }

    return 'black'
}

/**
 * Gets the JSX associated with an access level
 */
const accessToJSX = (access: AccessLevel, selectedLang: Language) => {
    const accessString = accessToString(access, selectedLang)
    const accessColor = getAccessColor(access)
    return (
        <div style={{ color: accessColor }}>
            <b>{accessString}</b>
        </div>
    )
}

/**
 * Given signature data, converts it to a standard enum value
 */
const signatureDataToValue = (signatureData: Signature) =>
    signatureData?.signatureData ? SignatureStatus.SIGNED : SignatureStatus.UNSIGNED

/**
 * Gets the JSX associated with the given signature data
 */
const signatureToJSX = (signatureData: Signature) => {
    const signatureStatus = signatureDataToValue(signatureData)

    switch (signatureStatus) {
        case SignatureStatus.SIGNED:
            return (
                <div style={{ color: '#65d991' }}>
                    <CheckIcon />
                </div>
            )
        case SignatureStatus.UNSIGNED:
            return (
                <div style={{ color: 'red' }}>
                    <CloseIcon />
                </div>
            )
        default:
            console.error(`signatureToJSX(): Unrecognized signature status ${signatureStatus}`)
    }

    return null
}

/**
 * Returns the user-friendly name for a field type
 * @param {String} fieldType Type of field
 * @returns The user-friendly name
 */
export const getFieldName = (fieldType: FieldType) => {
    switch (fieldType) {
        case FieldType.AUDIO:
            return 'Audio Recording'
        case FieldType.DATE:
            return 'Date'
        case FieldType.DIVIDER:
            return 'Divider'
        case FieldType.FIELD_GROUP:
            return 'Field Group'
        case FieldType.FILE:
            return 'File'
        case FieldType.HEADER:
            return 'Header'
        case FieldType.MAP:
            return 'Location'
        case FieldType.MULTILINE_STRING:
            return 'Long text'
        case FieldType.NUMBER:
            return 'Number'
        case FieldType.PHONE:
            return 'Phone Number'
        case FieldType.PHOTO:
            return 'Photograph'
        case FieldType.RADIO_BUTTON:
            return 'Multiple Choice Question'
        case FieldType.SIGNATURE:
            return 'Signature'
        case FieldType.STRING:
            return 'Short text'
        default:
            return fieldType
    }
}

/**
 * Returns whether or not a field can be added to a step
 * @param {String} fieldType Type of field
 * @returns The user-friendly name
 */
export const canFieldBeAddedToStep = (fieldType: FieldType) => {
    switch (fieldType) {
        case FieldType.AUDIO:
        case FieldType.DATE:
        case FieldType.DIVIDER:
        case FieldType.FIELD_GROUP:
        case FieldType.FILE:
        case FieldType.HEADER:
        case FieldType.MAP:
        case FieldType.MULTILINE_STRING:
        case FieldType.NUMBER:
        case FieldType.PHONE:
        case FieldType.PHOTO:
        case FieldType.RADIO_BUTTON:
        case FieldType.SIGNATURE:
        case FieldType.STRING:
            return true

        default:
            return false
    }
}

/**
 * Turn field data into a string
 * @param {Any} fieldData The data to stringify
 * @param {String} fieldType The type of this data
 * @param {String} selectedLang The currently selected language
 * @returns The stringified field
 */
export const fieldToString = (
    fieldData: any,
    fieldType: AnyFieldType,
    selectedLang: Language
): string => {
    switch (fieldType) {
        case FieldType.MULTILINE_STRING:
        case FieldType.STRING:
        case FieldType.NUMBER:
        case FieldType.PHONE:
            return fieldData
        case FieldType.DATE:
            return formatDate(new Date(fieldData), selectedLang)
        case DisplayFieldType.STEP_STATUS:
            return stepStatusToString(fieldData, selectedLang)
        case DisplayFieldType.PATIENT_STATUS:
            return patientStatusToString(fieldData, selectedLang)
        case DisplayFieldType.ACCESS:
            return accessToString(fieldData, selectedLang)
        case FieldType.SIGNATURE:
            return signatureDataToValue(fieldData)
        default:
            console.error(`fieldToString(): Unrecognized field: ${fieldType}`)
    }

    return fieldData
}

/**
 * Turn field data into JSX. I.e. apply formatting to it.
 * @param {Any} fieldData The data to get JSX for.
 * @param {String} fieldType The type of this data.
 * @param {String} selectedLang The currently selected language
 * @returns The JSX
 */
export const fieldToJSX = (fieldData: any, fieldType: AnyFieldType, selectedLang: Language) => {
    const stringifiedField = fieldToString(fieldData, fieldType, selectedLang)

    switch (fieldType) {
        case FieldType.MULTILINE_STRING:
            return <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{stringifiedField}</p>
        case FieldType.STRING:
        case FieldType.NUMBER:
        case FieldType.PHONE:
        case FieldType.DATE:
            return stringifiedField
        case FieldType.SIGNATURE:
            return signatureToJSX(fieldData)
        case DisplayFieldType.STEP_STATUS:
            return stepStatusToJSX(fieldData, selectedLang)
        case DisplayFieldType.PATIENT_STATUS:
            return patientStatusToJSX(fieldData, selectedLang)
        case DisplayFieldType.ACCESS:
            return accessToJSX(fieldData, selectedLang)
        default:
            console.error(`fieldToJSX(): Unrecognized field: ${fieldType}`)
    }

    return stringifiedField
}

export type HasDisplayName<T> = T & { displayName: { [key in Language]: string } }
export type HasAdditionalData<T> = T & { additionalData: AdditionalFieldData }

/**
 * Validates a field's data.
 * @param {JSON} fieldData
 */
export const validateField = <T extends Record<string, any> = Record<string, any>>(
    fieldData: HasAdditionalData<HasDisplayName<T>>
) => {
    if (fieldData.displayName.EN.trim() === '' || fieldData.displayName.AR.trim() === '') {
        throw new Error(ERR_LANGUAGE_VALIDATION_FAILED)
    }

    if (fieldData.fieldType === FieldType.RADIO_BUTTON && fieldData.options.length === 0) {
        throw new Error(ERR_OPTION_VALIDATION_FAILED)
    }

    if (
        fieldData.fieldType === FieldType.SIGNATURE &&
        !fieldData.additionalData?.defaultDocumentURL
    ) {
        throw new Error(ERR_MISSING_SIGNATURE_DOCUMENT)
    }
}
