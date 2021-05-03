const _ = require('lodash');
const { SECURITY_ROLE_ATTRIBUTE_NAME } = require('../../utils/aws/aws-exports');
const { MOCK_USER } = require('../mock-data/auth-mock-data');

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

/**
 * Sets up the supertest and AWS mock objects so that authentication will succeed. Should be called at the beginning
 * at every test for
 * @param {*} request
 * @param {*} AWSMocker
 */
module.exports.mockAuthAsDefaultUser = (request, AWSMocker) => {
    request.set({
        authorization: MOCK_AUTH_TOKEN,
    });

    AWSMocker.restoreAllServices();
    AWSMocker.mock('CognitoIdentityServiceProvider', 'getUser', () => {
        const MOCK_ROLE_ID = '606e0a4602b23d02bc77673b';
        return Promise.resolve(createUserDataWithRoles(MOCK_ROLE_ID));
    });
};
