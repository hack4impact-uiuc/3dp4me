import { Field, FieldType, QuestionOption, Step } from '../models'

export enum ReservedStep {
    // This is where inherent data for the patient can be stored, like the profile picture
    Root = '__root_patient_storage',
}

export enum RootStepFieldKeys {
    ProfilePicture = 'profilePicture',
    Tags = 'tags',
}

export const PatientTagSyria = {
    Index: 2,
    Question: { EN: 'Syria', AR: 'سوريا' },
    IsHidden: false,
}

export const PatientTagOptions: Omit<QuestionOption, '_id'>[] = [
    {
        Index: 0,
        Question: { EN: 'Jordan', AR: 'الأردن' },
        IsHidden: false,
    },
    {
        Index: 1,
        Question: { EN: 'Gaza', AR: 'غزة' },
        IsHidden: false,
    },
    PatientTagSyria,
]

export const PatientTagsField: Field = {
    key: RootStepFieldKeys.Tags,
    displayName: { EN: 'Patient Tags', AR: 'علامات المريض' },
    fieldType: FieldType.TAGS,
    subFields: [],
    readableGroups: [],
    writableGroups: [],
    fieldNumber: 1,
    options: PatientTagOptions as QuestionOption[],
    isVisibleOnDashboard: false,
    isHidden: false,
    isDeleted: false,
    additionalData: null,
}

export const RootStep: Step = {
    key: ReservedStep.Root,
    displayName: { EN: 'NONE', AR: 'NONE' },
    stepNumber: 65535,
    fields: [
        {
            key: RootStepFieldKeys.ProfilePicture,
            displayName: { EN: 'NONE', AR: 'NONE' },
            fieldType: FieldType.PHOTO,
            subFields: [],
            readableGroups: [],
            writableGroups: [],
            fieldNumber: 0,
            options: [],
            isVisibleOnDashboard: false,
            isHidden: false,
            isDeleted: false,
            additionalData: null,
        },
        PatientTagsField,
    ],
    readableGroups: [],
    writableGroups: [],
    defaultToListView: false,
    isHidden: false,
    isDeleted: false,
}
