import { Auth } from 'aws-amplify';

const DEFAULT_USER = {
    attributes: {
        email: 'noemail',
        sub: '0',
        username: 'Guest',
    },
};

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

export async function signOut() {
    Auth.signOut()
        // .then()
        .catch((error) => console.error(error));
}

export async function getCurrentSession() {
    return Auth.currentSession();
}
