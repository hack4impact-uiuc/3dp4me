const { getUserByAccessToken } = require('../utils/aws/aws-user');
const {
    ACCESS_LEVELS,
    ERR_AUTH_FAILED,
    ERR_NOT_APPROVED,
    ADMIN_ID,
} = require('../utils/constants');
const { sendResponse } = require('../utils/response');

/**
 * Middleware requires the incoming request to be authenticated. If not authenticated, a response
 * is sent back to the client, and the middleware chain is stopped. Authenticatio is done through
 * the 'authentication' HTTP header, which should be of the format 'Bearer <ACCESS_TOKEN>'. If
 * successful, the user's data is attachted to req.user before calling the next function.
 */
module.exports.requireAuthentication = async (req, res, next) => {
    try {
        const user = await getUserFromRequest(req);
        if (!user) return sendResponse(res, 401, ERR_AUTH_FAILED);

        if (user.accessLevel !== ACCESS_LEVELS.GRANTED)
            return sendResponse(res, 403, ERR_NOT_APPROVED);

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return sendResponse(res, 401, ERR_AUTH_FAILED);
    }
};

/**
 * Constructs a middleware function that requires the user to
 * have the specified role ID.
 * @param {String} role The mongo ID of the role required.
 * @returns A middleware function that requires the role.
 */
module.exports.requireRole = (role) => {
    return async (req, res, next) => {
        if (!req.user) await requireAuthentication();
        if (!req.user.roles.includes(role))
            return sendResponse(res, 403, ERR_NOT_APPROVED);

        next();
    };
};

/**
 * Convienience middleware to require a user to be Admin before proceeding.
 */
module.exports.requireAdmin = this.requireRole(ADMIN_ID);

const getUserFromRequest = async (req) => {
    const authHeader = req?.headers?.authorization?.split(' ');
    if (authHeader?.length != 2) return null;

    const accessToken = authHeader[1];
    return await getUserByAccessToken(accessToken);
};
