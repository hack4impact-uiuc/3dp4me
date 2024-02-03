/* eslint-disable no-restricted-syntax */
import { FieldType, File, Patient, ReservedStep, RootStepFieldKeys, Step } from '@3dp4me/types'

import { getStepData } from './metadataUtils'
import { photoToURI } from './photoManipulation'

export const getProfilePictureUrl = (patient: Patient) => {
    const rootStep = getStepData(patient, ReservedStep.Root)
    if (!rootStep) return null

    if (!rootStep[RootStepFieldKeys.ProfilePicture]?.length)
        return null

    return photoToURI(
        rootStep[RootStepFieldKeys.ProfilePicture][0], 
        ReservedStep.Root, 
        RootStepFieldKeys.ProfilePicture, 
        patient._id
    )
}

export const getProfilePictureAsFileArray = (patient: Patient): File[] => {
    const rootStep = getStepData(patient, ReservedStep.Root)
    if (!rootStep) return []

    if (!rootStep[RootStepFieldKeys.ProfilePicture]?.length)
        return []

    return rootStep[RootStepFieldKeys.ProfilePicture]
}