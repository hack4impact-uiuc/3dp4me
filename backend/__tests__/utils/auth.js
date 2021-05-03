const _ = require('lodash');
const { SECURITY_ROLE_ATTRIBUTE_NAME } = require('../../utils/aws/aws-exports');
const { MOCK_USER } = require('../mock-data/auth-mock-data');

module.exports.createUserDataWithRoles = (...roles) => {
    const user = _.cloneDeep(MOCK_USER);
    user.UserAttributes.push({
        Name: SECURITY_ROLE_ATTRIBUTE_NAME,
        Value: JSON.stringify(roles),
    });

    return user;
};
