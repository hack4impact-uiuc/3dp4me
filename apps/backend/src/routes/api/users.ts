import express, { Response } from 'express';

import {
    USER_POOL_ID,
    SECURITY_ACCESS_ATTRIBUTE_NAME,
} from '../../utils/aws/awsExports';
import {
    getUserRoles,
    getIdentityProvider,
}from '../../utils/aws/awsUsers';
import { sendResponse } from '../../utils/response';
import {
    createRoleUpdateParams,
    getValidRoles,
    isRoleValid,
} from '../../utils/roleUtils';
import  { requireAdmin } from '../../middleware/authentication';
import {
    ADMIN_ID,
    DEFAULT_USERS_ON_GET_REQUEST,
} from '../../utils/constants';
import errorWrap from '../../utils/errorWrap';
import { AuthenticatedRequest } from '../../middleware/types';
import { queryParamToNum, queryParamToString } from '../../utils/request';
import { ListUsersRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';

export const router = express.Router();

/**
 * Gets information about the user making this request.
 */
router.get(
    '/self',
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        const isAdmin = req?.user?.roles?.includes(ADMIN_ID) || false;

        const data = {
            isAdmin,
        };

        await sendResponse(res, 200, '', data);
    }),
);

/**
 * Returns a list of all users in our system
 */
router.get(
    '/',
    requireAdmin as any,
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        const token = queryParamToString(req.query.token ?? "")
        const nPerPage = queryParamToNum(req.query.nPerPage ?? DEFAULT_USERS_ON_GET_REQUEST);

        const params: ListUsersRequest = {
            UserPoolId: USER_POOL_ID,
            Limit: nPerPage,
        };

        if (token.length) params.PaginationToken = token;

        const identityProvider = getIdentityProvider();
        try {
            const users = await identityProvider.listUsers(params);
            await sendResponse(res, 200, '', users);
        } catch (error) {
            await sendResponse(
                res,
                400,
                'Please send a proper pagination token.',
                {},
            );
        }
    }),
);

/**
 * Gives a user a role. The URL params are the user's unique
 * username and the roleID to add.
 */
router.put(
    '/:username/roles/:roleId',
    requireAdmin as any,
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        const { username, roleId } = req.params;

        // Check that role is valid
        const roleIsValid = await isRoleValid(roleId);
        if (!roleIsValid) return sendResponse(res, 400, 'Invalid role');

        // Create the object to pass to AWS to perform the update
        const userRoles = await getUserRoles(username);
        const validUserRoles = await getValidRoles(userRoles);
        const params = createRoleUpdateParams(username, validUserRoles, roleId);

        // If we couldn't create the params, the user has the max amount of roles.
        if (!params) {
            return sendResponse(res, 400, 'User has max amount of roles.');
        }

        // Do the update
        const identityProvider = getIdentityProvider();
        await identityProvider.adminUpdateUserAttributes(params);
        return sendResponse(res, 200, 'Role added to user');
    }),
);

/**
 * Deletes a role from a user. The URL params are the user's unique
 * username and the roleID to add.
 */
router.delete(
    '/:username/roles/:roleId',
    requireAdmin as any,
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        const { username, roleId } = req.params;

        // Check if user has this role
        const userRoles = await getUserRoles(username);
        const roleIndex = userRoles.indexOf(roleId);
        if (roleIndex === -1) {
            return sendResponse(res, 400, 'User does not have role');
        }

        // Create params for the update in AWS
        userRoles.splice(roleIndex, 1);
        const params = createRoleUpdateParams(username, userRoles, null);
        if (!params) {
            return sendResponse(res, 400, 'User has max amount of roles.');
        }

        // Do the update
        const identityProvider = getIdentityProvider();
        await identityProvider.adminUpdateUserAttributes(params);
        return sendResponse(res, 200, 'Role removed');
    }),
);

/**
 * Gives a user an access level. The URL params are the user's unique
 * username and the access level to set.
 */
router.put(
    '/:username/access/:accessLevel',
    requireAdmin as any,
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        const { username, accessLevel } = req.params;

        // Create the params for the update
        const params = {
            UserAttributes: [
                {
                    Name: SECURITY_ACCESS_ATTRIBUTE_NAME,
                    Value: accessLevel,
                },
            ],
            UserPoolId: USER_POOL_ID,
            Username: username,
        };

        // Do the update
        const identityProvider = getIdentityProvider();
        await identityProvider.adminUpdateUserAttributes(params);
        await sendResponse(res, 200, 'Access updated');
    }),
);

/**
 * Deletes a user. The URL param is the user's unique
 * username;
 */
router.delete(
    '/:username',
    requireAdmin as any,
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        const { username } = req.params;

        // Create the params for the deletion
        const params = {
            Username: username,
            UserPoolId: USER_POOL_ID,
        };

        // Do the deletion
        const identityProvider = getIdentityProvider();
        await identityProvider.adminDeleteUser(params);
        await sendResponse(res, 200, 'Access updated');
    }),
);

module.exports = router;
