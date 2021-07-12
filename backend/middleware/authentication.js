const { LexModelBuildingService } = require('aws-sdk');
var AWS = require('aws-sdk');
const {
    COGNITO_REGION,
    SECURITY_ROLE_ATTRIBUTE_NAME,
    SECURITY_ACCESS_ATTRIBUTE_NAME,
} = require('../utils/aws/aws-exports');

module.exports.ACCESS_LEVELS = {
    GRANTED: 'Granted',
    REVOKED: 'Revoked',
    PENDING: 'Pending',
};

const ADMIN_ID = '606e0a4602b23d02bc77673b';

const isAdmin = (user) => user.roles.includes(ADMIN_ID);

const getUser = async (accessToken) => {
    var params = {
        AccessToken: accessToken,
    };

    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
        { region: COGNITO_REGION },
    );

    return await cognitoidentityserviceprovider.getUser(params).promise();
};

const parseUserSecurityRoles = (user) => {
    const securityRolesString = user?.UserAttributes?.find(
        (attribute) => attribute.Name === SECURITY_ROLE_ATTRIBUTE_NAME,
    );

    if (!securityRolesString?.Value) return [];

    return JSON.parse(securityRolesString.Value);
};

const parseUserAccess = (user) => {
    const accessLevelString = user?.UserAttributes?.find(
        (attribute) => attribute.Name === SECURITY_ACCESS_ATTRIBUTE_NAME,
    )?.Value;

    if (!accessLevelString) return this.ACCESS_LEVELS.PENDING;

    return accessLevelString;
};

const parseUserName = (user) => {
    const userNameString = user?.UserAttributes?.find(
        (attribute) => attribute.Name === 'name',
    )?.Value;

    if (!userNameString) return '';

    return userNameString;
};

const parseUserEmail = (user) => {
    const name = user?.UserAttributes?.find(
        (attribute) => attribute.Name === 'email',
    );

    if (!name?.Value) return '';

    return name.Value;
};

const requireAuthentication = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split(' ')[1];
        const user = await getUser(accessToken);
        user.roles = parseUserSecurityRoles(user);
        user.name = parseUserName(user);
        user.accessLevel = parseUserAccess(user);

        if (user.accessLevel != this.ACCESS_LEVELS.GRANTED) {
            return res.status(403).json({
                success: false,
                message:
                    'You are not approved to access this site. Please contact an administrator.',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: 'Authentication Failed',
        });
    }
};

const requireRole = (role) => {
    return async (req, res, next) => {
        if (!req.user) await requireAuthentication();
        if (!req.user.roles.includes(role)) {
            return res.status(403).json({
                success: false,
                message:
                    'You are not approved to access this resource. Please contact an administrator.',
            });
        }

        next();
    };
};

const requireAdmin = requireRole(ADMIN_ID);

module.exports.isAdmin = isAdmin;
module.exports.ADMIN_ID = ADMIN_ID;
module.exports.requireRole = requireRole;
module.exports.requireAdmin = requireAdmin;
module.exports.requireAuthentication = requireAuthentication;
module.exports.parseUserSecurityRoles = parseUserSecurityRoles;
