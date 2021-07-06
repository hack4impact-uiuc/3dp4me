export const awsconfig = {
    Auth: {
        identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
        region: process.env.REACT_APP_COGNITO_REGION,
        userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_COGNITO_WEB_CLIENT_ID,
        mandatorySignIn: true,
    },
    oauth: {
        domain: process.env.REACT_APP_OAUTH_DOMAIN,
        scope: [
            'phone',
            'email',
            'openid',
            'aws.cognito.signin.user.admin',
            'profile',
        ],
        redirectSignIn: process.env.REACT_APP_CALLBACK_URL,
        redirectSignOut: process.env.REACT_APP_CALLBACK_URL,
        responseType: 'code',
    },
};
