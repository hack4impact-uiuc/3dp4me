import axios from 'axios';

import { getCurrentSession } from '../aws/aws-helper';

const FileDownload = require('js-file-download');

const IN_DEV_ENV =
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const BASE_URL = IN_DEV_ENV
    ? 'http://localhost:8080/api'
    : 'https://3dp4me.vercel.app/api';

const instance = axios.create({
    baseURL: BASE_URL,
});

instance.interceptors.request.use(
    async (config) => {
        const configCopy = config;
        const {
            accessToken: { jwtToken },
        } = await getCurrentSession();
        if (jwtToken) {
            configCopy.headers.Authorization = `Bearer ${jwtToken}`;
        }
        return configCopy;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export const getAllPatients = async () => {
    const requestString = '/patients';
    const res = await instance.get(requestString);
    if (!res?.data?.success) throw res?.data?.message;

    return res.data;
};

export const getPatientsByStage = async (stage) => {
    const requestString = `/stages/${stage}`;
    const res = await instance.get(requestString);
    if (!res?.data?.success) throw res?.data?.message;

    return res.data;
};

export const getPatientById = async (id) => {
    const requestString = `/patients/${id}`;
    const res = await instance.get(requestString);

    if (!res?.data?.success) throw res?.data?.message;

    return res.data;
};

export const postNewPatient = async (patientInfo) => {
    const requestString = `/patients/`;
    const res = await instance.post(requestString, patientInfo);

    if (!res?.data?.success) throw res?.data?.message;

    return res.data;
};

export const updateStage = async (patientId, stage, updatedStage) => {
    const requestString = `/patients/${patientId}/${stage}`;
    const res = await instance.post(requestString, updatedStage);

    if (!res?.data?.success) throw res?.data?.message;

    return res.data;
};

export const getAllStepsMetadata = async () => {
    const requestString = '/metadata/steps';

    const res = await instance.get(requestString);
    if (!res?.data?.success) throw res?.data?.message;

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

    if (!blob) {
        console.error('Could not download file');
        return;
    }

    try {
        FileDownload(blob, filename);
    } catch (error) {
        console.error(error);
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

    return instance.post(requestString, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteFile = async (patientId, stepKey, fieldKey, filename) => {
    const requestString = `/patients/${patientId}/files/${stepKey}/${fieldKey}/${filename}`;
    return instance.delete(requestString);
};

export const addUserRole = async (username, roleName) => {
    const requestString = `/users/${username}/roles/${roleName}`;
    return instance.put(requestString);
};

export const removeUserRole = async (username, roleName) => {
    const requestString = `/users/${username}/roles/${roleName}`;
    return instance.delete(requestString);
};

export const getAllUsers = async () => {
    const requestString = `/users`;
    return instance.get(requestString);
};
