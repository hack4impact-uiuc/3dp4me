import { ObjectId } from 'mongoose';
import { RoleModel } from '../models/Role';
import {
    SECURITY_ROLE_ATTRIBUTE_MAX_LEN,
    SECURITY_ROLE_ATTRIBUTE_NAME,
    USER_POOL_ID,
} from './aws/awsExports';
import { AdminUpdateUserAttributesRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';

export const isRoleValid = async (role: string) => {
    const roles = await RoleModel.find({});
    for (let i = 0; i < roles.length; ++i) {
        if (role.toString() === roles[i]._id.toString()) return true;
    }

    return false;
};

/**
 * Removes invalid roles from the incoming roles array. For example, if a user has a role
 * that is later deleted, this will remove that old role from the user.
 */
export const getValidRoles = async (roles: string[]) => {
    const validRoles = [] as string[];

    const addRoles = roles.map(async (role) => {
        const roleIsValid = await isRoleValid(role);
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
export const createRoleUpdateParams = (username: string, oldRoles: string[], newRole: string | null): AdminUpdateUserAttributesRequest | null => {
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

function arrayUnique<T>(array: T[]) {
    const a = array.concat();
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) a.splice(j--, 1);
        }
    }

    return a;
}
