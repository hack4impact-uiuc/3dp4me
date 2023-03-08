require('express-async-errors');
require('dotenv').config({ path: `${process.env.NODE_ENV}.env` });
require('./utils/aws/awsSetup');
const path = require('path');

const mongoose = require('mongoose');
const log = require('loglevel');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');

const { errorHandler } = require('./utils');
const { requireAuthentication } = require('./middleware/authentication');
const { initDB } = require('./utils/initDb');
const {
    setResponseHeaders,
    configureHelment,
} = require('./middleware/responses');
const { logRequest } = require('./middleware/logging');
const { ENV_TEST } = require('./utils/constants');
const { Patient } = require('./models/Patient');
const { generateOrderId } = require('./utils/generateOrderId');

const app = express();

app.use(configureHelment());
app.use(setResponseHeaders);
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(cors());
app.use(
    fileUpload({
        createParentPath: true,
    }),
);

if (process.env.NODE_ENV !== ENV_TEST) initDB();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// This allows the backend to either serve routes or redirect to frontend
app.get('/*', (req, res, next) => {
    if (req.url.includes('/api')) next();
    else {
        res.sendFile(
            path.join(__dirname, '../frontend/build/index.html'),
            (err) => {
                if (err) res.status(500).send(err);
            },
        );
    }
});

app.use(requireAuthentication);
app.use(logRequest);
app.use(require('./routes'));

app.use(errorHandler);

process.on('unhandledRejection', (reason) => {
    log.error(`UNHANDLED REJECTION: ${reason}`);
});

/* eslint-disable no-restricted-syntax, no-await-in-loop, no-unused-vars */
const assignIDs = async () => {
    const patients = await Patient.find({});
    for (const patient of patients) {
        await mongoose.connection.transaction(async (session) => {
            patient.orderYear = new Date().getFullYear();
            if (patient.orderId) {
                await patient.save({ session });
                console.log('Skipping patient with orderID', patient.orderId, 'and year ', patient.orderYear);
                return;
            }

            console.log('GENERATING ID');
            patient.orderId = await generateOrderId(session);
            console.log('GEnERATED ', patient.orderId);
            await patient.save({ session });
        });
    }
};

// assignIDs()

module.exports = app;
