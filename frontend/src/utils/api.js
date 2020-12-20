import axios from "axios";

import getCurrentUserInfo from '../aws/aws-helper';
const FileDownload = require('js-file-download');

const instance = axios.create({
    baseURL: "http://localhost:5000/api",
});

export const getAllPatients = () => {
    const requestString = "/patients";
    return instance.get(requestString).then(
        res => res.data,
        err => {
            console.error(err);
            return null;
        },
    );
};

export const getPatientsByStage = stage => {
    const requestString = `/patients/${stage}`;
    return instance.get(requestString).then(
        res => res.data,
        err => {
            console.error(err);
            return null;
        },
    );
};

export const completeStage = (patientId, stage) => {
    const requestString = `/patients/${patientId}/${stage}/complete`;
    return instance
        .post(requestString, { userId: '123' }) // TODO: use AWS userId
        .then(
            res => res.data,
            err => {
                console.error(err);
                return null;
            },
        );
};

export const downloadFile = (patientId, stage, filename) => {
    const requestString = `/patients/${patientId}/${stage}/${filename}`;
    let credentials = await getCurrentUserInfo();
    let userID = credentials.id;
    return instance
        .get(requestString, { userId: userID, responseType: 'blob' }) // TODO: use AWS userId
        .then(
            res => FileDownload(res.data, filename),
            err => {
                console.error(err);
                return null;
            },
        );
}