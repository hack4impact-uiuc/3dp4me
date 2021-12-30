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

    // Need to handle case of invalid patient id
    if (!res?.data?.success) throw new Error(res?.data?.message);
    
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

export const randomMethod = async() => {
    const requestString = `/patient-2fa/isAuth`;
    const res = instance.get(requestString, {withCredentials: true});
}