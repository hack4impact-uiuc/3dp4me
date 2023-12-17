import { Router, Request, Response } from 'express';

import mongoose = require('mongoose');
import log = require('loglevel');

import { requireAdmin } from '../../middleware/authentication';
import { sendResponse } from '../../utils/response';
import {
    updateStepsInTransaction,
    getReadableSteps,
    filterOutDeletedSteps,
} from '../../utils/stepUtils';
import { reinitModels } from '../../utils/initDb';
import errorWrap from '../../utils/errorWrap';
import { AuthenticatedRequest } from '../../middleware/types';
import { Step, StepModel } from '../../models/Metadata';

export const router = Router();

// TODO: Type middleware better

/**
 * Gets the metadata for a step. This describes the fields contained in the steps.
 * If a user isn't allowed to view step, it isn't returned to them.
 */
router.get(
    '/steps',
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
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
    requireAdmin as any,
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        try {
            const stepToCreate = req.body;
            let newStep;

            await mongoose.connection.transaction(async (session) => {
                newStep = await updateStepsInTransaction(
                    [stepToCreate],
                    session,
                );
            });

            await reinitModels();
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
    requireAdmin as any,
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        try {
            let stepData: Step[] = [];
            await mongoose.connection.transaction(async (session) => {
                stepData = await updateStepsInTransaction(req.body, session);
            });

            await reinitModels();

            // The step data will be sent in the response in order to
            // update the frontend's step data. We are filtering out deleted fields
            // AND deleted steps since they should not be sent to the frontend.
            filterOutDeletedSteps(stepData);

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
    requireAdmin as any,
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        const { stepkey } = req.params;
        const step = await StepModel.deleteOne({ key: stepkey });

        if (step.deletedCount === 0)
            await sendResponse(res, 404, 'Step not found');
        else await sendResponse(res, 201, 'Step deleted');
    }),
);

module.exports = router;
