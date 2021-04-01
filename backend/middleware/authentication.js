var AWS = require('aws-sdk');
const { COGNITO_REGION } = require('../utils/aws/aws-exports');

const requireAuthentication = async (req, res, next) => {
    try {
        // TODO: Get more reliable way of accessing token
        const accessToken = req.headers.authorization.split(' ')[1];

        var params = {
            AccessToken: accessToken,
        };

        // TODO: Should we create a new one each time, or should we hold a single global?
        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
            { region: COGNITO_REGION },
        );
        const user = await cognitoidentityserviceprovider
            .getUser(params)
            .promise();
        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authentication Failed',
        });
    }
};

module.exports = requireAuthentication;
