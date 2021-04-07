const express = require('express');
const router = express.Router();
const { errorWrap } = require('../../utils');
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

// TODO: Test this
const isRoleValid = async (role) => {
    const roles = await models.Role.find({}).toArray();
    roles.forEach((r) => {
        if (role._id == r._id) return true;
    });

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

const createAttributeUpdateParams = (username, oldRoles, newRole) => {
    let roles = arrayUnique(oldRoles.concat(newRole));

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
        const roleIsValid = await isRoleValid(roleName);
        if (!roleIsValid) {
            return res.status(400).json({
                success: false,
                message: 'The requested role is not valid',
            });
        }

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
