const log = require('loglevel');

const {
    ERR_AUTH_FAILED,
} = require('../utils/constants');
const { sendResponse } = require('../utils/response');

const { requireAuthentication } = require('./authentication');
const { requirePatientAuthentication } = require('./verifyPatient');

module.exports.requireConditionalAuthentication = async (req, res, next) => {
    try {
        const user = req?.session?.passport?.user;
        if (!user) {
            requireAuthentication(req, res, next);
        } else {
            requirePatientAuthentication(req, res);
        }
    } catch (error) {
        log.error(error);
        sendResponse(res, 401, ERR_AUTH_FAILED);
    }
};
