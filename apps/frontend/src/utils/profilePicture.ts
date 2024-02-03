/* eslint-disable no-restricted-syntax */
import { FieldType, Patient, Step } from '@3dp4me/types'

import { getStepData } from './metadataUtils'
import { photoToURI } from './photoManipulation'

export const getProfilePictureUrl = (steps: Step[], patientData: Patient) => {
    for (const step of steps) {
        const photoFields = getPhotoFields(step)
        for (const field of photoFields) {
            const stepData = getStepData(patientData, step.key)
            if (!stepData) continue

            const imageData = stepData[field.key]
            if (!imageData?.length) continue

            return photoToURI(imageData[0], step.key, field.key, patientData._id)
        }
    }

    return null
}

const getPhotoFields = (step: Step) => step.fields.filter((f) => f.fieldType === FieldType.PHOTO)
