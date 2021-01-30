import axios from 'axios';

import { getCredentials, getCurrentSession } from '../aws/aws-helper';

const FileDownload = require('js-file-download');

const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
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
    const requestString = '/stages/';
    return instance.get(requestString).then(
        (res) => res.data,
        (err) => {
            console.error(err);
            return null;
        },
    );
};

export const getPatientsByStage = async (stage) => {
    const requestString = `/stages/${stage}`;
    return instance.get(requestString).then(
        (res) => res.data,
        (err) => {
            console.error(err);
            return null;
        },
    );
};

export const getPatientById = async (id) => {
    const requestString = `/patients/${id}`;
    return instance.get(requestString).then(
        (res) => res.data,
        (err) => {
            console.error(err);
            return null;
        },
    );
};

export const newPatient = async (patientInfo) => {
    const requestString = `/patients/`;
    return instance
        .post(requestString, patientInfo) // TODO: use AWS userId
        .then(
            (res) => res.data,
            (err) => {
                console.error(err);
                return null;
            },
        );
};

export const updateStage = async (patientId, stage, updatedStage) => {
    const requestString = `/patients/${patientId}/${stage}`;
    return instance
        .post(requestString, updatedStage) // TODO: use AWS userId
        .then(
            (res) => res.data,
            (err) => {
                console.error(err);
                return null;
            },
        );
};

export const downloadFile = async (patientId, stage, filename) => {
    const requestString = `/patients/${patientId}/${stage}/${filename}`;
    const {
        accessKeyId,
        secretAccessKey,
        sessionToken,
    } = await getCredentials();
    return instance
        .get(requestString, {
            headers: {
                accessKeyId,
                secretAccessKey,
                sessionToken,
            },
            responseType: 'blob',
        }) // TODO: use AWS userId
        .then(
            (res) => FileDownload(res.data, filename),
            (err) => {
                console.error(err);
                return null;
            },
        );
};

export const uploadFile = async (
    patientId,
    stage,
    filedata,
    filename = null,
) => {
    const requestString = `/patients/${patientId}/${stage}/file`;
    const credentials = await getCredentials();
    const formData = new FormData();
    formData.append('uploadedFile', filedata);
    formData.append('uploadedFileName', filename || filedata.name);
    Object.keys(credentials).forEach((key) => {
        formData.append(key, credentials[key]);
    });

    return instance.post(requestString, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const deleteFile = async (patientId, stage, filename) => {
    const requestString = `/patients/${patientId}/${stage}/${filename}`;
    return instance.delete(requestString);
};
