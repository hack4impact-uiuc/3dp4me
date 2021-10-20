const express = require('express');

const router = express.Router();
const { MessagingResponse } = require('twilio').twiml;

router.post('/sms', (req, res) => {
    console.log(req);
    const twiml = new MessagingResponse();

    twiml.message('The Robots are coming! Head for the hills!');

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
    res.send('hi');
});

router.get('/sms', (req, res) => {
    res.send('HI FREHCN THOSaAST');
});

module.exports = router;
