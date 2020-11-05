import { Auth } from "aws-amplify";

const KEY_GROUPS = "cognito:groups";
const KEY_BASIC_USER = "3DP_4ME_USER";

/**
 * Downloads an item from the S3 bucket. Automatically defaults to getting item from
 * the public space.
 * @param fileName The fully qualified resource name. Filepaths are relative to the /public folder
 *                 in the S3 bucket. If the file is /public/imgs/img.png, then fileName should be imgs/img.png. 
 */
export function getFileFromS3(fileName){
    return Storage.get(fileName);
}

/**
 * Returns true if the user has normal authentication level
 */
export async function isNormalUser(){
    const roles = await getAuthRoleNames();
    return roles.indexOf(KEY_BASIC_USER) > 0;
}

async function getCredentials(){
    let credentials = await Auth.currentCredentials();
    let creds = Auth.essentialCredentials(credentials);
    return creds
}

export async function getAccessKey() {
    let creds = await getCredentials();
    return creds.accessKeyId
}

export async function getSecretAccessKey() {
    let creds = await getCredentials();
    return creds.secretAccessKey
}

export async function getSessionToken() {
    let creds = await getCredentials();
    return creds.sessionToken
}

/**
 * Returns a list of auth role names belong to current user. Roles are written as strings.
 */
async function getAuthRoleNames(){
    const user = await Auth.currentAuthenticatedUser();
    const groups = user.signInUserSession.accessToken.payload[KEY_GROUPS]
    return groups;
}
