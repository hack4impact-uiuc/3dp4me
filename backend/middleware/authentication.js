const axios = require('axios');

const authentication = async (req, res, next) => {
    try {
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
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};

module.exports =  authentication;