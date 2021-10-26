const express = require('express');

const router = express.Router();
const { MessagingResponse } = require('twilio').twiml;

const { models } = require('../../models/index');

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const {
    TWILIO_RECEIVING_NUMBER,
    TWILIO_SENDING_NUMBER,
} = require('../../utils/constants');

router.post('/sms', async (req, res) => {
    const phone = req?.body?.WaId;
    const patientInfo = { phoneNumber: phone };

    let patient = await models.Patient.findOne(patientInfo);

    if (!patient) {
        const newPatient = new models.Patient(patientInfo);
        patient = await newPatient.save();
    }

    const twiml = new MessagingResponse();

    twiml.message(`${patient._id}`);

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

router.get('/sms', async (req, res) => {
    client.messages
        .create({
            body: 'hi',
            to: TWILIO_RECEIVING_NUMBER,
            from: TWILIO_SENDING_NUMBER,
        })
        .then((message) => console.log(message.sid));
    res.send('HI FREHCN THOSaAST');
});

module.exports = router;
