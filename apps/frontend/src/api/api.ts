import { BasePatient, Nullish, OmitDeep, Patient, Role, Step } from '@3dp4me/types'
import { CognitoIdentityServiceProvider } from 'aws-sdk'
import fileDownload from 'js-file-download'

import instance from './axios-config'

export type ApiResponse<T> = {
    success: boolean
    message: string
    result: T
}

export type Paginated<T> = {
    data: T
    count: number
}

export const getPatientsCount = async (): Promise<ApiResponse<number>> => {
    const requestString = '/patients/count'
    const res = await instance.get(requestString)
    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const getPatientsByPageNumberAndSearch = async (
    pageNumber: number,
    nPerPage: number,
    searchQuery = ''
): Promise<ApiResponse<Paginated<Patient[]>>> => {
    const requestString = `/patients?pageNumber=${pageNumber}&nPerPage=${nPerPage}&searchQuery=${searchQuery}`
    const res = await instance.get(requestString)
    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const getPatientsByStageAndPageNumberAndSearch = async (
    stage: string,
    pageNumber: number,
    nPerPage: number,
    searchQuery = ''
): Promise<ApiResponse<Paginated<Patient[]>>> => {
    const requestString = `/stages/${stage}?pageNumber=${pageNumber}&nPerPage=${nPerPage}&searchQuery=${searchQuery}`
    const res = await instance.get(requestString)
    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const getPatientById = async (id: string): Promise<ApiResponse<Patient>> => {
    const requestString = `/patients/${id}`
    const res = await instance.get(requestString)

    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const postNewPatient = async (
    patientInfo: OmitDeep<BasePatient, '_id'>
): Promise<ApiResponse<Patient>> => {
    const requestString = `/patients/`
    const res = await instance.post(requestString, patientInfo)

    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const updateStage = async (
    patientId: string,
    stage: string,
    updatedStage: Record<string, any>
): Promise<ApiResponse<Step>> => {
    const requestString = `/patients/${patientId}/${stage}`
    console.log("POSTING ", stage, " ", updatedStage)
    const res = await instance.post(requestString, updatedStage)

    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const updatePatient = async (
    patientId: string,
    updatedData: Partial<Patient>
): Promise<ApiResponse<Patient>> => {
    console.log("PUT ", updatedData)
    const requestString = `/patients/${patientId}`
    const res = await instance.put(requestString, updatedData)

    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const deletePatientById = async (patientId: string): Promise<ApiResponse<Patient>> => {
    const requestString = `/patients/${patientId}`
    const res = await instance.delete(requestString)

    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const getAllStepsMetadata = async (
    showHiddenFieldsAndSteps = false,
    showReservedSteps = false
): Promise<ApiResponse<Step[]>> => {
    const requestString = `/metadata/steps?showHiddenFields=${showHiddenFieldsAndSteps}&showHiddenSteps=${showHiddenFieldsAndSteps}&showReservedSteps=${showReservedSteps}`

    /**
     * In order to test this method and its steps, hardcode an entire object (subFields, displayName, etc.) from the database
     * and push it to res.data.result[0].fields
     */
    const res = await instance.get(requestString)
    if (!res?.data?.success) throw new Error(res?.data?.message)
    return res.data
}

export const updateMultipleSteps = async (updatedSteps: Step[]): Promise<ApiResponse<Step[]>> => {
    const requestString = '/metadata/steps'

    const res = await instance.put(requestString, updatedSteps)
    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const downloadBlobWithoutSaving = async (
    patientId: string,
    stepKey: string,
    fieldKey: string,
    filename: string
): Promise<Nullish<Blob>> => {
    const requestString = `/patients/${patientId}/files/${stepKey}/${fieldKey}/${filename}`
    let res = null

    try {
        res = await instance.get(requestString, {
            responseType: 'blob',
        })
    } catch (error) {
        console.error(error)
        return null
    }

    if (!res) return null

    return res.data
}

export const downloadFile = async (
    patientId: string,
    stepKey: string,
    fieldKey: string,
    filename: string
) => {
    const blob = await downloadBlobWithoutSaving(patientId, stepKey, fieldKey, filename)

    if (!blob) throw new Error('Could not download file')

    try {
        await fileDownload(blob, filename)
    } catch (error) {
        throw new Error('Could not download file')
    }
}

export const uploadFile = async (
    patientId: string,
    stepKey: string,
    fieldKey: string,
    filename: string,
    filedata: File
) => {
    const requestString = `/patients/${patientId}/files/${stepKey}/${fieldKey}/${filename}`
    const formData = new FormData()
    formData.append('uploadedFile', filedata)
    formData.append('uploadedFileName', filename || filedata.name)

    const res = await instance.post(requestString, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })

    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const uploadSignatureDocument = async (filename: string, filedata: File) => {
    const requestString = `/public/upload/signatureDocument`
    const formData = new FormData()
    formData.append('uploadedFile', filedata)
    formData.append('uploadedFileName', filename || filedata.name)

    const res = await instance.post(requestString, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })

    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const deleteFile = async (
    patientId: string,
    stepKey: string,
    fieldKey: string,
    filename: string
) => {
    const requestString = `/patients/${patientId}/files/${stepKey}/${fieldKey}/${filename}`
    const res = await instance.delete(requestString)

    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const getAllRoles = async () => {
    const requestString = `/roles`
    const res = await instance.get(requestString)
    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const addRole = async (roleInfo: Partial<Role>) => {
    const requestString = `/roles`
    const res = await instance.post(requestString, roleInfo)
    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const deleteRole = async (userId: string) => {
    const requestString = `/roles/${userId}`
    const res = await instance.delete(requestString)
    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const editRole = async (userId: string, updatedRoleInfo: Partial<Role>) => {
    const requestString = `/roles/${userId}`
    const res = await instance.put(requestString, updatedRoleInfo)
    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

// TODO: test endpoint or create issue for it
export const deleteUser = async (username: string) => {
    const requestString = `/users/${username}`
    const res = await instance.delete(requestString)
    if (!res?.data?.success) throw new Error(res?.data?.message)
    return res.data
}

export const addUserRole = async (username: string, roleName: string) => {
    const requestString = `/users/${username}/roles/${roleName}`
    const res = await instance.put(requestString)

    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const removeUserRole = async (username: string, roleName: string) => {
    const requestString = `/users/${username}/roles/${roleName}`
    const res = await instance.delete(requestString)

    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const getUsersByPageNumber = async (
    nPerPage: number
): Promise<ApiResponse<CognitoIdentityServiceProvider.ListUsersResponse>> => {
    const requestString = `/users?nPerPage=${nPerPage}`

    const res = await instance.get(requestString)

    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const getUsersByPageNumberAndToken = async (
    token: string,
    nPerPage: number
): Promise<ApiResponse<CognitoIdentityServiceProvider.ListUsersResponse>> => {
    const encodedToken = encodeURIComponent(token)
    const requestString = `/users?token=${encodedToken}&nPerPage=${nPerPage}`

    const res = await instance.get(requestString)

    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const setUserAccess = async (username: string, access: string) => {
    const requestString = `/users/${username}/access/${access}`
    const res = await instance.put(requestString)

    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}

export const getSelf = async (): Promise<ApiResponse<{ isAdmin: boolean }>> => {
    const requestString = `/users/self`
    const res = await instance.get(requestString)

    if (!res?.data?.success) throw new Error(res?.data?.message)

    return res.data
}
