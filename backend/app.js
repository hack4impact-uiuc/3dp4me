require('express-async-errors');
require('dotenv').config({ path: `${process.env.NODE_ENV}.env` });
require('./utils/aws/awsSetup');
const express = require('express');
const path = require('path');
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

if (process.env.NODE_ENV != 'test') initDB();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// This allows the backend to either serve routes or redirect to frontend
app.get('/*', function (req, res, next) {
    if (req._parsedOriginalUrl.path.includes('/api')) next();
    else
        res.sendFile(
            path.join(__dirname, '../frontend/build/index.html'),
            function (err) {
                if (err) res.status(500).send(err);
            },
        );
});

app.use(requireAuthentication);
app.use(logRequest);
app.use(require('./routes'));
app.use(errorHandler);

process.on('unhandledRejection', function (reason, p) {
    console.log(`UNHANDLED REJECTION: ${reason}`);
});

module.exports = app;
