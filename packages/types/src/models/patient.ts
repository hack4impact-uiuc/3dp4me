// TODO: Import this everywhere else in backend
export enum PatientStatus {
    ACTIVE = 'Active',
    ARCHIVED = 'Archived',
    FEEDBACK = 'Feedback',
    WAITLIST = 'Waitlist',
}

export interface BasePatient {
    firstName?: string,
    fathersName?: string,
    grandfathersName?: string
    familyName?: string
}

export interface Patient extends BasePatient {
    dateCreated: Date,
    orderYear: number,
    orderId: string,
    lastEdited: Date,
    lastEditedBy?: string,
    status: PatientStatus,
    phoneNumber?: string,
    secret?: string
}