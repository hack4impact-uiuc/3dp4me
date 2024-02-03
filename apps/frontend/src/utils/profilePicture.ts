/* eslint-disable no-restricted-syntax */
import { FieldType, File, Patient, ReservedStep, Step } from '@3dp4me/types'

import { getStepData } from './metadataUtils'
import { photoToURI } from './photoManipulation'

export const getProfilePictureUrl = (patient: Patient) => {
    const rootStep = getStepData(patient, ReservedStep.Root)

    return photoToURI(imageData[0], step.key, field.key, patientData._id)
}

export const getProfilePictureAsFileArray = (patient: Patient): File[] => {
    if (!patient.profilePicture)
        return []
    return [patient.profilePicture]
}