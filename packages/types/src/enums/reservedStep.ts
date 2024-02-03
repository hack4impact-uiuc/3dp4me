import { FieldType, Step } from "src/models";

export enum ReservedStep {
    // This is where inherent data for the patient can be stored, like the profile picture
    Root = "__root_patient_storage"
}

export enum RootStepFieldKeys {
    ProfilePicture = "profilePicture"
}

export const RootStep: Step = {
    key: ReservedStep.Root,
    displayName: {EN: "NONE", AR: "NONE"},
    stepNumber: 65535,
    fields: [{
        key: RootStepFieldKeys.ProfilePicture,
        displayName: { EN: "NONE", AR: "NONE"},
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
    }],
    readableGroups: [],
    writableGroups: [],
    defaultToListView: false,
    isHidden: false,
    isDeleted: false
}