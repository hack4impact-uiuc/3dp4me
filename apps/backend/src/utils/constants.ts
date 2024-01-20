export const ADMIN_ID = process.env.ADMIN_ID!

export const ENV_TEST = 'test'

export const STEPS_COLLECTION_NAME = 'steps'

export const ERR_NOT_APPROVED =
    'You are not approved to access this site. Please contact an administrator.'
export const ERR_AUTH_FAILED = 'Authentication failed'
export const ERR_FIELD_VALIDATION_FAILED = 'fieldKeys and fieldNumbers must be unique'
export const ERR_LANGUAGE_VALIDATION_FAILED = 'Please submit a field in English and Arabic.'

export const GLOBALLY_IMMUTABLE_ATTRIBUTES = ['_id', '__v']

export const STEP_IMMUTABLE_ATTRIBUTES = GLOBALLY_IMMUTABLE_ATTRIBUTES.concat(
    'lastEdited',
    'lastEditedBy',
    'patientId'
)

export const PATIENT_IMMUTABLE_ATTRIBUTES = GLOBALLY_IMMUTABLE_ATTRIBUTES.concat(
    'dateCreated',
    'lastEdited',
    'lastEditedBy',
    'orderYear',
    'orderId'
)

export const DEFAULT_USERS_ON_GET_REQUEST = 0
export const DEFAULT_PATIENTS_ON_GET_REQUEST = 1

export const TWILIO_SENDING_NUMBER = 'whatsapp:+14155238886'
export const TWILIO_RECEIVING_NUMBER = 'whatsapp:+13098319210'
export const TWO_FACTOR_WINDOW_MINS = 5
