const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const { MessagingResponse } = require('twilio').twiml;

const { models } = require('../../models/index');

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

router.post('/sms', async (req, res) => {
    const phone = req.body.WaId;
    const patientToCreate = { phoneNumber: phone };

    let patient = await models.Patient.findOne({ phoneNumber: phone });

    if (!patient) {
        const newPatient = new models.Patient(patientToCreate);
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
            to: 'whatsapp:+13098319210',
            from: 'whatsapp:+14155238886',
        })
        .then((message) => console.log(message.sid));
    res.send('HI FREHCN THOSaAST');
});

module.exports = router;
