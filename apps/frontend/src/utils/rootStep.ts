/* eslint-disable no-restricted-syntax */
import { File, Patient, ReservedStep, RootStepFieldKeys } from '@3dp4me/types'

import { getStepData } from './metadataUtils'
import { photoToURI } from './photoManipulation'

export const getProfilePictureUrl = (patient: Patient) => {
    const rootStep = getStepData(patient, ReservedStep.Root)
    if (!rootStep) return null

    const pictureHistory: File[] = rootStep[RootStepFieldKeys.ProfilePicture]
    if (!pictureHistory?.length) return null

    return photoToURI(
        pictureHistory[pictureHistory.length - 1],
        ReservedStep.Root,
        RootStepFieldKeys.ProfilePicture,
        patient._id
    )
}

export const getProfilePictureAsFileArray = (patient: Patient): File[] => {
    const rootStep = getStepData(patient, ReservedStep.Root)
    if (!rootStep) return []

    if (!rootStep[RootStepFieldKeys.ProfilePicture]?.length) return []

    return rootStep[RootStepFieldKeys.ProfilePicture]
}

export const getPatientTags = (patient: Patient): string[] => {
    const rootStep = getStepData(patient, ReservedStep.Root)
    console.log(rootStep)
    if (!rootStep) return []

    return rootStep[RootStepFieldKeys.Tags] || []
}