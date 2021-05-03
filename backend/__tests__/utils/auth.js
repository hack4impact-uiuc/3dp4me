const _ = require('lodash');
const { SECURITY_ROLE_ATTRIBUTE_NAME } = require('../../utils/aws/aws-exports');
const {
    MOCK_USER,
    MOCK_AUTH_TOKEN,
    MOCK_ROLE_ID,
} = require('../mock-data/auth-mock-data');

/**
 * Creates a user data object with the specified roles. The returned object is similar to what the AWS
 * auth service will return in production.
 * @param  {...String} roles Roles to add
 * @returns The user data
 */
module.exports.createUserDataWithRoles = (...roles) => {
    const user = _.cloneDeep(MOCK_USER);
    user.UserAttributes.push({
        Name: SECURITY_ROLE_ATTRIBUTE_NAME,
        Value: JSON.stringify(roles),
    });

    return user;
};

module.exports.initAuthMocker = (AWS) => {
    AWS.mock('CognitoIdentityServiceProvider', 'getUser', () => {
        return Promise.reject();
    });
};

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
