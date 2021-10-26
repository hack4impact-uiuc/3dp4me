module.exports.ADMIN_ID = process.env.ADMIN_ID;

module.exports.ENV_TEST = 'test';

module.exports.ACCESS_LEVELS = {
    GRANTED: 'Granted',
    REVOKED: 'Revoked',
    PENDING: 'Pending',
};

module.exports.FIELDS = {
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

module.exports.PATIENT_STATUS_ENUM = {
    ACTIVE: 'Active',
    ARCHIVED: 'Archived',
    FEEDBACK: 'Feedback',
};

module.exports.STEP_STATUS_ENUM = {
    UNFINISHED: 'Unfinished',
    PARTIAL: 'Partial',
    FINISHED: 'Finished',
};

module.exports.STEPS_COLLECTION_NAME = 'steps';

module.exports.ERR_NOT_APPROVED = 'You are not approved to access this site. Please contact an administrator.';
module.exports.ERR_AUTH_FAILED = 'Authentication failed';
module.exports.ERR_FIELD_VALIDATION_FAILED = 'fieldKeys and fieldNumbers must be unique';
module.exports.ERR_LANGUAGE_VALIDATION_FAILED = 'Please submit a field with a question in English and Arabic.';

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

module.exports.DEFAULT_USERS_ON_GET_REQUEST = 0;
module.exports.DEFAULT_PATIENTS_ON_GET_REQUEST = 1;

module.exports.TWILIO_SENDING_NUMBER = 'whatsapp:+14155238886';
module.exports.TWILIO_RECEIVING_NUMBER = 'whatsapp:+13098319210';
