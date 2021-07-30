import translations from '../translations.json';

/**
 * List of possible field types. Must match Metadata.js in the backend.
 */
export const FIELD_TYPES = {
    STRING: 'String',
    MULTILINE_STRING: 'MultilineString',
    FILE: 'File',
    NUMBER: 'Number',
    DATE: 'Date',
    PHONE: 'Phone',
    DIVIDER: 'Divider',
    HEADER: 'Header',
    RADIO_BUTTON: 'RadioButton',
    DROPDOWN: 'Dropdown',
    AUDIO: 'Audio',
    FIELD_GROUP: 'FieldGroup',
    SIGNATURE: 'Signature',

    // These are special fields only used on the frontend for table rendering
    STEP_STATUS: 'StepStatus',
    PATIENT_STATUS: 'PatientStatus',
    ACCESS: 'Access',
};

/**
 * List of base routes
 */
export const ROUTES = {
    DASHBOARD: '/',
    PATIENTS: '/patients',
    ACCOUNT: '/account',
    DASHBOARD_MANAGEMENT: '/dashboard-management',
    PATIENT_DETAIL: '/patient-info',
};

/**
 * For anyone using the custom sortableData hook
 */
export const SORT_DIRECTIONS = {
    AESC: 'ascending',
    DESC: 'descending',
    NONE: 'none',
};

/**
 * Names of custom attributes defined in AWS Cognito console.
 */
export const COGNITO_ATTRIBUTES = {
    LANGUAGE: 'custom:language',
    ROLES: 'custom:security_roles',
    ACCESS: 'custom:access',
};

/**
 * List of headers that every per step table has. These are
 * the leftmost columns on the dashboard screen.
 */
export const getStepDashboardHeaders = (langKey) => {
    const t = translations[langKey].tableHeaders;

    return [
        { title: t.firstName, sortKey: 'firstName' },
        { title: t.familyName, sortKey: 'familyName' },
        { title: t.lastEdited, sortKey: 'lastEdited' },
    ];
};

/**
 * List of row data that every per step table has.
 * 'id' must match 'sortKey' in the headers
 */
export const PATIENTS_BY_STEP_TABLE_ROW_DATA = [
    { id: 'firstName', dataType: FIELD_TYPES.STRING },
    { id: 'familyName', dataType: FIELD_TYPES.STRING },
    { id: 'lastEdited', dataType: FIELD_TYPES.DATE },
];

/**
 * List of headers that every patient table has. These are
 * the leftmost columns on the 'all patients' screen.
 */
export const getPatientDashboardHeaders = (langKey) => {
    const t = translations[langKey].tableHeaders;

    return [
        { title: t.firstName, sortKey: 'firstName' },
        { title: t.familyName, sortKey: 'familyName' },
        { title: t.lastEdited, sortKey: 'lastEdited' },
        { title: t.status, sortKey: 'status' },
    ];
};

/**
 * List of row data that every patient table has.
 * 'id' must match 'sortKey' in the headers
 */
export const ALL_PATIENT_DASHBOARD_ROW_DATA = [
    { id: 'firstName', dataType: FIELD_TYPES.STRING },
    { id: 'familyName', dataType: FIELD_TYPES.STRING },
    { id: 'lastEdited', dataType: FIELD_TYPES.DATE },
    { id: 'status', dataType: FIELD_TYPES.PATIENT_STATUS },
];

/**
 * List of different access levels. Must match the backend.
 */
export const ACCESS_LEVELS = {
    GRANTED: 'Granted',
    REVOKED: 'Revoked',
    PENDING: 'Pending',
};

/**
 * List of completion statuses for a step. Must match StepSchemaSubmodel.js in backend
 */
export const STEP_STATUS = {
    FINISHED: 'Finished',
    UNFINISHED: 'Unfinished',
    PARTIALLY_FINISHED: 'Partial',
};

/**
 * List of completion statuses for an entire patient. Must match Patient.js in backend
 */
export const PATIENT_STATUS = {
    FEEDBACK: 'Feedback',
    ARCHIVE: 'Archive',
    ACTIVE: 'Active',
};

/**
 * List of actions for the reducer
 */
export const REDUCER_ACTIONS = {
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    SET_LANGUAGE: 'SET_LANGUAGE',
};

/**
 * List of supported languages
 */
export const LANGUAGES = {
    EN: 'EN',
    AR: 'AR',
};

/**
 * List of signature statuses. Only used on the frontend, doesn't
 * need to match anything on the backend
 */
export const SIGNATURE_STATUS = {
    SIGNED: 'SIGNED',
    UNSIGNED: 'UNSIGNED',
};

/**
 * The key used for both step status and patient status. The backend schemas
 * must use this string in their models for status.
 */
export const PATIENT_KEY_STATUS = 'status';
