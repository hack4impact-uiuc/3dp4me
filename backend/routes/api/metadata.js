const express = require('express');
const _ = require('lodash');
const router = express.Router();
const { errorWrap } = require('../../utils');
const { getFieldByKey } = require('../../utils/step-utils');
const { models } = require('../../models');
const { removeAttributesFrom } = require('../../middleware/requests');
const { isUniqueStepNumber } = require('../../models/Metadata');
const mongoose = require('mongoose');
const { requireAdmin } = require('../../middleware/authentication');
const { isAdmin } = require('../../utils/aws/aws-user');
const {
    generateSchemaFromMetadata,
    generateFieldSchema,
} = require('../../utils/init-db');
const { sendResponse } = require('../../utils/response');

const getReadableSteps = async (req) => {
    if (isAdmin(req.user)) return await models.Step.find({});

    const roles = [req.user.roles.toString()];
    const metaData = await models.Step.find({
        readableGroups: { $in: [req.user.roles.toString()] },
    });

    // Iterate over fields and remove fields that do not have matching permissions
    metaData.map((step) => {
        step.fields = step.fields.filter((field) => {
            return field.readableGroups.some((role) => roles.includes(role));
        });
    });

    return metaData;
};

/**
 * Gets the metadata for a step. This describes the fields contained in the steps.
 * If a user isn't allowed to view step, it isn't returned to them.
 */
router.get(
    '/steps',
    errorWrap(async (req, res) => {
        const metaData = await getReadableSteps(req);

        if (!metaData) {
            await sendResponse(res, 500, 'Could not find any steps');
        } else {
            await sendResponse(res, 200, 'Steps found', metaData);
        }
    }),
);

/**
 * Creates a new step. If the step is formatted invalid, we roll back the changes
 * and return 400.
 */
router.post(
    '/steps',
    requireAdmin,
    errorWrap(async (req, res) => {
        const step = req.body;
        const newStep = new models.Step(step);

        try {
            await mongoose.connection.transaction(async (session) => {
                await newStep.save({ session });
                generateSchemaFromMetadata(step);
            });

            await sendResponse(res, 200, 'Step created', newStep);
        } catch (error) {
            await sendResponse(res, 400, `Could not add step: ${error}`);
        }
    }),
);

const abortAndError = async (transaction, error) => {
    await transaction.abortTransaction();
    throw error;
};

const areFieldTypesSame = (fieldA, fieldB) => {
    if (!fieldA || !fieldB) return false;

    return fieldA.fieldType === fieldB.fieldType;
};

const updateStepInTransation = async (stepBody, session) => {
    // Cannot find step
    if (!stepBody?.key) await abortAndError(session, `stepKey missing`);

    // Get the step to edit
    const stepKey = stepBody.key;
    let stepToEdit = await models.Step.findOne({ key: stepKey }).session(
        session,
    );

    // Abort if can't find step to edit
    if (!stepToEdit)
        await abortAndError(session, `No step with key, ${stepKey}`);

    // Build up a list of al the new fields added
    let addedFields = [];
    const strippedBody = removeAttributesFrom(stepBody, ['_id', '__v']);
    for (const requestField of strippedBody.fields) {
        const existingField = getFieldByKey(
            stepToEdit.fields,
            requestField.key,
        );

        // If both fields are the same but fieldtypes are not the same
        if (existingField && !areFieldTypesSame(requestField, existingField))
            await abortAndError(
                session,
                `Cannot change the type of ${stepKey}.${existingField.key}`,
            );

        // If this is a new field that we haven't seen yet, add it to the list of new fields
        const hasAddedField = addedFields.some(
            (f) => f.key === requestField.key,
        );
        if (!existingField && !hasAddedField) addedFields.push(requestField);
    }

    // Checks that fields were not deleted
    const numUnchangedFields = strippedBody.fields.length - addedFields.length;
    const currentNumFields = stepToEdit.fields.length;
    if (numUnchangedFields < currentNumFields)
        await abortAndError(session, `Cannot delete fields`);

    // Update the schema
    const schema = await mongoose.model(stepKey).schema;
    const schemaUpdate = {};
    addedFields.forEach((field) => {
        schemaUpdate[field.key] = generateFieldSchema(field);
    });
    schema.add(schemaUpdate);

    // Finally, update the metadata for this step
    step = await models.Step.findOne({ key: stepKey }).session(session);
    _.assign(step, strippedBody);
    await step.save({ session: session, validateBeforeSave: false });

    // Return the model so that we can do validation later
    return step;
};

const updateStepsInTransaction = async (req, session) => {
    let stepData = [];

    // Go through all of the step updates in the request body and apply them
    for (step of req.body) {
        const updatedStepModel = await updateStepInTransation(step, session);
        stepData.push(updatedStepModel);
    }

    // Go through the updated models and check validation
    await validateSteps(stepData, session);
    return stepData;
};

const validateSteps = async (steps, session) => {
    for (step of steps) {
        await validateStep(step, session);
    }
};

const validateStep = async (step, session) => {
    // Run synchronous tests
    let error = step.validateSync();
    if (error) {
        await session.abortTransaction();
        throw `Validation error: ${error}`;
    }

    // Run async test manually
    let isValid = await isUniqueStepNumber(step.stepNumber, step.key, session);
    if (!isValid) {
        await session.abortTransaction();
        throw `Validation error: ${step.key} does not have unique stepNumber`;
    }
};

/**
 * Updates many steps at a time. We need to process many steps at a time becuase -- for instance --
 * if we want to swap step order (i.e. step 5 becomes step 6 and vice versa), then there is a moment
 * of inconsistency where we have two step 5s or 6s. So all step updates are batched through this endpoint
 * which applies all the changes in a transaction and rolls back if the end state is invalid.
 */
router.put(
    '/steps/',
    requireAdmin,
    errorWrap(async (req, res) => {
        try {
            let stepData = [];
            await mongoose.connection.transaction(async (session) => {
                stepData = await updateStepsInTransaction(req, session);
            });

            await sendResponse(res, 200, 'Step(s) edited', stepData);
        } catch (error) {
            console.error(error);
            await sendResponse(res, 400, `Error occurred: ${error}`);
        }
    }),
);

/**
 * Deletes a step
 */
router.delete(
    '/steps/:stepkey',
    requireAdmin,
    errorWrap(async (req, res) => {
        const { stepkey } = req.params;
        const step = await models.Step.deleteOne({ key: stepkey });

        if (step.deletedCount === 0)
            await sendResponse(res, 404, 'Step not found');
        else await sendResponse(res, 201, 'Step deleted');
    }),
);

module.exports = router;
