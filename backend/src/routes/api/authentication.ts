import express, { Request, Response } from 'express';
import twofactor from 'node-2fa';

import { sendResponse } from '../../utils/response';
import { TWO_FACTOR_WINDOW_MINS } from '../../utils/constants';
import errorWrap from '../../utils/errorWrap';
import { PatientModel } from '../../models/Patient';

export const router = express.Router();

/**
 * Get secret, generate the token, then return the token
 * If a patient's secret does not already exist, generate a new secret, then also return the token
 */
router.get(
    '/:patientId',
    errorWrap(async (req: Request, res: Response) => {
        const { patientId } = req.params;

        const patient = await PatientModel.findById(patientId);

        if (!patient) {
            sendResponse(res, 404, 'Patient not found');
            return;
        }

        if (!patient.secret) {
            const newSecret = twofactor.generateSecret({
                name: '3DP4ME',
                account: patientId,
            });

            patient.secret = newSecret.secret;

            await patient.save();
        }

        const newToken = twofactor.generateToken(patient.secret);
        if (!newToken) {
            return sendResponse(res, 500, 'Failed to generate token');
        }

        await sendResponse(
            res,
            200,
            'New authentication key generated',
            newToken,
        );
    }),
);

/**
 * Checks whether the token is correct
 */
router.post(
    '/:patientId/:token',
    errorWrap(async (req: Request, res: Response) => {
        const { patientId, token } = req.params;

        const patient = await PatientModel.findById(patientId);

        if (!patient) {
            sendResponse(res, 404, 'Patient not found');
            return;
        }

        let isAuthenticated = false;
        if (patient.secret) {
            isAuthenticated = twofactor.verifyToken(
                patient.secret,
                token,
                TWO_FACTOR_WINDOW_MINS,
            ) != null;
        }

        if (isAuthenticated) {
            await sendResponse(res, 200, 'Patient verified', {isAuthenticated});
        } else {
            await sendResponse(
                res,
                404,
                'Invalid token entered',
                {isAuthenticated},
            );
        }
    }),
);