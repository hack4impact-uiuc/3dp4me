const accountSid = 'ACc8a4b008fff15841eccd4636574fc564'; // Your Account SID from www.twilio.com/console
const authToken = '0e007aea37bb8034dc3bb7ff55ce83c7'; // Your Auth Token from www.twilio.com/console

const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'Hello from Node',
        to: 'whatsapp:+13098319210', // Text this number
        from: 'whatsapp:+14155238886', // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));

// while (true) {}

// TODO: move these to env
