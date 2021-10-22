const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const { MessagingResponse } = require('twilio').twiml;

const { models } = require('../../models/index');

const accountSid = process.env.ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console

const client = require('twilio')(accountSid, authToken);

router.post('/sms', async (req, res) => {
    console.log(req);
    const phone = req.body.WaId;
    const patient = { phoneNumber: phone };

    let r = await mongoose.model('Patient').findOne({ phoneNumber: phone });

    if (!r) {
        const p = new models.Patient(patient);
        r = await p.save();
    }

    const twiml = new MessagingResponse();

    twiml.message(`${r._id}`);

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

router.get('/sms', async (req, res) => {
    // const phone = '8627021404';
    // const patient = { phoneNumber: phone };

    // let r = await mongoose.model('Patient').findOne({ phoneNumber: phone });

    // if (!r) {
    //     const p = new models.Patient(patient);
    //     r = await p.save();
    // }

    // const twiml = new MessagingResponse();

    // twiml.message(`${r._id}`);

    client.messages
        .create({
            body: 'hi',
            to: 'whatsapp:+13098319210', // Text this number
            from: 'whatsapp:+14155238886', // From a valid Twilio number
        })
        .then((message) => console.log(message.sid));
    res.send('HI FREHCN THOSaAST');
});

module.exports = router;
