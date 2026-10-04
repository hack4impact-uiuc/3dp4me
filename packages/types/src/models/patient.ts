export enum PatientStatus {
    ACTIVE = 'Active',
    ARCHIVED = 'Archived',
    FEEDBACK = 'Feedback',
    WAITLIST = 'Waitlist',
}

export interface BasePatient {
    _id: string
    firstName?: string
    fathersName?: string
    grandfathersName?: string
    familyName?: string
}

export interface Patient extends BasePatient {
    dateCreated: Date
    orderYear: number
    orderId: string
    lastEdited: Date
    lastEditedBy?: string
    status: PatientStatus
    phoneNumber?: string
    secret?: string
}

// Top-level Patient fields the backend can sort on across the whole collection
export const SERVER_SORTABLE_PATIENT_FIELDS = [
    'firstName',
    'familyName',
    'orderId',
    'lastEdited',
    'status',
] as const

export type ServerSortablePatientField = (typeof SERVER_SORTABLE_PATIENT_FIELDS)[number]

export const isServerSortablePatientField = (key: unknown): key is ServerSortablePatientField =>
    (SERVER_SORTABLE_PATIENT_FIELDS as readonly unknown[]).includes(key)
