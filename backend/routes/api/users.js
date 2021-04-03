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

// Get all users
router.get(
    '/',
    errorWrap(async (req, res) => {
        var params = {
            UserPoolId: USER_POOL_ID,
        };

        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
            {
                region: COGNITO_REGION,
                accessKeyId: ACCESS_KEY_ID,
                secretAccessKey: SECRET_ACCESS_KEY,
            },
        );

        const data = await cognitoidentityserviceprovider.listUsers(
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
                    result: data,
                });
            },
        );
    }),
);

// Gives a user a role
router.put(
    '/:username/roles/:roleName',
    errorWrap(async (req, res) => {
        const { username, roleName } = req.params;
        // TODO: We're gonna want to store roles in the DB. Once we do, make sure this is a valid role.
        let roles = req.user.roles.concat(roleName);

        var params = {
            UserAttributes: [
                {
                    Name: SECURITY_ROLE_ATTRIBUTE_NAME,
                    Value: JSON.stringify(roles),
                },
            ],
            UserPoolId: USER_POOL_ID,
            Username: username,
        };

        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider(
            {
                region: COGNITO_REGION,
                accessKeyId: ACCESS_KEY_ID,
                secretAccessKey: SECRET_ACCESS_KEY,
            },
        );

        await cognitoidentityserviceprovider.adminUpdateUserAttributes(
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
