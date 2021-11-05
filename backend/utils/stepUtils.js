const _ = require('lodash');

const { removeAttributesFrom } = require('../middleware/requests');
const { models } = require('../models');
const { isUniqueStepNumber } = require('../models/Metadata');

const { isAdmin } = require('./aws/awsUsers');
const { addFieldsToSchema, getAddedFields } = require('./fieldUtils');
const { abortAndError } = require('./transactionUtils');

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
    showHiddenFields = stringToBoolean(showHiddenFields);

    const userRole = req.user.roles.toString();

    const searchParams = [{ $eq: ['$$field.isDeleted', false] }];

    // If admin, then return all steps and fields
    if (!isAdmin(req.user)) {
        searchParams.push({
            $in: [userRole, '$readableGroups'],
        });
        searchParams.push({
            $in: [userRole, '$$field.readableGroups'],
        });
    }

    // If we are not returning hidden fields
    if (!showHiddenFields) {
        searchParams.push({ $eq: ['$$field.isHidden', false] });
    }

    const data = await models.Step.aggregate([
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
    ]);

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
    if (!stepToEdit) await abortAndError(session, `No step with key, ${stepKey}`);

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

    // Add deleted fields so they will be remain in the database
    for (let i = 0; i < deletedFields.length; i++) {
        strippedBody.fields.push(deletedFields[i]);
    }

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

    return deletedFields;
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
