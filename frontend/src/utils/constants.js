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

    // This is a special field only used on the frontend
    STATUS: 'Status',
};

export const REQUIRED_DASHBOARD_HEADERS = [
    { title: 'firstName', sortKey: 'firstName', fieldType: FIELD_TYPES.STRING },
    {
        title: 'familyName',
        sortKey: 'familyName',
        fieldType: FIELD_TYPES.STRING,
    },
    { title: 'lastEdited', sortKey: 'lastEdited', fieldType: FIELD_TYPES.DATE },
    { title: 'status', sortKey: 'status', fieldType: FIELD_TYPES.STATUS },
];

export const REQUIRED_DASHBOARD_SORT_KEYS = [
    { id: 'firstName', fieldType: FIELD_TYPES.STRING },
    { id: 'familyName', fieldType: FIELD_TYPES.STRING },
    { id: 'lastEdited', fieldType: FIELD_TYPES.DATE },
    { id: 'status', fieldType: FIELD_TYPES.STATUS },
];

export const ACCESS_LEVELS = {
    GRANTED: 'Granted',
    REVOKED: 'Revoked',
    PENDING: 'Pending',
};

export const STEP_STATUS = {
    FINISHED: 'Finished',
    UNFINISHED: 'Unfinished',
    PARTIALLY_FINISHED: 'Partial',
};

export const PATIENT_STATUS = {
    FEEDBACK: 'Feedback',
    ARCHIVE: 'Archive',
    ACTIVE: 'Active',
};

export const REDUCER_ACTIONS = {
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
};

export const SIGNATURE_STATUS = {
    SIGNED: 'SIGNED',
    UNSIGNED: 'UNSIGNED',
};

export const PATIENT_KEY_STATUS = 'status';
