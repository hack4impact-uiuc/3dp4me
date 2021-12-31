const log = require('loglevel');

const {
    ERR_AUTH_FAILED,
    ERR_NOT_APPROVED,
} = require('../utils/constants');
const { sendResponse } = require('../utils/response');

/**
 * Middleware requires the incoming request to be authenticated. If not authenticated, a response
 * is sent back to the client, and the middleware chain is stopped. Authentication is done by
 * checking the request for a user, which is automatically attached when Passport logs a user in.
 */
module.exports.requirePatientAuthentication = async (req, res) => {
    try {
        const user = req?.session?.passport?.user;
        if (!user) {
            sendResponse(res, 401, ERR_AUTH_FAILED);
        } else {
            sendResponse(res, 403, ERR_NOT_APPROVED);
        }
    } catch (error) {
        log.error(error);
        sendResponse(res, 401, ERR_AUTH_FAILED);
    }
};
