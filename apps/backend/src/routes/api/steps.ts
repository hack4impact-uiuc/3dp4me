import { PatientModel } from "../../models/Patient";
import { AuthenticatedRequest } from "../../middleware/types";
import { HydratedDocument } from 'mongoose';

import express, { Response } from 'express';
import mongoose from 'mongoose';
import {
    sendResponse,
    getDataFromModelWithPaginationAndSearch,
} from '../../utils/response';
import errorWrap from "../../utils/errorWrap";
import { StepModel } from "../../models/Metadata";
import { Patient, PatientStatus } from "@3dp4me/types";

export const router = express.Router();

/**
 * Returns basic information for all patients that are active in
 * the specified step.
 *
 *
 */
router.get(
    '/:stepKey',
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        const { stepKey } = req.params;

        const steps = await StepModel.find({ key: stepKey });

        // Check if step exists
        if (steps.length === 0) return sendResponse(res, 404, 'Step not found');

        // Get model
        let model: HydratedDocument<any>;
        try {
            model = mongoose.model(stepKey);
        } catch (error) {
            return sendResponse(res, 404, `Step "${stepKey}" not found`);
        }

        const getPatientDataResponse =
            await getDataFromModelWithPaginationAndSearch(req, PatientModel, {
                status: PatientStatus.ACTIVE,
            });

        const patients = getPatientDataResponse.data;
        const countTotalPatients = getPatientDataResponse.count;

        // Create array of promises to speed this up a bit
        const lookups = patients.map(async (p: HydratedDocument<Patient>) => {
            const stepInfo = await model.findOne({
                patientId: p._id.toString(),
            });

            return {
                ...p.toObject(),
                [stepKey]: stepInfo,
            };
        });

        const patientData = await Promise.all(lookups);
        return sendResponse(res, 200, '', {
            data: patientData,
            count: countTotalPatients,
        });
    }),
);

module.exports = router;
