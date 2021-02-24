import axios from 'axios';

import { getCredentials, getCurrentSession } from '../aws/aws-helper';
import { allStepMetadata, patientData } from './mock-data';

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
    return patientData;
    // TODO: Uncomment this when the backend is ready for the new data format
    // const requestString = `/patients/${id}`;
    // return instance.get(requestString).then(
    //     (res) => res.data,
    //     (err) => {
    //         console.error(err);
    //         return null;
    //     },
    // );
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

export const getStepMetadata = async (stepKey) => {
    // TODO: Replace with backend call
    let stepData = null;

    allStepMetadata.forEach((step) => {
        if (step.key === stepKey) stepData = step;
    });

    return stepData;
};

// export const getStepData = async (stepKey, patientId) => {
//     // TODO: Replace with backend call
//     if (stepKey == 'info') return infoData[0];
//     else return cadData[0];
// };

export const getAllStepsMetadata = async () => {
    // TODO: Replace with backend call
    return allStepMetadata;
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
