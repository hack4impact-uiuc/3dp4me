const _ = require('lodash');

const { removeAttributesFrom } = require('../middleware/requests');
const { models } = require('../models');
const { isUniqueStepNumber } = require('../models/Metadata');

const { isAdmin } = require('./aws/awsUsers');
const { addFieldsToSchema, getAddedFields } = require('./fieldUtils');
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
        (a, b) => a.stepNumber - b.stepNumber,
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
        'stepNumber',
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
            && currElementNumber === parseInt(deletedElements[deletedElementPointer][numberKey], 10)
        ) {
            deletedElementPointer += 1; // Skip over since deleted fields have priority
        } else {
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
            // eslint-disable-next-line no-param-reassign
            stepBody.key = newKey;
            // Add the new key to the list of keys
            combinedKeys.push(newKey);
        }

        if (stepBody.fields) {
            // eslint-disable-next-line no-param-reassign
            stepBody.fields = updateFieldKeys(stepBody.fields);
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
    const addedFields = await getAddedFields(
        session,
        stepToEdit.fields,
        strippedBody.fields,
    );

    // Checks that fields were not deleted
    const deletedFields = getDeletedFields(stepToEdit.fields);

    const numDeletedFields = deletedFields.length;
    const numUnchangedFields = strippedBody.fields.length - addedFields.length;

    const currentNumFields = stepToEdit.fields.length - numDeletedFields;
    if (numUnchangedFields < currentNumFields) await abortAndError(session, 'Cannot delete fields');

    // Update the schema
    addFieldsToSchema(stepKey, addedFields);

    // Update the field numbers in order to account for deleted fields
    strippedBody.fields = updateElementNumbers(
        strippedBody.fields,
        deletedFields,
        'fieldNumber',
    );

    // Add deleted fields so they will be remain in the database.
    // They are added to the end in order to give easy access when
    // restoring them manually.
    for (let i = 0; i < deletedFields.length; i++) {
        strippedBody.fields.push(deletedFields[i]);
    }

    // Generate keys for the fields that do not have a key
    strippedBody.fields = updateFieldKeys(strippedBody.fields);

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
        (a, b) => a.fieldNumber - b.fieldNumber,
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
