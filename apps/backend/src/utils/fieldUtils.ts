import { Field, ReservedStep, RootStepFieldKeys } from '@3dp4me/types'
import mongoose, { ClientSession, SchemaDefinitionProperty } from 'mongoose'

import { StepModel } from '../models/Metadata'
import { isAdmin } from './aws/awsUsers'
import { AuthenticatedUser } from './aws/types'
import { generateFieldSchema } from './initDb'
import { abortAndError } from './transactionUtils'

/**
 * Returns the keys of all fields writable by a user in a step.
 * @param {Object} user The user to check access for. Usually req.user.
 * @param {String} stepKey The key of the step to check.
 * @returns Array of strings. Each entry is a fieldKey that is writable.
 */
export const getWritableFields = async (user: AuthenticatedUser, stepKey: string) => {
    const fields = await getWritableFieldsInStep(user, stepKey)
    return fields.concat(['status'])
}

const getWritableFieldsInStep = async (user: AuthenticatedUser, stepKey: string) => {
    let stepData = await StepModel.findOne({ key: stepKey })
    if (!stepData) return []

    // Return all fields if user is admin
    stepData = stepData.toObject()
    if (isAdmin(user)) return stepData.fields.map((f) => f.key)

    // Check each field to see if user has a writable role
    const writableFields = stepData.fields.filter((field) => {
        const isWritable = field.writableGroups.some((role) => user.roles.includes(role))
        return isWritable
    })

    return writableFields.map((f) => f.key)
}

/**
 * Checks if a field is readable by a user. If the stepKey or fieldKey are
 * invalid, returns false.
 * @param {Object} user The user checking the field's readability. Should usually be req.user.
 * @param {String} stepKey The stepKey of the field.
 * @param {String} fieldKey The fieldKey within the step.
 * @returns True if readable.
 */
export const isFieldReadable = async (
    user: AuthenticatedUser,
    stepKey: string,
    fieldKey: string
) => {
    if (isAdmin(user)) return true
    if (stepKey === ReservedStep.Root) return true

    const fieldData = await getFieldMetadata(stepKey, fieldKey)
    if (!fieldData) return false

    // Check that the user includes at least one readableGroup
    return fieldData?.readableGroups?.some((g) => user.roles.includes(g))
}

/**
 * Checks if a field is writable by a user. If the stepKey or fieldKey are
 * invalid, returns false.
 * @param {Object} user The user checking the field's writability. Should usually be req.user.
 * @param {String} stepKey The stepKey of the field.
 * @param {String} fieldKey The fieldKey within the step.
 * @returns True if writable.
 */
export const isFieldWritable = async (
    user: AuthenticatedUser,
    stepKey: string,
    fieldKey: string
) => {
    if (isAdmin(user)) return true
    if (stepKey === ReservedStep.Root && fieldKey === RootStepFieldKeys.ProfilePicture) return true

    const fieldData = await getFieldMetadata(stepKey, fieldKey)
    if (!fieldData) return false

    // Check that the user includes at least one readableGroup
    return fieldData?.writableGroups?.some((g) => user.roles.includes(g))
}

const getFieldMetadata = async (stepKey: string, fieldKey: string) => {
    let stepData = await StepModel.findOne({ key: stepKey })
    if (!stepData) return null

    stepData = stepData.toObject()
    return stepData?.fields?.find((f) => f.key === fieldKey)
}

export const getFieldByKey = (objectList: Field[], key: string) => {
    if (!objectList) {
        return null
    }

    for (let i = 0; i < objectList.length; ++i) {
        if (objectList[i]?.key === key) {
            return objectList[i]
        }
    }

    return null
}

export const addFieldsToSchema = (stepKey: string, addedFields: Field[]) => {
    // Create a schema for the new fields
    const schemaUpdate: Record<string, SchemaDefinitionProperty> = {}
    addedFields.forEach((field) => {
        const schema = generateFieldSchema(field)
        if (!schema) return
        schemaUpdate[field.key] = schema
    })

    // Add it to the existing schema
    const { schema } = mongoose.model(stepKey)
    schema.add(schemaUpdate)
}

// Disabling no await because the await only gets called if an error is thrown
/* eslint-disable no-await-in-loop */
export const getAddedFields = async (
    session: ClientSession,
    oldFields: Field[],
    newFields: Field[]
) => {
    // Build up a list of al the new fields added
    const addedFields: Field[] = []
    for (let i = 0; i < newFields.length; ++i) {
        const requestField = newFields[i]

        if (requestField.key) {
            const existingField = getFieldByKey(oldFields, requestField.key)

            // If both fields are the same but fieldtypes are not the same
            if (existingField && !areFieldTypesSame(requestField, existingField)) {
                await abortAndError(session, `Cannot change the type of ${existingField.key}`)
            }

            // If this is a new field that we haven't seen yet, add it to the list of new fields
            const hasAddedField = addedFields.some(
                // the key of the requestField may be undefined if the field is new
                (f) => f.key === requestField.key
            )

            if (!existingField && !hasAddedField) {
                addedFields.push(requestField)
            }
        } else {
            // Add the field since a key doesn't exist for it
            addedFields.push(requestField)
        }
    }

    return addedFields
}
/* eslint-enable no-await-in-loop */

const areFieldTypesSame = (fieldA: Field, fieldB: Field) => {
    if (!fieldA || !fieldB) return false

    return fieldA.fieldType === fieldB.fieldType
}
