const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const twofactor = require('node-2fa');

const { models } = require('../models');
const { TWO_FACTOR_WINDOW_MINS } = require('../utils/constants');

const verifyPatientToken = (patient, token) => {
    const patientSecret = patient.secret;

    if (patient.secret) {
        return twofactor.verifyToken(patientSecret, token, TWO_FACTOR_WINDOW_MINS);
    }

    return false;
};

passport.use('passport-local', new LocalStrategy(
    (_id, token, done) => {
        models.Patient.findById(_id, (err, user) => {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'No such user exists.' });
            }
            if (!(verifyPatientToken(user, token))) {
                return done(null, false, { message: 'Incorrect token.' });
            }
            return done(null, user);
        });
    },
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((_id, done) => {
    models.Patient.findById(_id, (err, user) => {
        done(err, user);
    });
});
