var AWS = require('aws-sdk');
const {
    COGNITO_REGION,
    SECURITY_ROLE_ATTRIBUTE_NAME,
} = require('../utils/aws/aws-exports');

const requireAuthentication = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split(' ')[1];

        var params = {
            AccessToken: accessToken,
        };

        // Get the user's information
        // TODO: Make this a global var?
        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
            { region: COGNITO_REGION },
        );
        const user = await cognitoidentityserviceprovider
            .getUser(params)
            .promise();

        // Get the security roles entry for the user.
        const securityRolesString = user.UserAttributes.find(
            (attribute) => attribute.Name === SECURITY_ROLE_ATTRIBUTE_NAME,
        );

        // If the user is missing the security roles entry, that means they have not been authorized
        if (!securityRolesString)
            return res.status(403).json({
                success: false,
                message:
                    'You are not approved to access this site. Please contact an administrator.',
            });

        // Parse the roles into a JS array, and attach it to the request
        const securityRoles = JSON.parse(securityRolesString.Value);
        req.user = user;
        req.user.roles = securityRoles;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Authentication Failed',
        });
    }
};

const requireRole = async (req, res, next) => {
    if (!req.user) await requireAuthentication();

    // TODO: implement

    next();
};

module.exports = requireAuthentication;
