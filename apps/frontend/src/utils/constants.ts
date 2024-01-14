import { FieldType, Language, Patient } from '@3dp4me/types';
import translations from '../translations.json';
import { ColumnMetadata, Header } from './table-renderers';
import { RoleForTable, UserForTable } from '../pages/AccountManagement/AccountManagment';

const PUBLIC_CLOUDFRONT_URL = 'https://d1m40dlonmuszr.cloudfront.net';

/**
 * Generic URL for phone number country flags. {XX} will be replaced by two letter country code.
 */
export const FLAG_URL = `${PUBLIC_CLOUDFRONT_URL}/flags/3x2/{XX}.svg`;

export const PIN_URL = `${PUBLIC_CLOUDFRONT_URL}/pin.png`;

export const MAPBOX_TOKEN =
    'pk.eyJ1IjoiYXJjaG5hLTEiLCJhIjoiY2t1eDl3dzgxNnEycDJ3bnoyNzI2bHV3YSJ9.SYNmuMBaIUvJ53tlV5oW5Q';

/**
 * List of base routes
 */
export enum Routes {
    DASHBOARD = '/',
    PATIENTS = '/patients',
    ACCOUNT = '/account',
    DASHBOARD_MANAGEMENT = '/dashboard-management',
    PATIENT_DETAIL = '/patient-info',
    PATIENT_2FA = '/patient-2fa',
};

/**
 * For anyone using the custom sortableData hook
 */
export enum SortDirection {
    Ascending =  'ascending',
    Descending =  'descending',
    None = 'none',
};

/**
 * Names of custom attributes defined in AWS Cognito console.
 */
export enum CognitoAttribute {
    Language = 'custom:language',
    Roles = 'custom:security_roles',
    Access = 'custom:access',
};

// These are special fields only used on the frontend for table rendering
export enum DisplayFieldType {
    STEP_STATUS = "StepStatus",
    PATIENT_STATUS = "PatientStatus",
    ACCESS = "Access",
}

export type AnyFieldType = FieldType | DisplayFieldType;

/**
 * List of headers that every per step table has. These are
 * the leftmost columns on the dashboard screen.
 */
export const getStepDashboardHeaders = (langKey: Language) => {
    const t = translations[langKey].tableHeaders;

    return [
        { title: t.firstName, sortKey: 'firstName' },
        { title: t.familyName, sortKey: 'familyName' },
        { title: t.orderId, sortKey: 'orderId' },
        { title: t.lastEdited, sortKey: 'lastEdited' },
    ];
};

/**
 * List of row data that every per step table has.
 * 'id' must match 'sortKey' in the headers
 */
export const PATIENTS_BY_STEP_TABLE_ROW_DATA: ColumnMetadata<Patient>[] = [
    { id: 'firstName', dataType: FieldType.STRING },
    { id: 'familyName', dataType: FieldType.STRING },
    { id: 'orderId', dataType: FieldType.STRING },
    { id: 'lastEdited', dataType: FieldType.DATE },
];

/**
 * List of headers that every patient table has. These are
 * the leftmost columns on the 'all patients' screen.
 */
export const getPatientDashboardHeaders = (langKey: Language): Header<Patient>[] => {
    const t = translations[langKey].tableHeaders;

    return [
        { title: t.firstName, sortKey: 'firstName' },
        { title: t.familyName, sortKey: 'familyName' },
        { title: t.orderId, sortKey: 'orderId' },
        { title: t.lastEdited, sortKey: 'lastEdited' },
        { title: t.status, sortKey: 'status' },
    ];
};

/**
 * List of row data that every patient table has.
 * 'id' must match 'sortKey' in the headers
 */
export const ALL_PATIENT_DASHBOARD_ROW_DATA: ColumnMetadata<Patient>[] = [
    { id: 'firstName', dataType: FieldType.STRING },
    { id: 'familyName', dataType: FieldType.STRING },
    { id: 'orderId', dataType: FieldType.STRING },
    { id: 'lastEdited', dataType: FieldType.DATE },
    { id: 'status', dataType: DisplayFieldType.PATIENT_STATUS },
];

/**
 * List of headers that the user table has. These are
 * the columns on the 'manage users' screen.
 */
export const getUserTableHeaders = (langKey: Language) => {
    const t = translations[langKey].tableHeaders;

    return [
        { title: t.name, sortKey: 'Name' },
        { title: t.email, sortKey: 'Email' },
        { title: t.roles, sortKey: 'Roles' },
        { title: t.access, sortKey: 'Access' },
    ];
};

/**
 * List of headers that the role table has. These are
 * the columns on the 'manage roles' screen.
 */
export const getRoleTableHeaders = (langKey: Language) => {
    const t = translations[langKey].tableHeaders;

    return [{ title: t.name, sortKey: 'Name' }];
};

/**
 * List of row data that the user table has.
 * 'id' must match 'sortKey' in the headers
 */
export const USER_TABLE_ROW_DATA: ColumnMetadata<UserForTable>[] = [
    { id: 'Name', dataType: FieldType.STRING },
    { id: 'Email', dataType: FieldType.STRING },
    { id: 'Roles', dataType: FieldType.STRING },
    { id: 'Access', dataType: DisplayFieldType.ACCESS },
];

/**
 * List of row data that the role table has.
 * 'id' must match 'sortKey' in the headers
 */
export const ROLE_TABLE_ROW_DATA: ColumnMetadata<RoleForTable>[] = [
    { id: 'Name', dataType: FieldType.STRING },
];

/**
 * List of different access levels. Must match the backend.
 */
export const AccessLevel = {
    GRANTED: 'Granted',
    REVOKED: 'Revoked',
    PENDING: 'Pending',
};

/**
 * List of completion statuses for a step. Must match constants.js in backend
 */
export const STEP_STATUS = {
    FINISHED: 'Finished',
    UNFINISHED: 'Unfinished',
    PARTIALLY_FINISHED: 'Partial',
};

/**
 * List of completion statuses for an entire patient. Must match constants.js in backend
 */
export const PATIENT_STATUS = {
    FEEDBACK: 'Feedback',
    ARCHIVE: 'Archived',
    ACTIVE: 'Active',
    WAITLIST: 'Waitlist',
};

/**
 * List of actions for the reducer
 */

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
export enum SignatureStatus {
    SIGNED = 'SIGNED',
    UNSIGNED = 'UNSIGNED',
};

/**
 * The key used for both step status and patient status. The backend schemas
 * must use this string in their models for status.
 */
export const PATIENT_KEY_STATUS = 'status';

export const COORDINATES = {
    DEFAULT_MAP_LAT: 37.7577,
    DEFAULT_MAP_LONG: -122.4376,
};

export const MAP_STYLE = 'mapbox://styles/mapbox/satellite-streets-v11';

export const PEOPLE_PER_PAGE = 14;

export const NUMBER_OF_PHOTOS_FOR_BULLET_VIEW = 16;

/**
 * Error Messages
 */

export const ERR_LANGUAGE_VALIDATION_FAILED =
    'Please submit a field in English and Arabic.';
export const ERR_OPTION_VALIDATION_FAILED = 'Please enter options.';

export const ERR_ROLE_INPUT_VALIDATION_FAILED =
    'Do not leave role name and description fields empty, please enter values.';
export const ERR_ROLE_IS_IMMUTABLE = 'This role cannot be edited';

/**
 * The id of the Admin role in the database.
 */

export const ADMIN_ID = '60e496fa7398681e9c82e0f5';

export const PERMISSION_CONSTRAINTS = { audio: true, video: true };

export const PERMISSION_STATUS_DENIED = 'denied';

export const PATIENT_TABLE_SEARCH_DELAY = 1000;

export const ACCOUNT_MANAGEMENT_TAB_NAMES = {
    EN: ['USERS', 'ROLES'],
    AR: ['المستخدمون', 'الأدوار'],
};

export const ACCOUNT_MANAGEMENT_TABS = {
    USERS: 'USERS',
    ROLES: 'ROLES',
};

export const RESIZE_TOGGLE_BUTTON_ESTIMATED_WIDTH = 170;
