import axios from 'axios';

import { getCurrentSession } from '../aws/aws-helper';

const FileDownload = require('js-file-download');

const IN_DEV_ENV =
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const BASE_URL = IN_DEV_ENV
    ? 'http://localhost:8080/api'
    : 'https://3dp4me-software.org/api';

const instance = axios.create({
    baseURL: BASE_URL,
    validateStatus: () => {
        return true;
    },
});

let cachedJWTToken = null;

const updateCachedJWTToken = async () => {
    const {
        accessToken: { jwtToken },
    } = await getCurrentSession();
    cachedJWTToken = jwtToken;
};

const addAuthHeader = async (config) => {
    const updatedConfig = config;

    // Grab the JWT token
    if (!cachedJWTToken) await updateCachedJWTToken();

    if (cachedJWTToken)
        updatedConfig.headers.Authorization = `Bearer ${cachedJWTToken}`;

    return updatedConfig;
};

const onRequestError = (error) => {
    // Set token to null so that we refetch token again on next request
    cachedJWTToken = null;
    return Promise.reject(error);
};

instance.interceptors.request.use(addAuthHeader, onRequestError);

export const getAllPatients = async () => {
    const requestString = '/patients';
    const res = await instance.get(requestString);
    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const getPatientsByStage = async (stage) => {
    const requestString = `/stages/${stage}`;
    const res = await instance.get(requestString);
    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const getPatientById = async (id) => {
    const requestString = `/patients/${id}`;
    const res = await instance.get(requestString);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const postNewPatient = async (patientInfo) => {
    const requestString = `/patients/`;
    const res = await instance.post(requestString, patientInfo);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const updateStage = async (patientId, stage, updatedStage) => {
    const requestString = `/patients/${patientId}/${stage}`;
    const res = await instance.post(requestString, updatedStage);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const updatePatient = async (patientId, updatedData) => {
    const requestString = `/patients/${patientId}`;
    const res = await instance.put(requestString, updatedData);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const getAllStepsMetadata = async () => {
    const requestString = '/metadata/steps';

    const res = await instance.get(requestString);
    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const downloadBlobWithoutSaving = async (
    patientId,
    stepKey,
    fieldKey,
    filename,
) => {
    const requestString = `/patients/${patientId}/files/${stepKey}/${fieldKey}/${filename}`;
    let res = null;

    try {
        res = await instance.get(requestString, {
            responseType: 'blob',
        });
    } catch (error) {
        console.error(error);
        return null;
    }

    if (!res) return null;

    return res.data;
};

export const downloadFile = async (patientId, stepKey, fieldKey, filename) => {
    const blob = await downloadBlobWithoutSaving(
        patientId,
        stepKey,
        fieldKey,
        filename,
    );

    if (!blob) throw new Error('Could not download file');

    try {
        await FileDownload(blob, filename);
    } catch (error) {
        throw new Error('Could not download file');
    }
};

export const uploadFile = async (
    patientId,
    stepKey,
    fieldKey,
    filename,
    filedata,
) => {
    const requestString = `/patients/${patientId}/files/${stepKey}/${fieldKey}/${filename}`;
    const formData = new FormData();
    formData.append('uploadedFile', filedata);
    formData.append('uploadedFileName', filename || filedata.name);

    const res = await instance.post(requestString, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const deleteFile = async (patientId, stepKey, fieldKey, filename) => {
    const requestString = `/patients/${patientId}/files/${stepKey}/${fieldKey}/${filename}`;
    const res = await instance.delete(requestString);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const getAllRoles = async () => {
    const requestString = `/roles`;
    const res = await instance.get(requestString);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const addUserRole = async (username, roleName) => {
    const requestString = `/users/${username}/roles/${roleName}`;
    const res = await instance.put(requestString);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const removeUserRole = async (username, roleName) => {
    const requestString = `/users/${username}/roles/${roleName}`;
    const res = await instance.delete(requestString);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const getAllUsers = async () => {
    const requestString = `/users`;
    const res = await instance.get(requestString);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const setUserAccess = async (username, access) => {
    const requestString = `/users/${username}/access/${access}`;
    const res = await instance.put(requestString);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};
