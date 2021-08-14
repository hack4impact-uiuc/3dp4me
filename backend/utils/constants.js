module.exports.ADMIN_ID = process.env.ADMIN_ID;

module.exports.ACCESS_LEVELS = {
    GRANTED: 'Granted',
    REVOKED: 'Revoked',
    PENDING: 'Pending',
};

module.exports.ERR_NOT_APPROVED =
    'You are not approved to access this site. Please contact an administrator.';
module.exports.ERR_AUTH_FAILED = 'Authentication failed';

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
