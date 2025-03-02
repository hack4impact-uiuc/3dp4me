import { AdminUpdateUserAttributesCommandInput } from '@aws-sdk/client-cognito-identity-provider'

import { RoleModel } from '../models/Role'
import {
    SECURITY_ROLE_ATTRIBUTE_MAX_LEN,
    SECURITY_ROLE_ATTRIBUTE_NAME,
    USER_POOL_ID,
} from './aws/awsExports'
import { Patient, ReservedStep, Role, RootStepFieldKeys } from '@3dp4me/types'
import { AuthenticatedUser } from './aws/types'
import { PatientModel } from 'models/Patient'
import { StepModel } from 'models/Metadata'
import mongoose from 'mongoose'
import { isAdmin } from './aws/awsUsers'

export const isRoleValid = async (role: string) => {
    const roles = await RoleModel.find({})
    for (let i = 0; i < roles.length; ++i) {
        if (role.toString() === roles[i]._id.toString()) return true
    }

    return false
}

/**
 * Removes invalid roles from the incoming roles array. For example, if a user has a role
 * that is later deleted, this will remove that old role from the user.
 */
export const getValidRoles = async (roles: string[]) => {
    const validRoles = [] as string[]

    const addRoles = roles.map(async (role) => {
        const roleIsValid = await isRoleValid(role)
        if (roleIsValid) validRoles.push(role)
    })

    await Promise.all(addRoles)

    return validRoles
}

/**
 * Creates the AWS parameters to perform a role update on the user.
 * @param {String} username The username of the user to update.
 * @param {Array} oldRoles Array of IDs of the user's current roles.
 * @param {Array} newRole Array of IDs of the user's new roles to add.
 * @returns The update parameter.
 */
export const createRoleUpdateParams = (
    username: string,
    oldRoles: string[],
    newRole: string | null
): AdminUpdateUserAttributesCommandInput | null => {
    let roles = oldRoles
    if (newRole) roles = arrayUnique(oldRoles.concat(newRole))

    const rolesStringified = JSON.stringify(roles)

    // AWS puts a hard limit on how many roles we can store
    if (rolesStringified.length > SECURITY_ROLE_ATTRIBUTE_MAX_LEN) return null

    const params = {
        UserAttributes: [
            {
                Name: SECURITY_ROLE_ATTRIBUTE_NAME,
                Value: JSON.stringify(roles),
            },
        ],
        UserPoolId: USER_POOL_ID,
        Username: username,
    }

    return params
}

export const canUserAccessAllPatients = async (
    user: AuthenticatedUser
) => {
    if (isAdmin(user)) return true

    const roles = await RoleModel.find({ _id: { $in: user.roles } })
    if (!roles) return false

    return roles.some((role) => {
        return role.patientTags.length === 0
    })
}

export const canUserAccessPatient = async (
    user: AuthenticatedUser,
    patientId: string,
) => {
    if (isAdmin(user)) return true

    // Get all patient data for this step
    const rootPatientData = await mongoose
        .model(ReservedStep.Root)
        .findOne({ patientId: patientId })
        .lean();

    if (!rootPatientData) {
        return false
    }

    const patientTags = rootPatientData[RootStepFieldKeys.Tags] || []
    const rolePromises = user.roles.map(r => canRoleAccessPatientTags(r, patientTags))
    const roleResults = await Promise.all(rolePromises)
    return roleResults.some(r => r)
}

export const canRoleAccessPatientTags = async (
    roleId: string,
    patientTags: string[],
) => {
    const role = await RoleModel.findById(roleId)
    if (!role) {
        return false
    }

    // No tags on the role means it can access all patients
    if (!role.patientTags || role.patientTags.length === 0) {
        return true
    }

    return role.patientTags.some(tag => patientTags.includes(tag))
}

function arrayUnique<T>(array: T[]) {
    const a = array.concat()
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) a.splice(j--, 1)
        }
    }

    return a
}