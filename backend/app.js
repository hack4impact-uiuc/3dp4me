require('express-async-errors');
require('dotenv').config({ path: `${process.env.NODE_ENV}.env` });
require('./utils/aws/aws-setup');
const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errorHandler } = require('./utils');
const { requireAuthentication } = require('./middleware/authentication');
const { initDB } = require('./utils/init-db');
const { setResponseHeaders } = require('./middleware/responses');
const app = express();

app.use(helmet());
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
app.use(require('./routes'));
app.use(errorHandler);

process.on('unhandledRejection', function (reason, p) {
    console.log(`UNHANDLED REJECTION: ${reason}`);
});

module.exports = app;
