require('express-async-errors');
require('dotenv').config();
require('./utils/aws/aws-setup');
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const fileUpload = require('express-fileupload');
var cors = require('cors');
const bodyParser = require('body-parser');
const { errorHandler } = require('./utils');
const { requireAuthentication } = require('./middleware/authentication');
const { initModels } = require('./utils/init-models');
const app = express();

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(cors());

app.use(
    fileUpload({
        createParentPath: true,
    }),
);

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection
    .once('open', () => {
        console.log('Connected to the DB');
        initModels();
    })
    .on('error', (error) =>
        console.log('Error connecting to the database: ', error),
    );

mongoose.set('useFindAndModify', false);
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

// app.use(requireAuthentication);
app.use(require('./routes'));

app.use(errorHandler);

process.on('unhandledRejection', function (reason, p) {
    console.log(`UNHANDLED REJECTION: ${reason}`);
});

module.exports = app;
