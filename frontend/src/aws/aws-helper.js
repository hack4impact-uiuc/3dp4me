import { Auth } from "aws-amplify";

const KEY_GROUPS = "cognito:groups";
const KEY_BASIC_USER = "3DP_4ME_USER";
const DEFAULT_USER = {
    attributes: {
        email: "noemail",
        sub: "0",
        username: "Guest",
    }
}

/**
 * Returns true if the user has normal authentication level
 */
export async function isNormalUser(){
    const roles = await getAuthRoleNames();
    return roles.indexOf(KEY_BASIC_USER) > 0;
}

/**
 * This object contains all keys/tokens needed to perform authenticated actions.
 * Send this to the backend whenever doing authenticated operations.
 */
export async function getCredentials(){
    let credentials = await Auth.currentCredentials();
    let creds = Auth.essentialCredentials(credentials);
    return creds
}

/**
 * Returns a list of auth role names belong to current user. Roles are written as strings.
 */
async function getAuthRoleNames(){
    const user = await Auth.currentAuthenticatedUser();
    const groups = user.signInUserSession.accessToken.payload[KEY_GROUPS]
    return groups;
}

/**
 * Returns some info about the current signed in user
 */
export async function getCurrentUserInfo(){
    let userInfo = await Auth.currentUserInfo();
    if (userInfo == null)
        userInfo = DEFAULT_USER

    return userInfo
}

export async function getCurrentSession(){
	return await Auth.currentSession();
}
