import { FieldType, QuestionOption, Step, TranslatedString } from '../models'
import { Patient } from '../models/patient';

export enum ReservedStep {
    // This is where inherent data for the patient can be stored, like the profile picture
    Root = '__root_patient_storage',
}

export enum RootStepFieldKeys {
    ProfilePicture = 'profilePicture',
    Tags = 'tags',
}

const PatientTagOptions: QuestionOption[] = [
    {
        Index: 0,
        Question: { EN: "Jordan", AR: "الأردن" },
        IsHidden: false,
        _id: "67b9fad9066c920746fcba5b",
    },
    {
        Index: 1,
        Question: {EN: "Gaza", AR: "غزة"},
        IsHidden: false,
        _id: "67b9fad9066c920746fcba5c",
    }
]

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
        {
            key: RootStepFieldKeys.Tags,
            displayName: { EN: 'Patient Tags', AR: 'علامات المريض' },
            fieldType: FieldType.TAGS,
            subFields: [],
            readableGroups: [],
            writableGroups: [],
            fieldNumber: 1,
            options: PatientTagOptions,
            isVisibleOnDashboard: false,
            isHidden: false,
            isDeleted: false,
            additionalData: null,
        }
    ],
    readableGroups: [],
    writableGroups: [],
    defaultToListView: false,
    isHidden: false,
    isDeleted: false,
}
