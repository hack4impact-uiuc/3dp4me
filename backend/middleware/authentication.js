const { getUserByAccessToken } = require('../utils/aws/aws-user');
const {
    ACCESS_LEVELS,
    ERR_AUTH_FAILED,
    ERR_NOT_APPROVED,
} = require('../utils/constants');
const { sendResponse } = require('../utils/response');

const getUserFromRequest = async (req) => {
    const authHeader = req?.headers?.authorization?.split(' ');
    if (authHeader?.length != 2) return null;

    const accessToken = authHeader[1];
    return await getUserByAccessToken(accessToken);
};

const requireAuthentication = async (req, res, next) => {
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

const requireRole = (role) => {
    return async (req, res, next) => {
        if (!req.user) await requireAuthentication();
        if (!req.user.roles.includes(role))
            return sendResponse(res, 403, ERR_NOT_APPROVED);

        next();
    };
};

const requireAdmin = requireRole(ADMIN_ID);

module.exports.ADMIN_ID = ADMIN_ID;
module.exports.requireRole = requireRole;
module.exports.requireAdmin = requireAdmin;
module.exports.requireAuthentication = requireAuthentication;
