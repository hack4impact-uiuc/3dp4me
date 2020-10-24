import axios from "axios";

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