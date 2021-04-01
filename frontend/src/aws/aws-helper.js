import { Auth } from 'aws-amplify';
import { awsconfig } from './aws-exports';
import AWS from 'aws-sdk';

const KEY_GROUPS = 'cognito:groups';
const KEY_BASIC_USER = '3DP_4ME_USER';
const DEFAULT_USER = {
    attributes: {
        email: 'noemail',
        sub: '0',
        username: 'Guest',
    },
};

/**
 * Returns a list of auth role names belong to current user. Roles are written as strings.
 */
async function getAuthRoleNames() {
    const user = await Auth.currentAuthenticatedUser();
    const groups = user.signInUserSession.accessToken.payload[KEY_GROUPS];
    return groups;
}

/**
 * Returns true if the user has normal authentication level
 */
export async function isNormalUser() {
    const roles = await getAuthRoleNames();
    return roles.indexOf(KEY_BASIC_USER) > 0;
}

/**
 * This object contains all keys/tokens needed to perform authenticated actions.
 * Send this to the backend whenever doing authenticated operations.
 */
export async function getCredentials() {
    const credentials = await Auth.currentCredentials();
    const creds = Auth.essentialCredentials(credentials);
    return creds;
}

/**
 * Returns some info about the current signed in user
 */
export async function getCurrentUserInfo() {
    let userInfo = await Auth.currentUserInfo();
    if (userInfo == null) userInfo = DEFAULT_USER;

    return userInfo;
}

/**
 * Updates a user's language attribute in AWS Cognito User Groups
 * @param {String} langKey The user's preferred language. Either "EN" or "AR".
 */
export async function saveLanguagePreference(langKey) {
    const user = await Auth.currentAuthenticatedUser();
    Auth.updateUserAttributes(user, {
        'custom:language': langKey,
    });
}

export async function getCurrentSession() {
    return Auth.currentSession();
}

// TODO: Move this to the backend
// export async function getAllUsers() {
//     var params = {
//         UserPoolId: awsconfig.Auth.userPoolId,
//       };

//       const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider()
//       cognitoidentityserviceprovider.listUsers(params, function(err, data) {
//         if (err) console.log(err, err.stack); // an error occurred
//         else     console.log(data);           // successful response
//       });
// }
