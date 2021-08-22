const express = require('express');
const router = express.Router();
const { errorWrap } = require('../../utils');
const AWS = require('aws-sdk');
const {
    USER_POOL_ID,
    COGNITO_REGION,
    ACCESS_KEY_ID,
    SECRET_ACCESS_KEY,
    SECURITY_ACCESS_ATTRIBUTE_NAME,
} = require('../../utils/aws/awsExports');
const { getUserRoles } = require('../../utils/aws/awsUsers');
const { sendResponse } = require('../../utils/response');
const {
    createRoleUpdateParams,
    getValidRoles,
    isRoleValid,
} = require('../../utils/roleUtils');
const { requireAdmin } = require('../../middleware/authentication');

const getIdentityProvider = () => {
    return new AWS.CognitoIdentityServiceProvider({
        region: COGNITO_REGION,
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    });
};

/**
 * Returns a list of all users in our system
 */
router.get(
    '/',
    requireAdmin,
    errorWrap(async (req, res) => {
        var params = {
            UserPoolId: USER_POOL_ID,
        };

        const identityProvider = getIdentityProvider();
        const users = await identityProvider.listUsers(params).promise();
        await sendResponse(res, 200, '', users);
    }),
);

/**
 * Gives a user a role. The URL params are the user's unique
 * username and the roleID to add.
 */
router.put(
    '/:username/roles/:roleId',
    requireAdmin,
    errorWrap(async (req, res) => {
        const { username, roleId } = req.params;

        // Check that role is valid
        const roleIsValid = await isRoleValid(roleId);
        if (!roleIsValid) return await sendResponse(res, 400, 'Invalid role');

        // Create the object to pass to AWS to perform the update
        const userRoles = await getUserRoles(username);
        const validUserRoles = await getValidRoles(userRoles);
        const params = createRoleUpdateParams(username, validUserRoles, roleId);

        // If we couldn't create the params, the user has the max amount of roles.
        if (!params)
            return await sendResponse(
                res,
                400,
                'User has max amount of roles.',
            );

        // Do the update
        const identityProvider = getIdentityProvider();
        await identityProvider.adminUpdateUserAttributes(params).promise();
        await sendResponse(res, 200, 'Role added to user');
    }),
);

/**
 * Deletes a role from a user. The URL params are the user's unique
 * username and the roleID to add.
 */
router.delete(
    '/:username/roles/:roleId',
    requireAdmin,
    errorWrap(async (req, res) => {
        const { username, roleId } = req.params;

        // Check if user has this role
        const userRoles = await getUserRoles(username);
        const roleIndex = userRoles.indexOf(roleId);
        if (roleIndex === -1)
            return await sendResponse(res, 400, 'User does not have role');

        // Create params for the update in AWS
        userRoles.splice(roleIndex, 1);
        const params = createRoleUpdateParams(username, userRoles, null);

        // Do the update
        const identityProvider = getIdentityProvider();
        await identityProvider.adminUpdateUserAttributes(params).promise();
        await sendResponse(res, 200, 'Role removed');
    }),
);

/**
 * Gives a user an access level. The URL params are the user's unique
 * username and the access level to set.
 */
router.put(
    '/:username/access/:accessLevel',
    requireAdmin,
    errorWrap(async (req, res) => {
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
        await identityProvider.adminUpdateUserAttributes(params).promise();
        await sendResponse(res, 200, 'Access updated');
    }),
);

/**
 * Gets information about the user making this request.
 */
router.get(
    '/self',
    errorWrap(async (req, res) => {
        const data = {
            isAdmin: req.user.roles.includes(ADMIN_ID),
        };

        await sendResponse(res, 200, '', data);
    }),
);

module.exports = router;
