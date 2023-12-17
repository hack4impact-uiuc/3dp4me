import { Auth } from 'aws-amplify';

import { COGNITO_ATTRIBUTES } from '../utils/constants';

// Used as a placeholder while fetching real data
const DEFAULT_USER = {
    attributes: {
        email: 'noemail',
        sub: '0',
        username: 'Guest',
    },
};

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
        [COGNITO_ATTRIBUTES.LANGUAGE]: langKey,
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
