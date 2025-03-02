import { Nullish } from '@3dp4me/types'
import { Request, Response } from 'express'
import { HydratedDocument, Model } from 'mongoose'

import { DEFAULT_PATIENTS_ON_GET_REQUEST } from './constants'
import { queryParamToNum, queryParamToString } from './request'
import { canUserAccessAllPatients } from './roleUtils'
import { AuthenticatedRequest } from 'middleware/types'
import { getPatientIdsUserCanAccess, getPatientsCount } from './tagUtils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RespData = Record<string, any>

/**
 * Convienience function for sending responses.
 * @param {Object} res The response object
 * @param {Number} code The HTTP response code to send
 * @param {String} message The message to send.
 * @param {Object} data The optional data to send back.
 */
export const sendResponse = (
    res: Response,
    code: number,
    message: string,
    data?: Nullish<RespData | number>
) =>
    res.status(code).json({
        success: isCodeSuccessful(code),
        message,
        result: data,
    })

/**
 * Removes patients whose name, phone nunber, or unique _id contains the searchQuery
 * @param {List} patients A list of patients
 * @param {String} searchQuery A word or phrase related to a specific patient/group of patients
 * @returns a List containing the filtering patients
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
const filterPatientsBySearchQuery = <T extends Record<string, any>>(
    patients: T[],
    searchQuery: string
): T[] => {
    if (searchQuery === '') {
        return patients
    }

    const filteredData: T[] = []

    if (searchQuery !== '') {
        /* The following fields below will be considered during the search.
           All of the fields are encrypted in the database.
           If the data associated with any one of these fields
           contains the search query, we will return it. */
        const fieldsToCheckList = [
            '_id',
            'firstName',
            'fathersName',
            'grandfathersName',
            'familyName',
            'phoneNumber',
            'orderId',
        ]

        for (let dataIdx = 0; dataIdx < patients.length; dataIdx++) {
            for (let fieldsIdx = 0; fieldsIdx < fieldsToCheckList.length; fieldsIdx++) {
                const fieldToCheck = fieldsToCheckList[fieldsIdx]
                const patientDataByField = patients[dataIdx][fieldToCheck] || ''
                if (patientDataByField.toString().toLowerCase().includes(searchQuery)) {
                    filteredData.push(patients[dataIdx])
                    break
                }
            }
        }
    }
    return filteredData
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Convienience function getting data from a model with pagination
 * @param {Obect} req The request object
 * @param {MongoDB Collection} model The mongoDB model
 * @param {JSON} findParameters Parameters for db.collection.find().
 * @returns {Object} data Documents recieved from db.collection.find()
 */
// eslint-disable-next-line max-len
export const getDataFromModelWithPaginationAndSearch = async <T>(
    req: AuthenticatedRequest,
    model: Model<T>,
    findParameters = {}
): Promise<{ data: HydratedDocument<T>[]; count: number }> => {
    // The default values below will get the first user in the database
    const {
        pageNumber = 1,
        nPerPage = DEFAULT_PATIENTS_ON_GET_REQUEST,
        searchQuery = '',
    } = req.query
    const intPageNumber = queryParamToNum(pageNumber)
    const intPatientsPerPage = queryParamToNum(nPerPage)
    const lowerCaseSearchQuery = queryParamToString(searchQuery).toLowerCase()

    // Calculates the number of patients to skip based on the request paramaters
    const documentsToSkip = intPageNumber > 0 ? (intPageNumber - 1) * intPatientsPerPage : 0


    const canAccessAll = await canUserAccessAllPatients(req.user)
    if (!canAccessAll) {
        const patientIds = await getPatientIdsUserCanAccess(req.user)
        findParameters  = {
            ...findParameters,
            $in: {
                patientId: { $in: patientIds }
            }
        }
    }

    // Only return patients that the user has access to
    // const allRoles = await Role.find({ _id: { $in: user.roles } }).lean()
    // const allTags = await getTags
    // allRoles.map(r => r.patientTags).reduceRight((acc, val) => acc.concat(val), [])
    // // return PatientModel.find({ tags: { $in: allTags } }).count();

    // Perform pagination while doing .find() if there isn't a search query
    if (lowerCaseSearchQuery === '') {
        const patientCount = await getPatientsCount(req.user)
        const data = await model
            .find(findParameters)
            .sort({ lastEdited: -1 })
            .skip(documentsToSkip)
            .limit(intPatientsPerPage)

        return {
            data,
            count: patientCount,
        }
    }

    const data = await model.find(findParameters).sort({ lastEdited: -1 })

    // Filter by search
    const filteredData = filterPatientsBySearchQuery(data, lowerCaseSearchQuery)

    // Filter by page number
    const countTotalPatients = filteredData.length

    const paginatedData = filteredData.splice(documentsToSkip, intPatientsPerPage)

    return {
        data: paginatedData,
        count: countTotalPatients,
    }
}

const isCodeSuccessful = (code: number) => code >= 200 && code < 300
