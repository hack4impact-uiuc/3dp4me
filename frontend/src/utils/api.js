import axios from "axios";

import {getCurrentUserInfo, getCredentials} from '../aws/aws-helper';
const FileDownload = require('js-file-download');

const instance = axios.create({
    baseURL: "http://localhost:8080/api",
});

export const getAllPatients = async () => {
    const requestString = "/stages/";
    return instance.get(requestString).then( 
        res => res.data,
        err => {
            console.error(err);
            return null;
        },
    );
};

export const getPatientsByStage = async stage => {
    const requestString = `/stages/${stage}`;
    return instance.get(requestString).then(
        res => res.data,
        err => {
            console.error(err);
            return null;
        },
    );
};

export const getPatientById = async (id) => {
    const requestString = `/patients/${id}`;
    return instance.get(requestString).then(
        res => res.data,
        err => {
            console.error(err);
            return null;
        },
    );
};


export const newPatient = async (patient_info) => {
    const requestString = `/patients/`;
    return instance
        .post(requestString, patient_info) // TODO: use AWS userId
        .then(
            res => res.data,
            err => {
                console.error(err);
                return null;
            },
        );
};

export const updateeStage = async (patientId, stage, updated_stage) => {
    const requestString = `/patients/${patientId}/${stage}`;
    return instance
        .post(requestString, updated_stage) // TODO: use AWS userId
        .then(
            res => res.data,
            err => {
                console.error(err);
                return null;
            },
        );
};

export const downloadFile = async (patientId, stage, filename) => {
    const requestString = `/patients/${patientId}/${stage}/${filename}`;
    let credentials = await getCurrentUserInfo();
    let a = await getCredentials();
    console.log(a);
    // let userID = credentials.id;
    // return instance
    //     .get(requestString, { userId: userID, responseType: 'blob' }) // TODO: use AWS userId
    //     .then(
    //         res => FileDownload(res.data, filename),
    //         err => {
    //             console.error(err);
    //             return null;
    //         },
    //     );
}

export const uploadFile = async (patientId, stage, filedata) => {
    const requestString = `/patients/${patientId}/${stage}/file`;
    let credentials = await getCurrentUserInfo();
    let a = await getCredentials();
    console.log(a);
    // let userID = credentials.id;
    // return instance
    //     .post(requestString, { userId: userID, responseType: 'blob' }) // TODO: use AWS userId
    //     .then(
    //         res => FileDownload(res.data, filename),
    //         err => {
    //             console.error(err);
    //             return null;
    //         },
    //     );
}