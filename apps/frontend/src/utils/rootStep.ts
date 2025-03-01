/* eslint-disable no-restricted-syntax */
import { File, Patient, ReservedStep, RootStepFieldKeys, PatientTagOptions, Step, Nullish, RootStep } from '@3dp4me/types';

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

export const getPatientTagValues = (patient: Patient, meta: Step[]): TagOption[] => {
    const rootStep = getStepData(patient, ReservedStep.Root)
    if (!rootStep) return []

    const selectedIds = rootStep[RootStepFieldKeys.Tags] || []
    return getPatientTagOptions(meta).filter((o) => selectedIds.includes(o._id))
}

export const getPatientTagOptions = (meta: Nullish<Step[]>): TagOption[] => {
    if (!meta) return []

    const rootStep = meta.find((s) => s.key === ReservedStep.Root) as Nullish<typeof RootStep>
    if (!rootStep) return []

    const tagsMeta = rootStep.fields.find((f) => f.key === RootStepFieldKeys.Tags)
    if (!tagsMeta) return []

    return tagsMeta.options.map((o) => {
        return {
            _id: o._id,
            TagTitle: o.Question,
            IsHidden: o.IsHidden,
        }
    })
}