const express = require('express');
const twofactor = require('node-2fa');
const passport = require('passport');
require('express-session');

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const {
    TWILIO_SENDING_NUMBER,
} = require('../../utils/constants');
const { errorWrap } = require('../../utils');
const { models } = require('../../models');
const { sendResponse } = require('../../utils/response');
const { TWO_FACTOR_WINDOW_MINS } = require('../../utils/constants');

const router = express.Router();

require('../../middleware/patientAuthentication');

// TODO: Switch path to be /2fa/authenticated
router.post('/2fa', passport.authenticate('passport-local'), async (req, res) => {
    await sendResponse(
        res,
        200,
        'Successfully authenticated patient',
    );
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
                // todo: constants
                body: `Your one time token is ${newToken.token}`,
                to: `whatsapp:+${patient.phoneNumber}`,
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

// router.set('trust proxy', 1); // trust first proxy
/* router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
})); */

// router.use(express.session({ secret: 'keyboard cat' })); // TODO // set secret to patient secret

// router.use(passport.session());

module.exports = router;
