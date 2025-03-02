import { Field, ReservedStep, Step } from '@3dp4me/types'
import _ from 'lodash'
import { ClientSession, HydratedDocument, PipelineStage } from 'mongoose'

import { removeAttributesFrom } from '../middleware/requests'
import { AuthenticatedRequest } from '../middleware/types'
import {
    FIELD_NUMBER_KEY,
    isUniqueStepNumber,
    STEP_NUMBER_KEY,
    StepModel,
} from '../models/Metadata'
import { isAdmin } from './aws/awsUsers'
import { addFieldsToSchema, getAddedFields } from './fieldUtils'
import { generateSchemaFromMetadata } from './initDb'
import { checkNumOccurencesInList, generateKeyWithoutCollision } from './keyUtils'
import { queryParamToBool } from './request'
import { abortAndError } from './transactionUtils'

export const getReadableSteps = async (req: AuthenticatedRequest): Promise<Step[]> => {
    const shouldShowHiddenFields = queryParamToBool(req.query.showHiddenFields ?? 'false')
    const shouldShowHiddenSteps = queryParamToBool(req.query.showHiddenSteps ?? 'false')
    const shouldShowReservedSteps = queryParamToBool(req.query.showReservedSteps ?? 'false')

    const userRole = req.user.roles.toString()

    // TODO: Give this a type
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const fieldSearchParams: any[] = [
        {
            $or: [{ $ne: ['$$field.isDeleted', true] }],
        },
    ] // Don't return any deleted fields
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const aggregation: PipelineStage[] = [
        // Don't return any deleted steps
        { $match: { isDeleted: { $ne: true } } },
    ]

    // If not admin, then return limit what steps/fields can be returned using readableGroups
    if (!isAdmin(req.user)) {
        aggregation.push({
            $match: { $expr: { $in: [userRole, '$readableGroups'] } }, // limit returning steps that don't contain the user role
        })
        fieldSearchParams.push({
            $in: [userRole, '$$field.readableGroups'], // limit returning fields that don't contain the user role
        })
    }

    if (!shouldShowHiddenFields) {
        fieldSearchParams.push({
            $or: [{ $ne: ['$$field.isHidden', true] }],
        }) // limit returning fields that are hidden
    }

    // Don't return reserved steps
    if (!shouldShowReservedSteps) {
        aggregation.push({ $match: { key: { $nin: Object.values(ReservedStep) } } })
    }

    // Limit returning steps that are hidden
    if (!shouldShowHiddenSteps) {
        aggregation.push({ $match: { isHidden: { $ne: true } } })
    }

    // Adds operation for filtering out fields to the aggregation.
    aggregation.push({
        $addFields: {
            fields: {
                $filter: {
                    input: '$fields',
                    as: 'field',
                    cond: {
                        $and: fieldSearchParams,
                    },
                },
            },
        },
    })

    /*
        Adds operation for filtering out subfields in fields to the aggregation.
        Sources:
        https://stackoverflow.com/questions/19431773/include-all-existing-fields-and-add-new-fields-to-document
        https://stackoverflow.com/questions/44999893/how-do-i-add-properties-to-subdocument-array-in-aggregation-make-map-like-addf
    */

    aggregation.push({
        $addFields: {
            fields: {
                $map: {
                    // Perform map on the fields
                    input: '$fields', // Input is the field array
                    as: 'f', // Single element in the field array
                    in: {
                        // Merges the filtered subFields with the rest of the field data
                        $mergeObjects: [
                            '$$f',
                            {
                                subFields: {
                                    $filter: {
                                        input: '$$f.subFields',
                                        as: 'field',
                                        cond: {
                                            $and: fieldSearchParams, // Same field filter conditions
                                        },
                                    },
                                },
                            },
                        ],
                    },
                },
            },
        },
    })

    const data = await StepModel.aggregate(aggregation)
    return data
}

/* eslint-disable no-restricted-syntax, no-await-in-loop */
/**
 * Performs an update on a step in a transaction session. It is expected that req.body
 * contains an array of step updates.
 * @param {Object} An array of steps.
 * @param {Object} session The session for the transaction.
 * @returns Returns the updated step array.
 */
export const updateStepsInTransaction = async (updatedSteps: Step[], session: ClientSession) => {
    const stepData: HydratedDocument<Step>[] = []

    /* Steps in the database cannot have keys that are the same. If that is the
       case, then they have collided.
       Let's assume that none of the saved steps in the database don't have keys that collide.
       Then, we would only need to check new steps being created for key collision. */

    const currentStepsInDB = await StepModel.find({}).session(session)
    let stepsToNotChange: Step[] = []
    const requestStepKeys = updatedSteps.map((step) => step.key)

    // Build up a list of steps that were not included in the request or are deleted.
    // The stepNumbers of these steps won't be changed.
    for (let i = 0; i < currentStepsInDB.length; i++) {
        if (currentStepsInDB[i].isDeleted || !requestStepKeys.includes(currentStepsInDB[i].key)) {
            stepsToNotChange.push(currentStepsInDB[i])
        }
    }

    stepsToNotChange = stepsToNotChange.sort((a, b) => a[STEP_NUMBER_KEY] - b[STEP_NUMBER_KEY])

    // Get a list of the key
    const stepsToNotChangeKeys = stepsToNotChange.map((step) => step.key)

    // Combine to create a list of all keys that will be used to check for.
    // key collision.
    const combinedKeys = requestStepKeys.concat(stepsToNotChangeKeys)

    /* We also need to update step field numbers before saving each step.
       This is because step field numbers were generated without considering
       deleted steps. */

    const requestSteps = updateElementNumbers(updatedSteps, stepsToNotChange, STEP_NUMBER_KEY)

    // Go through all of the step updates in the request body and apply them
    for (let stepIdx = 0; stepIdx < requestSteps.length; stepIdx++) {
        // eslint-disable-next-line max-len
        const updatedStepModel = await updateStepInTransaction(
            requestSteps[stepIdx],
            session,
            combinedKeys
        )
        stepData.push(updatedStepModel)
    }

    // Go through the updated models and check validation
    await validateSteps(stepData, session)
    return stepData
}

// Elemnts is an
const updateElementNumbers = <T extends Step | Field, K extends keyof T>(
    goodElements: T[],
    deletedElements: T[],
    numberKey: K
) => {
    // We need to update the fieldNumber for each field in order to prevent duplicates.
    // The same goes for updating the stepNumber for each step.
    // In order to do this, we iterate through the goodElements and deletedElements fields.
    // We store two pointers for both arrays, and we move them forward after updating the field
    // number for the field that it is pointing at. The elements in deletedElements get priority,
    // meaning they always keep the same field number.

    const updatedElements = _.cloneDeep(goodElements)

    let currElementNumber = 0
    let deletedElementPointer = 0
    let goodElementPointer = 0

    const numTotalFields = deletedElements.length + updatedElements.length

    while (currElementNumber < numTotalFields) {
        if (
            deletedElementPointer < deletedElements.length &&
            currElementNumber === deletedElements[deletedElementPointer][numberKey]
        ) {
            deletedElementPointer += 1 // Skip over since deleted fields have priority
        } else if (goodElementPointer < updatedElements.length) {
            // TODO: Give better typings
            // @ts-expect-error TODO: Fix this
            updatedElements[goodElementPointer][numberKey] = currElementNumber
            goodElementPointer += 1
        }
        currElementNumber += 1 // Move onto the next field number to assign
    }

    return updatedElements
}

const updateFieldKeys = (fields: Field[]) => {
    const clonedFields = _.cloneDeep(fields)
    const currentFieldKeys = clonedFields.map((field) => field.key ?? '')

    for (let i = 0; i < clonedFields.length; i++) {
        const currentField = clonedFields[i]
        const currentKey = currentField.key
        if (!currentKey) {
            const generatedKey = generateKeyWithoutCollision(
                currentField.displayName.EN,
                currentFieldKeys
            )
            currentField.key = generatedKey
            currentFieldKeys.push(generatedKey)
        }
    }

    return clonedFields
}

/**
 * A recursive function that updates a set of fields before being saved in the database.
 * @param {} fieldsInDB   The fields that are currently saved in the database.
 * @param {} fieldsFromRequest The fields sent in the request.
 * @param {} stepKey       The key of the step that these fields belong to.
 * @param {} session       MongoDB Session.
 * @param {} level         Level of recursion. 0 is the first level.
 * @returns A boolean indicating if new fields were sent in the request.
 */
const updateFieldInTransaction = async (
    fieldsInDB: Field[],
    fieldsFromRequest: Field[],
    stepKey: string,
    session: ClientSession,
    level: number
) => {
    const savedFields = _.cloneDeep(fieldsInDB)
    let updatedFields = _.cloneDeep(fieldsFromRequest)

    const addedFields = await getAddedFields(session, savedFields, updatedFields)

    // Checks that fields were not deleted
    const deletedFields = getDeletedFields(savedFields)

    const numDeletedFields = deletedFields.length
    const numUnchangedFields = updatedFields.length - addedFields.length

    const currentNumFields = savedFields.length - numDeletedFields
    if (numUnchangedFields < currentNumFields)
        await abortAndError(session, new Error('Cannot delete fields'))

    // Update the field numbers in order to account for deleted fields
    // eslint-disable-next-line no-param-reassign
    updatedFields = updateElementNumbers(updatedFields, deletedFields, FIELD_NUMBER_KEY)

    // Add deleted fields so they will be remain in the database.
    // They are added to the end in order to give easy access when
    // restoring them manually.
    for (let i = 0; i < deletedFields.length; i++) {
        updatedFields.push(deletedFields[i])
    }

    // Generate keys for the fields that do not have a key
    // eslint-disable-next-line no-param-reassign
    updatedFields = updateFieldKeys(updatedFields)

    if (level === 0) {
        // Update the schema with new fields
        const addedFieldsWithKeys = await getAddedFields(session, savedFields, updatedFields)
        addFieldsToSchema(stepKey, addedFieldsWithKeys)
    }

    const fieldsToUpdateInSchema: Field[] = []
    let subFieldWasAdded = false

    // Recursively call updateFieldInTransaction() on each field's subfields
    const subFieldUpdateArray = updatedFields.map(async (updatedField, updatedFieldIndex) => {
        if (updatedField.subFields) {
            const updatedFieldKey = updatedField.key
            const savedFieldIndex = getFieldIndexGivenKey(savedFields, updatedFieldKey)

            let newSavedFields: Field[] = []
            if (savedFieldIndex > 0) {
                newSavedFields = savedFields[savedFieldIndex].subFields || []
            }

            // eslint-disable-next-line max-len
            const updateFieldResponse = await updateFieldInTransaction(
                newSavedFields,
                updatedField.subFields,
                stepKey,
                session,
                level + 1
            )
            const { didAddFields } = updateFieldResponse

            updatedFields[updatedFieldIndex].subFields = updateFieldResponse.updatedFields
            subFieldWasAdded = subFieldWasAdded || didAddFields
            // Build up a list of field's whose schema need to be updated
            if (didAddFields && level === 0) {
                fieldsToUpdateInSchema.push(updatedField)
            }
            return true
        }
        return false
    })

    await Promise.all(subFieldUpdateArray)

    // Update schema
    if (fieldsToUpdateInSchema.length > 0) {
        addFieldsToSchema(stepKey, fieldsToUpdateInSchema)
    }

    // Along with other data, return true if a field was added at this level
    // or a sub field was added to one of the fields at this level
    return {
        updatedFields,
        didAddFields: subFieldWasAdded || addedFields.length > 0,
    }
}

// Returns the index for a step given its key
const getFieldIndexGivenKey = (fields: Field[], key: string) => {
    if (!fields) return -1
    return fields.findIndex((field) => field.key === key)
}

/* eslint-enable no-restricted-syntax, no-await-in-loop */

const updateStepInTransaction = async (
    stepBody: Step,
    session: ClientSession,
    combinedKeys: string[]
): Promise<HydratedDocument<Step>> => {
    // Cannot find step
    if (!stepBody?.key) await abortAndError(session, 'stepKey missing')

    /*  Get the step to edit.
        .lean() is used to return POJO (Plain Old JavaScript Object)
        instead of MongoDB document.
    */
    const stepKey = stepBody.key
    const stepToEdit = await StepModel.findOne({ key: stepKey }).session(session).lean()

    // Treat a field as new if it doesn't show up in the database
    // or it is marked as deleted in the database. This based on the assumption
    // that updateStepInTransaction won't be called on deleted fields.

    if (!stepToEdit || stepToEdit.isDeleted) {
        // Make sure the key for this new step won't collide with any deleted steps
        // Using the value 2 since the key should be in combinedKeys at least once.
        if (checkNumOccurencesInList(stepBody.key, combinedKeys) >= 2) {
            const newKey = generateKeyWithoutCollision(stepBody.displayName.EN || '', combinedKeys)
            const oldKey = stepBody.key
            // eslint-disable-next-line no-param-reassign
            stepBody.key = newKey
            // Add the new key to the list of keys
            combinedKeys.push(newKey)
            // Remove the old key
            combinedKeys.splice(combinedKeys.indexOf(oldKey), 1)
        }

        if (stepBody.fields) {
            generateSchemaFromMetadata(stepBody)
            // eslint-disable-next-line max-len
            const { updatedFields } = await updateFieldInTransaction(
                [],
                stepBody.fields,
                stepBody.key,
                session,
                0
            )
            // eslint-disable-next-line no-param-reassign
            stepBody.fields = updatedFields
        } else {
            // eslint-disable-next-line no-param-reassign
            stepBody.fields = []
            generateSchemaFromMetadata(stepBody)
        }
        const newStep = new StepModel(stepBody)
        await newStep.save({ session, validateBeforeSave: false })
        return newStep
    }

    // TODO: Type
    // Build up a list of all the new fields added
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const strippedBody = removeAttributesFrom(stepBody, ['_id', '__v'] as any) as Step

    // Recursive update the field's numbers and keys
    // while making sure deleted fields are properly handled.
    // eslint-disable-next-line max-len
    const { updatedFields } = await updateFieldInTransaction(
        stepToEdit.fields as Field[],
        strippedBody.fields as Field[],
        stepKey,
        session,
        0
    )
    strippedBody.fields = updatedFields

    // Finally, update the metadata for this step
    const step = await StepModel.findOne({ key: stepKey }).session(session)
    if (!step) {
        return abortAndError(session, 'Step not found on final update')
    }

    _.assign(step, strippedBody)
    await step.save({ session, validateBeforeSave: false })

    // Return the model so that we can do validation later
    return step
}

const getDeletedFields = (fields: Field[]) => {
    const deletedFields: Field[] = []

    fields.forEach((field) => {
        if (field.isDeleted) {
            deletedFields.push(field)
        }
    })

    // Returns the deleted fields in ascending order of field number
    const sortedFields = deletedFields.sort((a, b) => a[FIELD_NUMBER_KEY] - b[FIELD_NUMBER_KEY])

    return sortedFields
}

const validateSteps = async (steps: HydratedDocument<Step>[], session: ClientSession) => {
    const validations = steps.map(async (step) => validateStep(step, session))
    await Promise.all(validations)
}

const validateStep = async (step: HydratedDocument<Step>, session: ClientSession) => {
    // Run synchronous tests
    const error = step.validateSync()
    if (error) {
        await session.abortTransaction()
        throw new Error(`Validation error: ${error}`)
    }

    // Run async test manually
    const isValid = await isUniqueStepNumber(step.stepNumber, step.key, session)
    if (!isValid) {
        await session.abortTransaction()
        throw new Error(`Validation error: ${step.key} does not have unique stepNumber`)
    }
}

// Filters out deleted steps and fields from stepData
export const filterOutDeletedSteps = (stepData: Step[]) => {
    for (let i = 0; i < stepData.length; i++) {
        if (stepData[i].isDeleted) {
            stepData.splice(i, 1)
            i -= 1
        } else {
            filterOutDeletedFields(stepData[i].fields)
        }
    }
}

const filterOutDeletedFields = (fields: Field[]) => {
    for (let i = 0; i < fields.length; i++) {
        if (fields[i].isDeleted) {
            fields.splice(i, 1)
            i -= 1
        } else if (fields[i].subFields) {
            filterOutDeletedFields(fields[i].subFields)
        }
    }
}