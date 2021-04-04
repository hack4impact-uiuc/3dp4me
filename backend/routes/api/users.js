const express = require('express');
const router = express.Router();
const { errorWrap } = require('../../utils');
const { models } = require('../../models');
const mongoose = require('mongoose');
const AWS = require('aws-sdk');
const {
    USER_POOL_ID,
    SECURITY_ROLE_ATTRIBUTE_NAME,
    COGNITO_REGION,
    ACCESS_KEY_ID,
    SECRET_ACCESS_KEY,
} = require('../../utils/aws/aws-exports');

const { parseUserSecurityRoles } = require('../../middleware/authentication');

const getIdentityProvider = () => {
    return new AWS.CognitoIdentityServiceProvider({
        region: COGNITO_REGION,
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    });
};

// Get all users
router.get(
    '/',
    errorWrap(async (req, res) => {
        var params = {
            UserPoolId: USER_POOL_ID,
        };

        const identityProvider = getIdentityProvider();
        await identityProvider.listUsers(params, (err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err,
                });
            }

            return res.status(200).json({
                success: true,
                result: data,
            });
        });
    }),
);

const isRoleValid = (role) => {
    // TODO: Check if the role is in the DB
    return true;
};

const getUserByUsername = async (username) => {
    const params = {
        UserPoolId: USER_POOL_ID,
        Username: username,
    };

    const identityProvider = getIdentityProvider();
    identityProvider.adminGetUser(params, (err, data) => {
        if (err) return null;
        return data;
    });
};

const getUserRoles = async (username) => {
    const user = await getUserByUsername(username);
    return parseUserSecurityRoles(user);
};

const createAttributeUpdateParams = (username, oldRoles, newRole) => {
    let roles = oldRoles.concat(newRoles);

    const params = {
        UserAttributes: [
            {
                Name: SECURITY_ROLE_ATTRIBUTE_NAME,
                Value: JSON.stringify(roles),
            },
        ],
        UserPoolId: USER_POOL_ID,
        Username: username,
    };

    return params;
};

// Gives a user a role
router.put(
    '/:username/roles/:roleName',
    errorWrap(async (req, res) => {
        const { username, roleName } = req.params;
        if (!isRoleValid(roleName)) {
            return res.status(400).json({
                success: false,
                message: 'The requested role is not valid',
            });
        }

        // TODO: We're gonna want to store roles in the DB. Once we do, make sure this is a valid role.
        const userRoles = await getUserRoles(username);
        const params = createAttributeUpdateParams(
            username,
            userRoles,
            roleName,
        );
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
                    message: 'Role successfully added',
                });
            },
        );
    }),
);

module.exports = router;
