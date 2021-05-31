const _ = require('lodash');
const { SECURITY_ROLE_ATTRIBUTE_NAME } = require('../../utils/aws/aws-exports');
const {
    MOCK_USER,
    MOCK_AUTH_TOKEN,
    MOCK_ROLE_ID,
} = require('../mock-data/auth-mock-data');

let currentAuthenticatedUser = null;
let lastUploadedFileParams = null;

/**
 * Creates a user data object with the specified roles. The returned object is similar to what the AWS
 * auth service will return in production.
 * @param  {...String} roles Roles to add
 * @returns The user data
 */
module.exports.createUserDataWithRoles = (...roles) => {
    const user = _.cloneDeep(MOCK_USER);
    currentAuthenticatedUser = user;
    user.UserAttributes.push({
        Name: SECURITY_ROLE_ATTRIBUTE_NAME,
        Value: JSON.stringify(roles),
    });

    return user;
};

/**
 * Initializes the auth mocker. Must be called onece before all tests.
 * @param {Object} AWS The AWS mocker. An instance of this object can be created with `const AWS = require('aws-sdk-mock')`
 */
module.exports.initAuthMocker = (AWS) => {
    AWS.mock('CognitoIdentityServiceProvider', 'getUser', () => {
        return Promise.reject();
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

/**
 * Mocks the Cognito Identity Service Provider so that whenever the server queries for the current user, a static
 * user is returned.
 * @param {Object} AWS The AWS mocker. An instance of this object can be created with `const AWS = require('aws-sdk-mock')`
 * @param {Object} user This is the user data that will be returned every time. If the parameter is not provided, a default user with
 *                      sufficient permission to authenticate into the application will be set.
 */
module.exports.setCurrentUser = (
    AWS,
    user = this.createUserDataWithRoles(MOCK_ROLE_ID),
) => {
    AWS.remock('CognitoIdentityServiceProvider', 'getUser', () => {
        return Promise.resolve(user);
    });
};

/**
 * Sets up the supertest and AWS mock objects so that authentication will succeed. Should be called at the beginning
 * at every test for
 * @param {*} request
 * @param {*} AWSMocker
 */
module.exports.withAuthentication = (request) => {
    return request.set({
        authorization: MOCK_AUTH_TOKEN,
    });
};

module.exports.getCurrentAuthenticatedUser = () => {
    return currentAuthenticatedUser;
};

module.exports.getCurrentAuthenticatedUserAttribute = (attribName) => {
    return currentAuthenticatedUser.UserAttributes.find(
        (attrib) => attrib.Name === attribName,
    ).Value;
};

module.exports.getLastUploadedFileParams = () => {
    return lastUploadedFileParams;
};
