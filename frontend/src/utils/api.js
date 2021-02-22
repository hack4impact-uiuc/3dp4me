import axios from 'axios';

import { getCredentials, getCurrentSession } from '../aws/aws-helper';

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

export const getStepMetadata = async (stepKey) => {
    return (await getAllStepsMetadata())[1];
};

export const getStepData = async (stepKey, patientId) => {
    return {
        firstName: 'Firstname',
        lastName: 'Lastname',
        notes: 'No notes',
        jordanSSN: 12345678,
        dob: new Date(),
        phone: '847 123-4567',
        status: 'unfinished',
        leftEarscan: [
            {
                fileName: 'LeftEarscan.STP',
                uploadedBy: 'User',
                uploadedDate: new Date(),
            },
        ],
    };
};

export const getAllStepsMetadata = async () => {
    return [
        {
            key: 'pateintInfo',
            displayName: { EN: 'PatientInfo', AR: 'معلومات المريض' },
            stepNumber: 1,
            fields: [
                {
                    key: 'patientDivider',
                    fieldType: 'Divider',
                    displayName: { EN: 'Patient', AR: 'لومات ا' },
                    fieldNumber: 0,
                    isVisibleOnDashboard: false,
                },
                {
                    key: 'firstName',
                    fieldType: 'String',
                    displayName: { EN: 'First Name', AR: 'لومات ا' },
                    fieldNumber: 1,
                    isVisibleOnDashboard: true,
                },
                {
                    key: 'notes',
                    fieldType: 'MultilineString',
                    displayName: { EN: 'Notes', AR: 'لومات ا' },
                    fieldNumber: 11,
                    isVisibleOnDashboard: false,
                },
                {
                    key: 'lastName',
                    fieldType: 'String',
                    displayName: { EN: 'Last Name', AR: 'لومات ا' },
                    fieldNumber: 2,
                    isVisibleOnDashboard: true,
                },
                {
                    key: 'jordanSSN',
                    fieldType: 'String',
                    displayName: { EN: 'Jordan SSN', AR: 'لومات ا' },
                    fieldNumber: 3,
                    isVisibleOnDashboard: false,
                },
                {
                    key: 'dob',
                    fieldType: 'Date',
                    displayName: { EN: 'DOB', AR: 'لومات ا' },
                    fieldNumber: 4,
                    isVisibleOnDashboard: false,
                },
                {
                    key: 'phone',
                    fieldType: 'Phone',
                    displayName: { EN: 'Phone', AR: 'لومات ا' },
                    fieldNumber: 5,
                    isVisibleOnDashboard: false,
                },
                {
                    key: 'emContact',
                    fieldType: 'Header',
                    displayName: { EN: 'Emergency Contact', AR: 'لومات ا' },
                    fieldNumber: 6,
                    isVisibleOnDashboard: false,
                },
                {
                    key: 'emContactName',
                    fieldType: 'String',
                    displayName: { EN: 'Name', AR: 'لومات ا' },
                    fieldNumber: 7,
                    isVisibleOnDashboard: false,
                },
                {
                    key: 'emRelationship',
                    fieldType: 'String',
                    displayName: { EN: 'Relationship', AR: 'لومات ا' },
                    fieldNumber: 8,
                    isVisibleOnDashboard: false,
                },
                {
                    key: 'emPhone',
                    fieldType: 'Phone',
                    displayName: { EN: 'Phone', AR: 'لومات ا' },
                    fieldNumber: 9,
                    isVisibleOnDashboard: false,
                },
                {
                    key: 'infoDivider',
                    fieldType: 'Divider',
                    displayName: { EN: 'Information', AR: 'لومات ا' },
                    fieldNumber: 10,
                    isVisibleOnDashboard: false,
                },
            ],
        },
        {
            key: 'cadModel',
            displayName: { EN: 'CAD Modeling', AR: 'معلومات المريض' },
            stepNumber: 2,
            fields: [
                {
                    key: 'firstName',
                    fieldType: 'String',
                    displayName: { EN: 'First Name', AR: 'لومات ا' },
                    fieldNumber: 1,
                    isVisibleOnDashboard: true,
                },
                {
                    key: 'fileSizeKb',
                    fieldType: 'Number',
                    displayName: { EN: 'File Size (Kb)', AR: 'لومات ا' },
                    fieldNumber: 2,
                    isVisibleOnDashboard: true,
                },
                {
                    key: 'leftEarscan',
                    fieldType: 'File',
                    displayName: { EN: 'CAD File', AR: 'لومات ا' },
                    fieldNumber: 3,
                    isVisibleOnDashboard: false,
                },
            ],
        },
    ];
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
