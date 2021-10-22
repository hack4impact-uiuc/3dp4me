// import { postNewPatient } from '../../../frontend/src/api/api';

const express = require('express');

const router = express.Router();
// const mongoose = require('mongoose');
const { MessagingResponse } = require('twilio').twiml;

// const accountSid = 'ACc8a4b008fff15841eccd4636574fc564'; // Your Account SID from www.twilio.com/console
// const authToken = '0e007aea37bb8034dc3bb7ff55ce83c7'; // Your Auth Token from www.twilio.com/console

// const client = require('twilio')(accountSid, authToken);

// TODO: process.env and roles undefined

router.post('/sms', async (req, res) => {
    console.log(req);
    // const phone = req.body.WaId;
    // const patient = { phoneNumber: phone };

    // check if patient exists

    // otherwise create patient

    // let pat = await mongoose
    //     .model('Patient')
    //     .findOne({ phoneNumber: { phone } });

    // if (!pat) {
    //     const r = await postNewPatient(patient);
    //     pat = r?.result;
    // }

    const twiml = new MessagingResponse();

    twiml.message('The Robots are coming! Head for the hills!');

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
    // res.send('hi');

    // send link to patient page (for now send id back to phone number)
    // client.messages
    //     .create({
    //         body: `${pat.patientId}`,
    //         to: 'whatsapp:+13098319210', // Text this number
    //         from: 'whatsapp:+14155238886', // From a valid Twilio number
    //     })
    //     .then((message) => console.log(message.sid));
});

router.get('/sms', (req, res) => {
    res.send('HI FREHCN THOSaAST');
});

module.exports = router;
