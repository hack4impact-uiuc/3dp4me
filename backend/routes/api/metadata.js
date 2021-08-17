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

const updateStepInTransation = async (stepBody, res, session) => {
    // Cannot find step
    if (!stepBody?.key) {
        await session.abortTransaction();
        throw `stepKey missing`;
    }

    const stepKey = stepBody.key;
    stepBody = removeAttributesFrom(stepBody, ['_id', '__v']);
    let stepToEdit = await models.Step.findOne({ key: stepKey }).session(
        session,
    );

    // Return if stepToEdit cannot be found
    if (!stepToEdit) {
        await session.abortTransaction();
        throw `No step with key, ${stepKey}`;
    }

    let addedFields = [];
    for (const requestField of stepBody.fields) {
        // If both fields are the same but fieldtypes are not the same
        const field = getFieldByKey(stepToEdit.fields, requestField.key);

        if (field && field.fieldType !== requestField.fieldType) {
            await session.abortTransaction();
            throw `Cannot change the type of ${stepKey}.${field.key}`;
        }

        if (
            !field &&
            !addedFields.some(
                (addedField) => addedField.key === requestField.key,
            )
        ) {
            addedFields.push(requestField);
        }
    }

    // Checks that fields were not deleted
    if (
        stepBody.fields.length - addedFields.length <
        stepToEdit.fields.length
    ) {
        await session.abortTransaction();
        throw `Cannot delete fields`;
    }

    const schema = await mongoose.model(stepKey).schema;
    const addedFieldsObject = {};

    addedFields.forEach((field) => {
        addedFieldsObject[field.key] = generateFieldSchema(field);
    });
    schema.add(addedFieldsObject);

    step = await models.Step.findOne({ key: stepKey }).session(session);
    _.assign(step, stepBody);
    await step.save({ session: session, validateBeforeSave: false });

    return step;
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
            const result = await mongoose.connection.transaction(
                async (session) => {
                    // Go through all of the step updates in the request body and apply them
                    for (step of req.body) {
                        const updatedStepModel = await updateStepInTransation(
                            step,
                            res,
                            session,
                        );
                        stepData.push(updatedStepModel);
                    }

                    // Go through the updated models and check validation
                    for (step of stepData) {
                        // Run synchronous tests
                        let error = step.validateSync();
                        if (error) {
                            await session.abortTransaction();
                            return await sendResponse(
                                res,
                                400,
                                `Validation error: ${error}`,
                            );
                        }

                        // Run async test manually
                        let isValid = await isUniqueStepNumber(
                            step.stepNumber,
                            step.key,
                            session,
                        );
                        if (!isValid) {
                            await session.abortTransaction();
                            return await sendResponse(
                                res,
                                400,
                                `Validation error: Does not have unique stepNumber`,
                            );
                        }
                    }
                },
            );

            console.log(result);
            await sendResponse(res, 200, 'Step(s) edited', stepData);
        } catch (error) {
            console.error(error);
            await sendResponse(res, 400, `Error occurred: ${error}`);
        }
    }),
);

// DELETE metadata/steps/:stepkey
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
