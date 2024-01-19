import { Field, Nullish, Path, PathValue, Patient, Role, Step } from '@3dp4me/types'

/**
 * Given a patient, constructs their full name
 */
export const getPatientName = (patient: Patient) => {
    if (!patient) return patient

    let name = patient.firstName

    if (patient.fathersName) name += ` ${patient.fathersName}`

    if (patient.grandfathersName) name += ` ${patient.grandfathersName}`

    if (patient.familyName) name += ` ${patient.familyName}`

    return name
}

/**
 * Sorts a metadata object by stepNumber and fieldNumber. This function may mutate the param.
 * @param {Array} stepMetaData The step metadata returned by the backend.
 * @returns The sorted metadata.
 */
export const sortMetadata = (stepMetaData: Step[]) => {
    const data = stepMetaData?.sort((a, b) => a?.stepNumber - b?.stepNumber)

    data.forEach((stepData) => {
        stepData.fields.sort((a, b) => a?.fieldNumber - b?.fieldNumber)
        sortSubFields(stepData?.fields)
    })

    return data
}

/**
 * Sorts the subfields of a field.
 */
const sortSubFields = (fields: Field[]) => {
    if (!fields) return

    fields.forEach((field) => {
        field.subFields.sort((a, b) => a?.fieldNumber - b?.fieldNumber)
        sortSubFields(field?.subFields)
    })
}

/**
 * Converts the roles response to a format useable by the MultiSelect field
 */
export const rolesToMultiSelectFormat = (roles: Role[]) =>
    roles.map((r) => ({
        _id: r?._id,
        IsHidden: r?.isHidden,
        Question: r?.roleName,
    }))

/* 
    Returns a value form a JSON object given a string path (ex: fields[0].subFields)
    Source: https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-and-arrays-by-string-path
*/
export const getJSONReferenceByStringPath = <T extends Record<string, any>, P extends Path<T>>(
    object: T,
    stringPath: P
): Nullish<PathValue<T, P>> => {
    const propertyStringPath = stringPath.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
    const strippedStringPath = propertyStringPath.replace(/^\./, '') // strip a leading dot
    const splitStringPath = strippedStringPath.split('.')
    for (let i = 0, n = splitStringPath.length; i < n; ++i) {
        const trimmedObject = splitStringPath[i]
        if (trimmedObject in object) {
            // eslint-disable-next-line no-param-reassign
            object = object[trimmedObject]
        } else {
            return undefined
        }
    }
    return object as PathValue<T, P>
}
