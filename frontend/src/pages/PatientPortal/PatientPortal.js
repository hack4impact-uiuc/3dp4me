import React, { useEffect } from 'react'
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const instance = axios.create({
    baseURL: BASE_URL,
    validateStatus: () => {
        return true;
    },
});

const PatientPortal = () => {
    useEffect(() => {
        const requestString = `/patient-2fa/isAuth`;
        const res = instance.get(requestString, {withCredentials: true});
    }, []);

    return (
        <div>
            Hi
        </div>
    )
}

export default PatientPortal