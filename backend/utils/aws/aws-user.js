var AWS = require('aws-sdk');
const {
    COGNITO_REGION,
    SECURITY_ROLE_ATTRIBUTE_NAME,
    SECURITY_ACCESS_ATTRIBUTE_NAME,
} = require('../../utils/aws/aws-exports');
const { ACCESS_LEVELS, ADMIN_ID } = require('../constants');

/**
 * Given a user object, determine if they are an admin.
 * @param {Object} user The user to check.
 * @returns True if user is admin.
 */
module.exports.isAdmin = (user) => user.roles.includes(ADMIN_ID);

/**
 * Looks up a user by their access token.
 * @param {String} accessToken The access token provided by AWS Amplify on the frontend.
 * @returns A user object with the following fields:
 *              - roles: String array of role IDs this user has.
 *              - name: The user's name if available, or email otherwise.
 *              - accessLevel: The user's access level.
 */
exports.getUserByAccessToken = async (accessToken) => {
    const user = await getUser(accessToken);
    user.roles = this.parseUserSecurityRoles(user);
    user.name = parseUserName(user) || parseUserEmail(user);
    user.accessLevel = parseUserAccess(user);
    return user;
};

/**
 * Given an AWS user, find and parse their security roles into an array of role IDs.
 * @param {Object} user The user returned by AWS Cognito.
 * @returns An array of strings, where each entry is a role ID. Defaults to empty array of no roles.
 */
module.exports.parseUserSecurityRoles = (user) => {
    const securityRolesString = user?.UserAttributes?.find(
        (attribute) => attribute.Name === SECURITY_ROLE_ATTRIBUTE_NAME,
    );

    if (!securityRolesString?.Value) return [];

    return JSON.parse(securityRolesString.Value);
};

const getUser = async (accessToken) => {
    var params = {
        AccessToken: accessToken,
    };

    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
        { region: COGNITO_REGION },
    );

    return await cognitoidentityserviceprovider.getUser(params).promise();
};

const parseUserAccess = (user) => {
    const accessLevelString = user?.UserAttributes?.find(
        (attribute) => attribute.Name === SECURITY_ACCESS_ATTRIBUTE_NAME,
    )?.Value;

    if (!accessLevelString) return ACCESS_LEVELS.PENDING;

    return accessLevelString;
};

const parseUserName = (user) => {
    const userNameString = user?.UserAttributes?.find(
        (attribute) => attribute.Name === 'name',
    )?.Value;

    if (!userNameString) return '';

    return userNameString;
};

const parseUserEmail = (user) => {
    const name = user?.UserAttributes?.find(
        (attribute) => attribute.Name === 'email',
    );

    if (!name?.Value) return '';

    return name.Value;
};
