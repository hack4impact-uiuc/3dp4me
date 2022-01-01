const _ = require('lodash');

const { removeAttributesFrom } = require('../middleware/requests');
const { models } = require('../models');
const { isUniqueStepNumber, FIELD_NUMBER_KEY, STEP_NUMBER_KEY } = require('../models/Metadata');

const { isAdmin } = require('./aws/awsUsers');
const { addFieldsToSchema, updateFieldsInSchema, getAddedFields } = require('./fieldUtils');
const { abortAndError } = require('./transactionUtils');
const { generateSchemaFromMetadata } = require('./initDb');
const { generateKeyWithoutCollision, checkNumOccurencesInList } = require('./keyUtils');

const stringToBoolean = (value) => {
    const trimmedValue = value.toString().trim().toLowerCase();
    return !(
        trimmedValue === 'false'
        || trimmedValue === '0'
        || trimmedValue === ''
    );
};

module.exports.getReadableSteps = async (req) => {
    let showHiddenFields = req.query.showHiddenFields ?? 'false';
    let showHiddenSteps = req.query.showHiddenSteps ?? 'false';
    showHiddenFields = stringToBoolean(showHiddenFields);
    showHiddenSteps = stringToBoolean(showHiddenSteps);

    const userRole = req.user.roles.toString();

    const searchParams = [
        {
            $or: [{ $ne: ['$$field.isDeleted', true] }],
        },
    ]; // Don't return any deleted fields

    // Don't return any deleted steps
    const aggregation = [{ $match: { isDeleted: { $ne: true } } }];

    // If not admin, then return limit what steps/fields can be returned using readableGroups
    if (!isAdmin(req.user)) {
        aggregation.push({
            $match: { $expr: { $in: [userRole, '$readableGroups'] } }, // limit returning steps that don't contain the user role
        });
        searchParams.push({
            $in: [userRole, '$$field.readableGroups'], // limit returning fields that don't contain the user role
        });
    }

    if (!showHiddenFields) {
        searchParams.push({
            $or: [{ $ne: ['$$field.isHidden', true] }],
        }); // limit returning fields that are hidden
    }

    if (!showHiddenSteps) {
        aggregation.push({ $match: { isHidden: { $ne: true } } });
    }

    aggregation.push({
        $addFields: {
            fields: {
                $filter: {
                    input: '$fields',
                    as: 'field',
                    cond: {
                        $and: searchParams,
                    },
                },
            },
        },
    });

    aggregation.push({
        $addFields: {
            fields2: {
                $map: {
                    input: '$fields',
                    as: 'f',
                    in: {
                        subFields: {
                            $filter: {
                                input: '$$f.subFields',
                                as: 'field',
                                cond: {
                                    $and: searchParams,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    const data = await models.Step.aggregate(aggregation);

    return data;
};

/* eslint-disable no-restricted-syntax, no-await-in-loop */
/**
 * Performs an update on a step in a transaction session. It is expected that req.body
 * contains an array of step updates.
 * @param {Object} An array of steps.
 * @param {Object} session The session for the transaction.
 * @returns Returns the updated step array.
 */
module.exports.updateStepsInTransaction = async (updatedSteps, session) => {
    const stepData = [];

    /* Steps in the database cannot have keys that are the same. If that is the
       case, then they have collided.
       Let's assume that none of the saved steps in the database don't have keys that collide.
       Then, we would only need to check new steps being created for key collision. */

    const currentStepsInDB = await models.Step.find({}).session(session);
    let stepsToNotChange = [];
    const requestStepKeys = updatedSteps.map((step) => step.key);

    // Build up a list of steps that were not included in the request or are deleted.
    // The stepNumbers of these steps won't be changed.
    for (let i = 0; i < currentStepsInDB.length; i++) {
        if (currentStepsInDB[i].isDeleted || !requestStepKeys.includes(currentStepsInDB[i].key)) {
            stepsToNotChange.push(currentStepsInDB[i]);
        }
    }

    stepsToNotChange = stepsToNotChange.sort(
        (a, b) => a[STEP_NUMBER_KEY] - b[STEP_NUMBER_KEY],
    );

    // Get a list of the key
    const stepsToNotChangeKeys = stepsToNotChange.map((step) => step.key);

    // Combine to create a list of all keys that will be used to check for.
    // key collision.
    const combinedKeys = requestStepKeys.concat(stepsToNotChangeKeys);

    /* We also need to update step field numbers before saving each step.
       This is because step field numbers were generated without considering
       deleted steps. */

    const requestSteps = updateElementNumbers(
        updatedSteps,
        stepsToNotChange,
        STEP_NUMBER_KEY,
    );

    // Go through all of the step updates in the request body and apply them
    for (let stepIdx = 0; stepIdx < requestSteps.length; stepIdx++) {
        // eslint-disable-next-line max-len
        const updatedStepModel = await updateStepInTransaction(requestSteps[stepIdx], session, combinedKeys);
        stepData.push(updatedStepModel);
    }

    // Go through the updated models and check validation
    await validateSteps(stepData, session);
    return stepData;
};

const updateElementNumbers = (goodElements, deletedElements, numberKey) => {
    // We need to update the fieldNumber for each field in order to prevent duplicates.
    // The same goes for updating the stepNumber for each step.
    // In order to do this, we iterate through the goodElements and deletedElements fields.
    // We store two pointers for both arrays, and we move them forward after updating the field
    // number for the field that it is pointing at. The elements in deletedElements get priority,
    // meaning they always keep the same field number.

    const updatedElements = _.cloneDeep(goodElements);

    let currElementNumber = 0;
    let deletedElementPointer = 0;
    let goodElementPointer = 0;

    const numTotalFields = deletedElements.length + updatedElements.length;

    while (currElementNumber < numTotalFields) {
        if (
            deletedElementPointer < deletedElements.length
            && currElementNumber === deletedElements[deletedElementPointer][numberKey]
        ) {
            deletedElementPointer += 1; // Skip over since deleted fields have priority
        } else if (goodElementPointer < updatedElements.length) {
            updatedElements[goodElementPointer][numberKey] = currElementNumber;
            goodElementPointer += 1;
        }
        currElementNumber += 1; // Move onto the next field number to assign
    }

    return updatedElements;
};

const updateFieldKeys = (fields) => {
    const clonedFields = _.cloneDeep(fields);

    const currentFieldKeys = clonedFields.map((field) => field.key ?? '');

    for (let i = 0; i < clonedFields.length; i++) {
        const currentField = clonedFields[i];
        const currentKey = currentField.key;
        if (typeof currentKey === 'undefined' || currentKey === null) {
            const generatedKey = generateKeyWithoutCollision(
                currentField.displayName.EN,
                currentFieldKeys,
            );
            currentField.key = generatedKey;
            currentFieldKeys.push(generatedKey);
        }
    }

    return clonedFields;
};

/**
 * A recursive function that updates a set of fields before being saved in the database.
 * @param {} savedFields   The fields that are currently saved in the database.
 * @param {} updatedFields The fields sent in the request.
 * @param {} stepKey       The key of the step that these fields belong to.
 * @param {} session       MongoDB Session.
 * @param {} level         Level of recursion. 0 is the first level.
 * @returns A boolean indicating if new fields were sent in the request.
 */
const updateFieldInTransaction = async (savedFields, updatedFields, stepKey, session, level) => {
    const addedFields = await getAddedFields(
        session,
        savedFields,
        updatedFields,
    );

    // Checks that fields were not deleted
    const deletedFields = getDeletedFields(savedFields);

    const numDeletedFields = deletedFields.length;
    const numUnchangedFields = updatedFields.length - addedFields.length;

    const currentNumFields = savedFields.length - numDeletedFields;
    if (numUnchangedFields < currentNumFields) await abortAndError(session, 'Cannot delete fields');

    // Update the field numbers in order to account for deleted fields
    // eslint-disable-next-line no-param-reassign
    updatedFields = updateElementNumbers(
        updatedFields,
        deletedFields,
        FIELD_NUMBER_KEY,
    );

    // Add deleted fields so they will be remain in the database.
    // They are added to the end in order to give easy access when
    // restoring them manually.
    for (let i = 0; i < deletedFields.length; i++) {
        updatedFields.push(deletedFields[i]);
    }

    // Generate keys for the fields that do not have a key
    // eslint-disable-next-line no-param-reassign
    updatedFields = updateFieldKeys(updatedFields);

    if (level === 0) {
        // Update the schema with new fields
        addFieldsToSchema(stepKey, addedFields);
    }

    const fieldsToUpdateInSchema = [];
    let subFieldWasAdded = false;

    // Recursively call updateFieldInTransaction() on each field's subfields
    updatedFields.forEach(async (updatedField) => {
        if (updatedField.subFields) {
            if (updatedField.subFields.length > 0) {
                console.log(`${updatedField.key} has subFields`);
            }
            const updatedFieldKey = updatedField.key;
            const savedFieldIndex = getFieldIndexGivenKey(savedFields, updatedFieldKey);

            let newSavedFields = [];
            if (savedFieldIndex > 0) {
                newSavedFields = savedFields[savedFieldIndex].subFields || [];
            }
            // eslint-disable-next-line max-len
            const didAddFields = await updateFieldInTransaction(newSavedFields, updatedField.subFields, stepKey, session, level + 1);
            subFieldWasAdded = subFieldWasAdded || didAddFields;
            // Build up a list of field's whose schema need to be updated
            if (didAddFields && level === 0) {
                console.log(`Need to update ${updatedField.key} schema`);
                fieldsToUpdateInSchema.push(updatedField);
            }
        }
    });

    // Update schema
    if (fieldsToUpdateInSchema.length > 0) {
        updateFieldsInSchema(stepKey, fieldsToUpdateInSchema);
    }

    // console.log(`level: ${level}`);
    // console.log(`subField: ${subFieldWasAdded}`);
    // console.log(`addedFields: ${addedFields.length > 0}`);

    // Returns true if a field was added at this level
    // or a sub field was added to one of the fields at this level
    return subFieldWasAdded || addedFields.length > 0;
};

// Returns the index for a step given its key
const getFieldIndexGivenKey = (fields, key) => {
    if (!fields) return -1;
    return fields.findIndex((field) => field.key === key);
};

/* eslint-enable no-restricted-syntax, no-await-in-loop */

const updateStepInTransaction = async (stepBody, session, combinedKeys) => {
    // Cannot find step
    if (!stepBody?.key) await abortAndError(session, 'stepKey missing');

    // Get the step to edit
    const stepKey = stepBody.key;
    const stepToEdit = await models.Step.findOne({ key: stepKey }).session(
        session,
    );

    // Treat a field as new if it doesn't show up in the database
    // or it is marked as deleted in the database. This based on the assumption
    // that updateStepInTransaction won't be called on deleted fields.

    if (!stepToEdit || stepToEdit.isDeleted) {
        // Make sure the key for this new step won't collide with any deleted steps
        // Using the value 2 since the key should be in combinedKeys at least once.
        if (checkNumOccurencesInList(stepBody.key, combinedKeys) >= 2) {
            const newKey = generateKeyWithoutCollision(stepBody.displayName.EN || '', combinedKeys);
            const oldKey = stepBody.key;
            // eslint-disable-next-line no-param-reassign
            stepBody.key = newKey;
            // Add the new key to the list of keys
            combinedKeys.push(newKey);
            // Remove the old key
            combinedKeys.splice(combinedKeys.indexOf(oldKey), 1);
        }

        if (stepBody.fields) {
            await updateFieldInTransaction([], stepBody.fields, stepBody.key, session, 0);
        } else {
            // eslint-disable-next-line no-param-reassign
            stepBody.fields = [];
        }

        generateSchemaFromMetadata(stepBody);

        const newStep = new models.Step(stepBody);
        await newStep.save({ session, validateBeforeSave: false });
        return newStep;
    }

    // Build up a list of all the new fields added
    const strippedBody = removeAttributesFrom(stepBody, ['_id', '__v']);

    // Recursive updated on the fields
    await updateFieldInTransaction(stepToEdit.fields, strippedBody.fields, stepKey, session, 0);

    // Finally, update the metadata for this step
    const step = await models.Step.findOne({ key: stepKey }).session(session);
    _.assign(step, strippedBody);

    await step.save({ session, validateBeforeSave: false });

    // Return the model so that we can do validation later
    return step;
};

const getDeletedFields = (fields) => {
    const deletedFields = [];

    fields.forEach((field) => {
        if (field.isDeleted) {
            deletedFields.push(field);
        }
    });

    // Returns the deleted fields in ascending order of field number
    const sortedFields = deletedFields.sort(
        (a, b) => a[FIELD_NUMBER_KEY] - b[FIELD_NUMBER_KEY],
    );

    return sortedFields;
};

const validateSteps = async (steps, session) => {
    const validations = steps.map(async (step) => validateStep(step, session));
    await Promise.all(validations);
};

const validateStep = async (step, session) => {
    // Run synchronous tests
    const error = step.validateSync();
    if (error) {
        await session.abortTransaction();
        throw `Validation error: ${error}`;
    }

    // Run async test manually
    const isValid = await isUniqueStepNumber(
        step.stepNumber,
        step.key,
        session,
    );
    if (!isValid) {
        await session.abortTransaction();
        throw `Validation error: ${step.key} does not have unique stepNumber`;
    }
};

// Filters out deleted steps and fields from stepData
module.exports.filterOutDeletedSteps = (stepData) => {
    for (let i = 0; i < stepData.length; i++) {
        if (stepData[i].isDeleted) {
            stepData.splice(i, 1);
            i -= 1;
        } else {
            filterOutDeletedFields(stepData[i].fields);
        }
    }
};

const filterOutDeletedFields = (fields) => {
    for (let i = 0; i < fields.length; i++) {
        if (fields[i].isDeleted) {
            fields.splice(i, 1);
            i -= 1;
        } else if (fields[i].subFields) {
            filterOutDeletedFields(fields[i].subFields);
        }
    }
};
