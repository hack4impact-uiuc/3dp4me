const _ = require('lodash');

const { removeAttributesFrom } = require('../middleware/requests');
const { models } = require('../models');
const { isUniqueStepNumber } = require('../models/Metadata');

const { isAdmin } = require('./aws/awsUsers');
const { addFieldsToSchema, getAddedFields } = require('./fieldUtils');
const { abortAndError } = require('./transactionUtils');
const { generateKeyWithoutCollision } = require('./keyUtils');

const stringToBoolean = (value) => {
    const trimmedValue = value.toString().trim().toLowerCase();
    return !(
        trimmedValue === 'false' ||
        trimmedValue === '0' ||
        trimmedValue === ''
    );
};

module.exports.getReadableSteps = async (req) => {
    let showHiddenFields = req.query.showHiddenFields ?? 'false';
    showHiddenFields = stringToBoolean(showHiddenFields);

    const userRole = req.user.roles.toString();

    const searchParams = [
        {
            $or: [{ $ne: ['$$field.isDeleted', true] }],
        },
    ]; // don't return any deleted fields

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

    const aggregation = [
        {
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
        },
    ];

    const data = await models.Step.aggregate(aggregation);

    return data;
};

/* eslint-disable no-restricted-syntax, no-await-in-loop */
/**
 * Performs an update on a step in a transaction session. It is expected that req.body
 * contains an array of step updates.
 * @param {Object} req The incoming request. Should be an array of steps.
 * @param {Object} session The session for the transaction.
 * @returns Returns the updated step array.
 */
module.exports.updateStepsInTransaction = async (req, session) => {
    const stepData = [];

    // Go through all of the step updates in the request body and apply them
    for (const step of req.body) {
        const updatedStepModel = await updateStepInTransation(step, session);
        stepData.push(updatedStepModel);
    }

    // Go through the updated models and check validation
    await validateSteps(stepData, session);
    return stepData;
};

const updateFieldNumbers = (goodFields, deletedFields) => {
    // We need to update the fieldNumber for each field in order to prevent duplicates.
    // In order to do this, we iterate through the deletedFields and strippedBody fields.
    // We store two pointers for both arrays, and we move them forward after updating the field
    // number for the field that it is pointing at. The fields in deletedFields get priority,
    // meaning they always keep the same field number.

    const updatedFields = _.cloneDeep(goodFields);

    let currFieldNumber = 0;
    let deletedFieldPointer = 0;
    let strippedFieldsPointer = 0;

    const numTotalFields = deletedFields.length + updatedFields.length;

    while (currFieldNumber < numTotalFields) {
        if (
            deletedFieldPointer < deletedFields.length &&
            currFieldNumber === deletedFields[deletedFieldPointer].fieldNumber
        ) {
            deletedFieldPointer += 1; // Skip over since deleted fields have priority
        } else {
            updatedFields[strippedFieldsPointer].fieldNumber = currFieldNumber;
            strippedFieldsPointer += 1;
        }
        currFieldNumber += 1; // Move onto the next field number to assign
    }

    return updatedFields;
};

const updateFieldKeys = (fields) => {
    let clonedFields = _.cloneDeep(fields);

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

const updateStepInTransation = async (stepBody, session) => {
    // Cannot find step
    if (!stepBody?.key) await abortAndError(session, 'stepKey missing');

    // Get the step to edit
    const stepKey = stepBody.key;
    const stepToEdit = await models.Step.findOne({ key: stepKey }).session(
        session,
    );

    // Abort if can't find step to edit
    if (!stepToEdit)
        await abortAndError(session, `No step with key, ${stepKey}`);

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
    if (numUnchangedFields < currentNumFields)
        await abortAndError(session, 'Cannot delete fields');

    // Update the schema
    addFieldsToSchema(stepKey, addedFields);

    // Update the field numbers in order to account for deleted fields
    strippedBody.fields = updateFieldNumbers(
        strippedBody.fields,
        deletedFields,
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
