const _ = require('lodash');
const AWS_SDK = require('aws-sdk');

const {
    SECURITY_ROLE_ATTRIBUTE_NAME,
    SECURITY_ACCESS_ATTRIBUTE_NAME,
} = require('../../utils/aws/awsExports');
const { MOCK_USER, MOCK_AUTH_TOKEN } = require('../mock-data/auth-mock-data');
const { ACCESS_LEVELS, ADMIN_ID } = require('../../utils/constants');

let currentAuthenticatedUser = null;
let lastUploadedFileParams = null;
let identityServiceParams = null;

/**
 * Creates a user data object with the specified roles. The returned object is similar to what the AWS
 * auth service will return in production.
 * @param  {...String} roles Roles to add
 * @returns The user data
 */
module.exports.createUserDataWithRolesAndAccess = (access, ...roles) => {
    const user = _.cloneDeep(MOCK_USER);
    currentAuthenticatedUser = user;
    user.UserAttributes.push({
        Name: SECURITY_ROLE_ATTRIBUTE_NAME,
        Value: JSON.stringify(roles),
    });

    user.UserAttributes.push({
        Name: SECURITY_ACCESS_ATTRIBUTE_NAME,
        Value: access,
    });

    return user;
};

/**
 * Initializes the auth mocker. Must be called onece before all tests.
 * @param {Object} AWS The AWS mocker. An instance of this object can be created with `const AWS = require('aws-sdk-mock')`
 */
module.exports.initAuthMocker = (AWS) => {
    AWS.setSDKInstance(AWS_SDK);
    AWS.mock('CognitoIdentityServiceProvider', 'getUser', () =>
        Promise.reject(),
    );
};

/**
 * Initializes the auth mocker for getting the list of users. Must be called once before all tests.
 * @param {Object} AWS The AWS mocker. An instance of this object can be created with `const AWS = require('aws-sdk-mock')`
 */
module.exports.initIdentityServiceMocker = (AWS) => {
    AWS.mock('CognitoIdentityServiceProvider', 'listUsers', (params) => {
        identityServiceParams = params;
        return Promise.resolve();
    });
};

/**
 * Initializes the file upload. Must be called once before all tests.
 * @param {Object} AWS The AWS mocker. An instance of this object can be created with `const AWS = require('aws-sdk-mock')`
 */
module.exports.initS3Mocker = (AWS) => {
    AWS.mock('S3', 'putObject', (params) => {
        lastUploadedFileParams = params;
        return Promise.resolve();
    });
};

module.exports.initS3GetMocker = (AWS) => {
    path = require('path');
    AWS.mock(
        'S3',
        'getObject',
        Buffer.from(
            require('fs').readFileSync(
                path.resolve(__dirname, '../mock-data/test.csv'),
            ),
        ),
    );
};

module.exports.initS3DeleteObjectMocker = (AWS) => {
    AWS.mock('S3', 'deleteObject', (params) => {
        return Promise.resolve();
    });
};

module.exports.initS3ListObjectsV2Mocker = (AWS) => {
    AWS.mock('S3', 'listObjectsV2', (params) => {
        return Promise.resolve({
            Contents: []
        });
    });
};

module.exports.initS3DeleteObjectsMocker = (AWS) => {
    AWS.mock('S3', 'deleteObjects', (params) => {
        return Promise.resolve();
    });
};

/**
 * Mocks the Cognito Identity Service Provider so that whenever the server queries for the current user, a static
 * user is returned.
 * @param {Object} AWS The AWS mocker. An instance of this object can be created with `const AWS = require('aws-sdk-mock')`
 * @param {Object} user This is the user data that will be returned every time. If the parameter is not provided, a default user with
 *                      sufficient permission to authenticate into the application will be set.
 */
module.exports.setCurrentUser = (
    AWS,
    user = this.createUserDataWithRolesAndAccess(
        ACCESS_LEVELS.GRANTED,
        ADMIN_ID,
    ),
) => {
    AWS.remock('CognitoIdentityServiceProvider', 'getUser', () =>
        Promise.resolve(user),
    );
};

/**
 * Sets up the supertest and AWS mock objects so that authentication will succeed. Should be called at the beginning
 * at every test for
 * @param {*} request
 * @param {*} AWSMocker
 */
module.exports.withAuthentication = (request) =>
    request.set({
        authorization: MOCK_AUTH_TOKEN,
    });

module.exports.getCurrentAuthenticatedUser = () => currentAuthenticatedUser;

module.exports.getCurrentAuthenticatedUserAttribute = (attribName) =>
    currentAuthenticatedUser.UserAttributes.find(
        (attrib) => attrib.Name === attribName,
    ).Value;

module.exports.getLastUploadedFileParams = () => lastUploadedFileParams;
module.exports.identityServiceParams = () => identityServiceParams;
