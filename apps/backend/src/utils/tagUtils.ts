import { ReservedStep } from '@3dp4me/types'
import mongoose from 'mongoose'

import { PatientModel } from '../models/Patient'
import { RoleModel } from '../models/Role'
import { AuthenticatedUser } from './aws/types'
import { canUserAccessAllPatients } from './roleUtils'

export const getPatientsCount = async (user: AuthenticatedUser) => {
    const allIds = await getPatientIdsUserCanAccess(user)
    return allIds.length
}

export const getPatientIdsUserCanAccess = async (user: AuthenticatedUser) => {
    const canAccessAll = await canUserAccessAllPatients(user)
    if (canAccessAll) {
        const allPatients = await PatientModel.find().select('_id')
        return allPatients.map((p) => p._id as string)
    }

    const allTags = await getTagsUserCanAccess(user)
    const patients = await mongoose
        .model(ReservedStep.Root)
        .find({ tags: { $in: allTags } })
        .find()
        .select('patientId')
        .lean()

    return patients.map((p) => p.patientId as string)
}

export const getTagsUserCanAccess = async (user: AuthenticatedUser) => {
    // Only return patients that the user has access to
    const allRoles = await RoleModel.find({ _id: { $in: user.roles } }).lean()
    return allRoles.map((r) => r.patientTags).reduceRight((acc, val) => acc.concat(val), [])
}
