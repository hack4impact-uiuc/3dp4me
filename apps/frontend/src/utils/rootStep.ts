/* eslint-disable no-restricted-syntax */
import { File, Patient, ReservedStep, RootStepFieldKeys, PatientTagOptions } from '@3dp4me/types'

import { getStepData } from './metadataUtils'
import { photoToURI } from './photoManipulation'
import { TagOption } from '../components/Fields/FormOption'

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

export const getPatientTagValues = (patient: Patient): TagOption[] => {
    const rootStep = getStepData(patient, ReservedStep.Root)
    if (!rootStep) return []

    const selectedIds = rootStep[RootStepFieldKeys.Tags] || []
    return getPatientTagOptions().filter((o) => selectedIds.includes(o._id))
}

export const getPatientTagOptions = (): TagOption[] => {
    return PatientTagOptions.map((o) => {
        return {
            _id: o._id,
            TagTitle: o.Question,
            IsHidden: o.IsHidden,
        }
    })
}