const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const express = require('express');
const twofactor = require('node-2fa');
const passport = require('passport');
const client = require('twilio')(accountSid, authToken);

const {
    TWILIO_SENDING_NUMBER,
    TWILIO_WHATSAPP_PREFIX,
} = require('../../utils/constants');
const { errorWrap } = require('../../utils');
const { models } = require('../../models');
const { sendResponse } = require('../../utils/response');
const { TWO_FACTOR_WINDOW_MINS } = require('../../utils/constants');

const router = express.Router();

require('../../middleware/patientAuthentication');

router.post('/authenticated/:patientId', passport.authenticate('passport-local'), async (req, res) => {
    const { patientId } = req.params;
    if (!req.user) { return res.redirect(`/${patientId}`); }
    req.logIn(req.user, (err) => {
        if (err) { return err; }
        req.session.save();
        return sendResponse(
            res,
            200,
            'Successfully authenticated patient',
        );
    });

    return req.user;
});

/**
 * Get secret, generate the token, then return the token
 * If a patient's secret does not already exist, generate a new secret, then also return the token
 * Send the patient token through Twilio to Whatsapp
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

        client.messages
            .create({
                body: `Your one time token is ${newToken.token}`,
                to: `${TWILIO_WHATSAPP_PREFIX}${patient.phoneNumber}`,
                from: TWILIO_SENDING_NUMBER,
            })
            .then((message) => console.log(message.sid))
            .catch((err) => console.log(err));
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

        if (!patient) {
            sendResponse(res, 404, 'Patient not found');
            return;
        }

        const patientSecret = patient.secret;

        let isAuthenticated = false;

        if (patient.secret) {
            isAuthenticated = twofactor.verifyToken(patientSecret, token, TWO_FACTOR_WINDOW_MINS);
        }

        if (isAuthenticated) {
            await sendResponse(
                res,
                200,
                'Patient verified',
            );
        } else {
            await sendResponse(
                res,
                404,
                'Invalid token entered',
            );
        }
    }),
);

router.get(
    '/patient-portal/:patientId',
    errorWrap(async (req, res) => {
        const { patientId } = req.params;
        let patient;

        try {
            patient = await models.Patient.findById(patientId);
        } catch {
            await sendResponse(
                res,
                404,
                'An error occurred while checking for patient authentication',
            );
            return;
        }

        if (!patient) {
            await sendResponse(
                res,
                404,
                'Invalid patient ID',
            );
            return;
        }

        if (!req.user) {
            await sendResponse(
                res,
                404,
                'Session expired',
            );
            return;
        }

        await sendResponse(
            res,
            200,
            'Patient verified',
        );
    }),
);

module.exports = router;
