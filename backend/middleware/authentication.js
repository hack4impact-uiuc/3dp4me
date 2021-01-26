const axios = require('axios');

const requireAuthentication = async (req, res, next) => {
    try {
        // TODO: Get more reliable way of accessing token
        const accessToken = req.headers.authorization.split(" ")[1];

        const { data } = await axios.post(
            process.env.COGNITO_URL,
            {
                AccessToken: accessToken
            },
            {
                headers: {
                    "Content-Type": "application/x-amz-json-1.1",
                    "X-Amz-Target": "AWSCognitoIdentityProviderService.GetUser"
                }
            }
        )

        req.user = data;
        // TODO: Check role
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authentication Failed',
        });
    }
};

module.exports =  authentication;