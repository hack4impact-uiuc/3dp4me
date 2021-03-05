export const REQUIRED_DASHBOARD_HEADERS = [
    { title: 'name', sortKey: 'name' },
    { title: 'status', sortKey: 'status' },
];
export const REQUIRED_DASHBOARD_SORT_KEYS = REQUIRED_DASHBOARD_HEADERS.map(
    (header) => header.sortKey,
);

export const STEP_STATUS = {
    FINISHED: 'finished',
    UNFINISHED: 'unfinished',
    PARTIALLY_FINISHED: 'partial',
};

export const PATIENT_STATUS = {
    FEEDBACK: 'feedback',
    ARCHIVE: 'archive',
    ACTIVE: 'active',
};

export const FIELD_TYPES = {
    STRING: 'String',
    MULTILINE_STRING: 'String',
    FILE: 'File',
    NUMBER: 'Number',
    DATE: 'Date',
    PHONE: 'Phone',
    DIVIDER: 'Divider',
    HEADER: 'Header',
    RADIO_BUTTON: 'RadioButton',
    DROPDOWN: 'Dropdown',
};

export const PATIENT_KEY_STATUS = 'status';
