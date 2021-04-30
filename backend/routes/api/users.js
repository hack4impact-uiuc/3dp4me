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
} = require('../../utils/aws/aws-exports');

const {
    parseUserSecurityRoles,
    RequireAdmin,
} = require('../../middleware/authentication');

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

const isRoleValid = async (role) => {
    const roles = await models.Role.find({});
    for (r of roles) {
        if (role.toString() === r._id.toString()) return true;
    }

    return false;
};

const getUserByUsername = async (username) => {
    const params = {
        UserPoolId: USER_POOL_ID,
        Username: username,
    };

    const identityProvider = getIdentityProvider();
    let user = null;
    try {
        user = await identityProvider.adminGetUser(params).promise();
    } catch (e) {
        console.log(e);
    }

    return user;
};

const getUserRoles = async (username) => {
    const user = await getUserByUsername(username);
    return parseUserSecurityRoles(user);
};

function arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) a.splice(j--, 1);
        }
    }

    return a;
}

/**
 * Removes invalid roles from the incoming roles array. For example, if a user has a role that is later deleted,
 * this will remove that old role from the user.
 */
const getValidRoles = async (roles) => {
    let validRoles = [];

    for (role of roles) {
        const roleIsValid = await isRoleValid(role);
        if (roleIsValid) validRoles.push(role);
    }

    return validRoles;
};

const createAttributeUpdateParams = (username, oldRoles, newRole) => {
    let roles = oldRoles;
    if (newRole) roles = arrayUnique(oldRoles.concat(newRole));

    let rolesStringified = JSON.stringify(roles);

    // AWS puts a hard limit on how many roles we can store
    if (rolesStringified.length > SECURITY_ROLE_ATTRIBUTE_MAX_LEN) return null;

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
    '/:username/roles/:roleId',
    errorWrap(async (req, res) => {
        const { username, roleId } = req.params;
        const roleIsValid = await isRoleValid(roleId);
        if (!roleIsValid) {
            return res.status(400).json({
                success: false,
                message: 'The requested role is not valid',
            });
        }

        const userRoles = await getUserRoles(username);
        const validUserRoles = await getValidRoles(userRoles);
        const params = createAttributeUpdateParams(
            username,
            validUserRoles,
            roleId,
        );

        if (!params) {
            return res.status(400).json({
                success: false,
                message:
                    'This user has reached the max amount of roles. They are not allowed to have any more.',
            });
        }

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

// Deletes user role
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
        const params = createAttributeUpdateParams(username, userRoles, null);

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

module.exports = router;
