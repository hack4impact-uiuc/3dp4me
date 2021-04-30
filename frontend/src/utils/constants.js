export const REQUIRED_DASHBOARD_HEADERS = [
    { title: 'firstName', sortKey: 'firstName' },
    { title: 'familyName', sortKey: 'familyName' },
    { title: 'lastEdited', sortKey: 'lastEdited' },
    { title: 'status', sortKey: 'status' },
];

export const REQUIRED_DASHBOARD_SORT_KEYS = REQUIRED_DASHBOARD_HEADERS.map(
    (header) => header.sortKey,
);

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
};

export const REDUCER_ACTIONS = {
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
};

export const PATIENT_KEY_STATUS = 'status';
