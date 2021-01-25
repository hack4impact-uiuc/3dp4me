import axios from "axios";

import {getCurrentUserInfo, getCredentials, getCurrentSession} from '../aws/aws-helper';
const FileDownload = require('js-file-download');

const instance = axios.create({
    baseURL: "http://localhost:8080/api"
})
instance.interceptors.request.use(
    async config => {
      const { accessToken: { jwtToken } } = await getCurrentSession();
      if (jwtToken) {
        config.headers.Authorization = "Bearer " + jwtToken
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  );

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

export const updateStage = async (patientId, stage, updated_stage) => {
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
    credentials["responseType"] = 'blob';
    console.log(credentials);
    return;
    return instance
        .get(requestString, ) // TODO: use AWS userId
        .then(
            res => FileDownload(res.data, filename),
            err => {
                console.error(err);
                return null;
            },
        );
}

export const uploadFile = async (patientId, stage, filedata, filename=null) => {
    const requestString = `/patients/${patientId}/${stage}/file`;
    let credentials = await getCredentials();
    let formData = new FormData();
    filename = filename ? filename : filedata.name;
    formData.append("uploadedFile", filedata);
    formData.append("uploadedFileName", filename);
    for ( var key in credentials ) {
        formData.append(key, credentials[key]);
    }
    return instance
        .post(requestString, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            }
        });
}