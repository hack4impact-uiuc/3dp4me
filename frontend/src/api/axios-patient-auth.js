import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

// Generalized axios configuration
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

// The configured axios instance to be exported
const instance = axios.create({
    baseURL: BASE_URL,
    validateStatus: () => {
        return true;
    },
});

export const send2FAPatientCode = async (_id) => {
    const requestString = `/patient-2fa/${_id}`;

    const res = await instance.get(requestString);
    
    // Previously, without the redirect, the site would crash when an invalid patient id was entered
    if (!res?.data?.success) {
        window.location = `/patient-2fa/${_id}`;
    }
    
    return res.data;
};

export const authenticatePatient = async (_id, token) => {
    const bodyFormData = new FormData();
    bodyFormData.append('username', _id);
    bodyFormData.append('password', token);
    const res = await instance({
        method: "post",
        url: `/patient-2fa/authenticated/${_id}`,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
    })

    return res.data;
};

export const redirectAndAuthenticate = async (_id) => {
    const res = await instance({
        method: "get",
        url: `/patient-2fa/patient-portal/${_id}`,
        data: {_id},
        headers: { "Content-Type": "multipart/form-data" },
    });

    if (!res?.data?.success) {
        window.location = `/patient-2fa/${_id}`;
        return false;
    }

    return true;
};
