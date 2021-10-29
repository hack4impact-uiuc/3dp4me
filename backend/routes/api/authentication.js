const express = require('express');
const twofactor = require('node-2fa');

const { errorWrap } = require('../../utils');
const { models } = require('../../models');
const { sendResponse } = require('../../utils/response');
const { TWO_FACTOR_WINDOW } = require('../../utils/constants');

const router = express.Router();

/**
 * Get secret, generate the token, then return the token
 * If a patient's secret does not already exist, generate a new secret, then also return the token
 */
router.get(
    '/:patientId',
    errorWrap(async (req, res) => {
        const { patientId } = req.params;

        const patient = await models.Patient.findById(patientId);

        if (!patient) {
            sendResponse(res, 404, 'Patient not found');
            return;
        }

        const patientSecret = patient.secret;

        if (!patientSecret) {
            const newSecret = twofactor.generateSecret({
                name: '3DP4ME',
                account: patientId,
            });

            patient.secret = newSecret.secret;

            await patient.save();
        }

        const newToken = twofactor.generateToken(patient.secret);

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
    errorWrap(async (req, res) => {
        const { patientId, token } = req.params;

        const patient = await models.Patient.findById(patientId);

        const patientSecret = patient.secret;

        const isAuthenticated = twofactor.verifyToken(patientSecret, token, TWO_FACTOR_WINDOW);

        if (isAuthenticated) {
            await sendResponse(
                res,
                200,
                'Patient verified',
                isAuthenticated,
            );
        } else {
            await sendResponse(
                res,
                404,
                'Invalid token entered',
                isAuthenticated,
            );
        }
    }),
);

module.exports = router;
