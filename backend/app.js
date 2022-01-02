require('express-async-errors');
require('dotenv').config({ path: `${process.env.NODE_ENV}.env` });
require('./utils/aws/awsSetup');
const path = require('path');

const passport = require('passport');
const log = require('loglevel');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

const { errorHandler } = require('./utils');
const { initDB } = require('./utils/initDb');
const {
    setResponseHeaders,
    configureHelment,
} = require('./middleware/responses');
const { logRequest } = require('./middleware/logging');
const { ENV_TEST } = require('./utils/constants');

const app = express();

app.use(configureHelment());
app.use(setResponseHeaders);
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(cors({ credentials: true, origin: 'http://localhost:3000', methods: ['GET', 'POST'] }));
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

/**
 * This is the secret used to sign the session ID cookie.
 * This can be either a string for a single secret, or an array of multiple secrets.
 * If an array of secrets is provided, only the first element will be used to sign the session
 * ID cookie, while all the elements will be considered when verifying the signature in requests.
 * The secret itself should be not easily parsed by a human and would best be a random set of
 * characters.
 *
 * Patients will be logged in a session for 10 minutes, unless they refresh to extend this period.
 * maxAge can also be set to null, which keeps a user logged in until the BROWSER is closed.
 */
const sess = {
    secret: '3DP4ME',
    cookie: {
        domain: 'localhost', path: '/', httpOnly: true, secure: false, maxAge: 60000 * 10,
    },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URI }),
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
}

app.use(cookieParser());

app.use(session(sess));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(logRequest);
app.use(require('./routes'));

app.use(errorHandler);

process.on('unhandledRejection', (reason) => {
    log.error(`UNHANDLED REJECTION: ${reason}`);
});

module.exports = app;
