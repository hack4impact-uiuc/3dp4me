module.exports.ADMIN_ID = process.env.ADMIN_ID;

module.exports.ACCESS_LEVELS = {
    GRANTED: 'Granted',
    REVOKED: 'Revoked',
    PENDING: 'Pending',
};

module.exports.FIELDS = {
    AUDIO: 'Audio',
    STRING: 'String',
    MULTILINE_STRING: 'MultilineString',
    FILE: 'File',
    NUMBER: 'Number',
    DATE: 'Date',
    PHONE: 'Phone',
    DIVIDER: 'Divider',
    HEADER: 'Header',
    RADIO_BUTTON: 'RadioButton',
    MULTI_SELECT: 'MultiSelect',
    AUDIO: 'Audio',
    SIGNATURE: 'Signature',
    PHOTO: 'Photo',
    FIELD_GROUP: 'FieldGroup',
};

module.exports.STEPS_COLLECTION_NAME = 'steps';

module.exports.ERR_NOT_APPROVED =
    'You are not approved to access this site. Please contact an administrator.';
module.exports.ERR_AUTH_FAILED = 'Authentication failed';
module.exports.ERR_FIELD_VALIDATION_FAILED =
    'fieldKeys and fieldNumbers must be unique';

const GLOBALLY_IMMUTABLE_ATTRIBUTES = ['_id', '__v'];

module.exports.STEP_IMMUTABLE_ATTRIBUTES = GLOBALLY_IMMUTABLE_ATTRIBUTES.concat(
    'lastEdited',
    'lastEditedBy',
    'patientId',
);

module.exports.PATIENT_IMMUTABLE_ATTRIBUTES = GLOBALLY_IMMUTABLE_ATTRIBUTES.concat(
    'dateCreated',
    'lastEdited',
    'lastEditedBy',
);
