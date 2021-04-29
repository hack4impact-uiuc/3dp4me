var AWS = require('aws-sdk');
const {
    COGNITO_REGION,
    SECURITY_ROLE_ATTRIBUTE_NAME,
} = require('../utils/aws/aws-exports');

const ACCESS_LEVELS = {
    GRANTED: 'Granted',
    REVOKED: 'Revoked',
    PENDING: 'Pending',
};

ADMIN_ID = '606e0a4602b23d02bc77673b';

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
    if (!user || !user.UserAttributes) return [];

    const securityRolesString = user.UserAttributes.find(
        (attribute) => attribute.Name === SECURITY_ROLE_ATTRIBUTE_NAME,
    );

    if (!securityRolesString) return [];

    return JSON.parse(securityRolesString.Value);
};

const parseUserName = (user) => {
    if (!user || !user.UserAttributes) return '';

    const name = user.UserAttributes.find(
        (attribute) => attribute.Name === 'name',
    );

    if (!name) return '';

    return name.Value;
};

const parseUserAccess = (user) => {
    if (!user || !user.UserAttributes) return ACCESS_LEVELS.PENDING;

    const accessLevelString = user.UserAttributes.find(
        (attribute) => attribute.Name === SECURITY_ACCESS_ATTRIBUTE_NAME,
    );

    return accessLevelString;
};

const requireAuthentication = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split(' ')[1];
        const user = await getUser(accessToken);
        user.roles = parseUserSecurityRoles(user);
        user.accessLevel = parseUserAccess(user);
        user.name = parseUserName(user);

        if (user.accessLevel != ACCESS_LEVELS.GRANTED) {
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

module.exports.requireAuthentication = requireAuthentication;
module.exports.parseUserSecurityRoles = parseUserSecurityRoles;
