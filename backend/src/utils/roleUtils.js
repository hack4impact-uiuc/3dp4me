const { models } = require('../models');

const {
    SECURITY_ROLE_ATTRIBUTE_MAX_LEN,
    SECURITY_ROLE_ATTRIBUTE_NAME,
    USER_POOL_ID,
} = require('./aws/awsExports');

module.exports.isRoleValid = async (role) => {
    const roles = await models.Role.find({});
    for (let i = 0; i < roles.length; ++i) {
        if (role.toString() === roles[i]._id.toString()) return true;
    }

    return false;
};

/**
 * Removes invalid roles from the incoming roles array. For example, if a user has a role
 * that is later deleted, this will remove that old role from the user.
 */
module.exports.getValidRoles = async (roles) => {
    const validRoles = [];

    const addRoles = roles.map(async (role) => {
        const roleIsValid = await this.isRoleValid(role);
        if (roleIsValid) validRoles.push(role);
    });

    await Promise.all(addRoles);

    return validRoles;
};

/**
 * Creates the AWS parameters to perform a role update on the user.
 * @param {String} username The username of the user to update.
 * @param {Array} oldRoles Array of IDs of the user's current roles.
 * @param {Array} newRole Array of IDs of the user's new roles to add.
 * @returns The update parameter.
 */
module.exports.createRoleUpdateParams = (username, oldRoles, newRole) => {
    let roles = oldRoles;
    if (newRole) roles = arrayUnique(oldRoles.concat(newRole));

    const rolesStringified = JSON.stringify(roles);

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

function arrayUnique(array) {
    const a = array.concat();
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) a.splice(j--, 1);
        }
    }

    return a;
}
