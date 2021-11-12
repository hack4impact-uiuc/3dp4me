const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const log = require('loglevel');

const { errorWrap } = require('../../utils');
const { models } = require('../../models');
const { requireAdmin } = require('../../middleware/authentication');
const { generateSchemaFromMetadata } = require('../../utils/initDb');
const { sendResponse } = require('../../utils/response');
const {
    updateStepsInTransaction,
    getReadableSteps,
} = require('../../utils/stepUtils');

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

/**
 * Updates many steps at a time. We need to process many steps at a time becuase -- for instance --
 * if we want to swap step order (i.e. step 5 becomes step 6 and vice versa), then there is a
 * moment of inconsistency where we have two step 5s or 6s. So all step updates are batched
 * through this endpoint which applies all the changes in a transaction and rolls back if the
 * end state is invalid.
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

            // The step data will be sent in the response in order to
            // update the frontend's step data. We are filtering out deleted fields
            // since they should not be sent to the frontend.
            for (let i = 0; i < stepData.length; i++) {
                const step = stepData[i];
                for (let j = 0; j < step.fields.length; j++) {
                    if (step.fields[j].isDeleted) {
                        step.fields.splice(j, 1);
                        j -= 1;
                    }
                }
            }

            await sendResponse(res, 200, 'Step(s) edited', stepData);
        } catch (error) {
            log.error(error);
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
