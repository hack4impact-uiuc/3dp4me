import { AdminGetUserCommandOutput, CognitoIdentityProvider, GetUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import log from 'loglevel';

import { ADMIN_ID } from '../constants';

import {
    COGNITO_REGION,
    SECURITY_ROLE_ATTRIBUTE_NAME,
    SECURITY_ACCESS_ATTRIBUTE_NAME,
    USER_POOL_ID,
    ACCESS_KEY_ID,
    SECRET_ACCESS_KEY,
} from './awsExports'
import { AuthenticatedUser } from './types';
import { AccessLevel } from '@3dp4me/types';

export const getIdentityProvider = () =>
    new CognitoIdentityProvider({
        region: COGNITO_REGION,

        credentials: {
            accessKeyId: ACCESS_KEY_ID,
            secretAccessKey: SECRET_ACCESS_KEY,
        },
    });

/**
 * Given a user object, determine if they are an admin.
 * @param {Object} user The user to check.
 * @returns True if user is admin.
 */
export const isAdmin = (user: AuthenticatedUser) => user.roles.includes(ADMIN_ID);

/**
 * Looks up a user by their access token.
 * @param {String} accessToken The access token provided by AWS Amplify on the frontend.
 * @returns A user object with the following fields:
 *              - roles: String array of role IDs this user has.
 *              - name: The user's name if available, or email otherwise.
 *              - accessLevel: The user's access level.
 */
export const getUserByAccessToken = async (accessToken: string): Promise<AuthenticatedUser> => {
    const user = await getUser(accessToken);
    return {
        ...user,
        roles: parseUserSecurityRoles(user),
        name: parseUserName(user) || parseUserEmail(user),
        accessLevel: parseUserAccess(user),
    }
};

/**
 * Given an AWS user, find and parse their security roles into an array of role IDs.
 * @param {Object} user The user returned by AWS Cognito.
 * @returns An array of strings, where each entry is a role ID. Defaults to empty array of no roles.
 */
export const parseUserSecurityRoles = (user: AdminGetUserCommandOutput) => {
    const securityRolesString = user?.UserAttributes?.find(
        (attribute) => attribute.Name === SECURITY_ROLE_ATTRIBUTE_NAME,
    );

    if (!securityRolesString?.Value) return [];

    return JSON.parse(securityRolesString.Value);
};

/**
 * Returns an array of roleIDs that the given user has.
 * @param {String} username The unique username of the user.
 * @returns Array of roleIDs as strings.
 */
export const getUserRoles = async (username: string): Promise<string[]> => {
    const user = await getUserByUsername(username);
    if (!user) return []
    return parseUserSecurityRoles(user);
};

const getUserByUsername = async (username: string) => {
    const params = {
        UserPoolId: USER_POOL_ID,
        Username: username,
    };

    const identityProvider = getIdentityProvider();
    try {
        const user = await identityProvider.adminGetUser(params);
        return user
    } catch (e) {
        log.error(e);
    }

    return null;
};

const getUser = async (accessToken: string) => {
    const params = {
        AccessToken: accessToken,
    };

    const region = { region: COGNITO_REGION };
    const cip = new CognitoIdentityProvider(region);
    return cip.getUser(params);
};

const parseUserAccess = (user: GetUserCommandOutput): AccessLevel => {
    const accessLevelString = user?.UserAttributes?.find(
        (attribute) => attribute.Name === SECURITY_ACCESS_ATTRIBUTE_NAME,
    )?.Value;

    if (!accessLevelString) return AccessLevel.PENDING;
    return accessLevelString as AccessLevel;
};

const parseUserName = (user: AdminGetUserCommandOutput) => {
    const userNameString = user?.UserAttributes?.find(
        (attribute) => attribute.Name === 'name',
    )?.Value;

    if (!userNameString) return '';

    return userNameString;
};

const parseUserEmail = (user: AdminGetUserCommandOutput) => {
    const name = user?.UserAttributes?.find(
        (attribute) => attribute.Name === 'email',
    );

    if (!name?.Value) return '';

    return name.Value;
};
