import { Nullish, Patient } from '@3dp4me/types'
import { Response } from 'express'
import logger from 'loglevel'
import { AuthenticatedRequest } from 'middleware/types'
import { HydratedDocument } from 'mongoose'

import { PatientModel } from '../models/Patient'
import { DEFAULT_PATIENTS_ON_GET_REQUEST } from './constants'
import { queryParamToNum, queryParamToString } from './request'
import { canUserAccessAllPatients } from './roleUtils'
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
) => {
    const resp = {
        success: isCodeSuccessful(code),
        message,
        result: data,
    }

    logger.debug('Sending response', JSON.stringify(resp, null, 2))
    return res.status(code).json(resp)
}

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
 * @param {JSON} findParameters Parameters for db.collection.find().
 * @returns {Object} data Documents recieved from db.collection.find()
 */
// eslint-disable-next-line max-len
export const getPatients = async (
    req: AuthenticatedRequest,
    findParameters = {}
): Promise<{ data: HydratedDocument<Patient>[]; count: number }> => {
    // The default values below will get the first user in the database
    const {
        pageNumber = 1,
        nPerPage = DEFAULT_PATIENTS_ON_GET_REQUEST,
        searchQuery = '',
    } = req.query
    let patientParams = findParameters
    const intPageNumber = queryParamToNum(pageNumber)
    const intPatientsPerPage = queryParamToNum(nPerPage)
    const lowerCaseSearchQuery = queryParamToString(searchQuery).toLowerCase()

    // Calculates the number of patients to skip based on the request paramaters
    const documentsToSkip = intPageNumber > 0 ? (intPageNumber - 1) * intPatientsPerPage : 0

    const canAccessAll = await canUserAccessAllPatients(req.user)
    if (!canAccessAll) {
        const patientIds = await getPatientIdsUserCanAccess(req.user)
        patientParams = {
            $and: [
                findParameters,
                {
                    _id: { $in: patientIds },
                },
            ],
        }
    }

    // Perform pagination while doing .find() if there isn't a search query
    if (lowerCaseSearchQuery === '') {
        const patientCount = await getPatientsCount(req.user)
        const data = await PatientModel.find(patientParams)
            .sort({ lastEdited: -1 })
            .skip(documentsToSkip)
            .limit(intPatientsPerPage)

        return {
            data,
            count: patientCount,
        }
    }

    const data = await PatientModel.find(patientParams).sort({ lastEdited: -1 })

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
