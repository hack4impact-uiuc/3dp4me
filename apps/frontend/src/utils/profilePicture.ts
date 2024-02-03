import { BasePatient, Field, FieldType, Patient, Step } from "@3dp4me/types"
import { photoToURI } from "./photoManipulation"
import { getStepData } from "./metadataUtils"

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

const getAllPhotoFields = (steps: Step[]) => {
    return steps.reduce((acc: Field[], step: Step) => {
        return acc.concat(getPhotoFields(step))
    }, [])
}

const getPhotoFields = (step: Step) => {
    return step.fields.filter(f => f.fieldType === FieldType.PHOTO)
}