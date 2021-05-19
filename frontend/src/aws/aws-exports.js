const IN_DEV_ENV =
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const CALLBACK_URL = IN_DEV_ENV
    ? 'http://localhost:3000/'
    : 'https://3dp4me-software.org/';

export const awsconfig = {
    Auth: {
        identityPoolId: 'eu-north-1:9e98b344-a500-4a5c-9cff-82ab2a675ffa',
        region: 'eu-north-1',
        userPoolId: 'eu-north-1_SP6ulizki',
        userPoolWebClientId: '67vdi8i1o8lsr2jv1lpm7d30nk',
        mandatorySignIn: true,
    },
    oauth: {
        domain: '3dp4me.auth.eu-north-1.amazoncognito.com',
        scope: [
            'phone',
            'email',
            'openid',
            'aws.cognito.signin.user.admin',
            'profile',
        ],
        redirectSignIn: CALLBACK_URL,
        redirectSignOut: CALLBACK_URL,
        responseType: 'code',
    },
};
