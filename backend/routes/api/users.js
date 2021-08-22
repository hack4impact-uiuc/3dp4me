const express = require('express');
const router = express.Router();
const { errorWrap } = require('../../utils');
const { models } = require('../../models/index');
const AWS = require('aws-sdk');
const {
    USER_POOL_ID,
    SECURITY_ROLE_ATTRIBUTE_NAME,
    COGNITO_REGION,
    ACCESS_KEY_ID,
    SECRET_ACCESS_KEY,
    SECURITY_ROLE_ATTRIBUTE_MAX_LEN,
    SECURITY_ACCESS_ATTRIBUTE_NAME,
} = require('../../utils/aws/aws-exports');
const { ADMIN_ID } = require('../../utils/constants');
const {
    parseUserSecurityRoles,
    getUserRoles,
} = require('../../utils/aws/aws-user');
const { sendResponse } = require('../../utils/response');
const {
    createRoleUpdateParams,
    getValidRoles,
    isRoleValid,
} = require('../../utils/roleUtils');

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
    errorWrap(async (req, res) => {
        const { username, roleId } = req.params;
        const userRoles = await getUserRoles(username);
        const roleIndex = userRoles.indexOf(roleId);
        if (roleIndex == -1) {
            return res.status(400).json({
                success: false,
                message: 'User does not have role',
            });
        }

        userRoles.splice(roleIndex, 1);
        const params = createRoleUpdateParams(username, userRoles, null);

        const identityProvider = getIdentityProvider();
        await identityProvider.adminUpdateUserAttributes(
            params,
            (err, data) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err,
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: 'Role successfully removed',
                });
            },
        );
    }),
);

/**
 * Gives a user an access level. The URL params are the user's unique
 * username and the access level to set.
 */
router.put(
    '/:username/access/:accessLevel',
    errorWrap(async (req, res) => {
        const { username, accessLevel } = req.params;
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

        const identityProvider = getIdentityProvider();
        await identityProvider.adminUpdateUserAttributes(
            params,
            (err, data) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err,
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: 'Access level successfully changed',
                });
            },
        );
    }),
);

/**
 * Gets information about the user making this request.
 */
router.get(
    '/self',
    errorWrap(async (req, res) => {
        res.status(200).json({
            isAdmin: req.user.roles.includes(ADMIN_ID),
            success: true,
        });
    }),
);

module.exports = router;
