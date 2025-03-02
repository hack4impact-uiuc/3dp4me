/* eslint-disable no-restricted-syntax */
import {
    File,
    Nullish,
    Patient,
    ReservedStep,
    RootStep,
    RootStepFieldKeys,
    Step,
} from '@3dp4me/types'

import { TagOption } from '../components/Fields/FormOption'
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

    return tagsMeta.options.map((o) => ({
        _id: o._id,
        TagTitle: o.Question,
        IsHidden: o.IsHidden,
    }))
}
