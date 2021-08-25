const _ = require('lodash');

const { removeAttributesFrom } = require('../middleware/requests');
const { models } = require('../models');
const { isUniqueStepNumber } = require('../models/Metadata');

const { isAdmin } = require('./aws/awsUsers');
const { addFieldsToSchema, getAddedFields } = require('./fieldUtils');
const { abortAndError } = require('./transactionUtils');

module.exports.getReadableSteps = async (req) => {
    if (isAdmin(req.user)) return models.Step.find({});

    const roles = [req.user.roles.toString()];
    const metaData = await models.Step.find({
        readableGroups: { $in: [req.user.roles.toString()] },
    });

    // Iterate over fields and remove fields that do not have matching permissions
    for (let i = 0; i < metaData.length; ++i) {
        metaData[i].fields = metaData[i].fields.filter((field) => {
            const hasPerms = field.readableGroups.some((role) =>
                roles.includes(role),
            );
            return hasPerms;
        });
    }

    return metaData;
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
    if (!stepToEdit)
        await abortAndError(session, `No step with key, ${stepKey}`);

    // Build up a list of al the new fields added
    const strippedBody = removeAttributesFrom(stepBody, ['_id', '__v']);
    const addedFields = await getAddedFields(
        session,
        stepToEdit.fields,
        strippedBody.fields,
    );

    // Checks that fields were not deleted
    const numUnchangedFields = strippedBody.fields.length - addedFields.length;
    const currentNumFields = stepToEdit.fields.length;
    if (numUnchangedFields < currentNumFields)
        await abortAndError(session, 'Cannot delete fields');

    // Update the schema
    addFieldsToSchema(stepKey, addedFields);

    // Finally, update the metadata for this step
    const step = await models.Step.findOne({ key: stepKey }).session(session);
    _.assign(step, strippedBody);
    await step.save({ session, validateBeforeSave: false });

    // Return the model so that we can do validation later
    return step;
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
