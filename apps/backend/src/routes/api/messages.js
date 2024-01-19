const express = require('express');
const { MessagingResponse } = require('twilio').twiml;

const router = express.Router();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const { models } = require('../../models/index');
const {
    TWILIO_RECEIVING_NUMBER,
    TWILIO_SENDING_NUMBER,
} = require('../../utils/constants');

router.post('/sms', async (req, res) => {
    const phone = req?.body?.WaId;
    const patientInfo = { phoneNumber: phone };

    let patients = await models.Patient.find(patientInfo);

    if (patients.length === 0) {
        const newPatient = new models.Patient(patientInfo);
        patients = [await newPatient.save()];
    }

    const twiml = new MessagingResponse();

    const patientInfoReducer = (prev, curr) => {
        const patientName = curr?.familyName
            ? `${curr?.firstName} ${curr?.familyName}`
            : `${curr?.firstName}`;
        return `${prev} ${
            curr?.firstName ? `${patientName}` : 'Unnamed Patient'
        } : \n ${curr._id} \n`;
    };

    const messageToPatients = patients.reduce(patientInfoReducer, '');

    twiml.message(messageToPatients);

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
