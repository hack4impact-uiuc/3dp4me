import { ResourcesConfig } from 'aws-amplify'

const callbackUrl = process.env.REACT_APP_CALLBACK_URL ?? ''

export const awsconfig: ResourcesConfig = {
    Auth: {
        Cognito: {
            identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID ?? '',
            userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID ?? '',
            userPoolClientId: process.env.REACT_APP_COGNITO_WEB_CLIENT_ID ?? '',
            allowGuestAccess: false,
            loginWith: {
                oauth: {
                    domain: process.env.REACT_APP_OAUTH_DOMAIN ?? '',
                    scopes: [
                        'phone',
                        'email',
                        'openid',
                        'aws.cognito.signin.user.admin',
                        'profile',
                    ],
                    redirectSignIn: [callbackUrl],
                    redirectSignOut: [callbackUrl],
                    responseType: 'code',
                },
            },
        },
    },
}
