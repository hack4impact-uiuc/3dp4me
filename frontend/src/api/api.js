import instance from './axios-config';

const FileDownload = require('js-file-download');

export const getAllPatients = async () => {
    const requestString = '/patients';
    const res = await instance.get(requestString);
    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const getPatientsByStage = async (stage) => {
    const requestString = `/stages/${stage}`;
    const res = await instance.get(requestString);
    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const getPatientById = async (id) => {
    const requestString = `/patients/${id}`;
    const res = await instance.get(requestString);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const postNewPatient = async (patientInfo) => {
    const requestString = `/patients/`;
    const res = await instance.post(requestString, patientInfo);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const updateStage = async (patientId, stage, updatedStage) => {
    const requestString = `/patients/${patientId}/${stage}`;
    const res = await instance.post(requestString, updatedStage);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const updatePatient = async (patientId, updatedData) => {
    const requestString = `/patients/${patientId}`;
    const res = await instance.put(requestString, updatedData);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const getAllStepsMetadata = async () => {
    const requestString = '/metadata/steps';

    /**
     * In order to test this method and its steps, hardcode an entire object (subFields, displayName, etc.) from the database
     * and push it to res.data.result[0].fields
     */
    const res = await instance.get(requestString);
    if (!res?.data?.success) throw new Error(res?.data?.message);
    console.log(res.data.result[0]);
    res.data.result[0].fields.push({
        subFields: [],
        displayName: {
            EN: 'Number of Disabled People in House',
            AR: 'عدد المعوقين بالمنزل',
        },
        fieldNumber: 7,
        fieldType: 'Map',
        isVisibleOnDashboard: true,
        key: 'locationOfPatient',
    });
    console.log(res.data.result[0]);
    return res.data;
};

export const downloadBlobWithoutSaving = async (
    patientId,
    stepKey,
    fieldKey,
    filename,
) => {
    const requestString = `/patients/${patientId}/files/${stepKey}/${fieldKey}/${filename}`;
    let res = null;

    try {
        res = await instance.get(requestString, {
            responseType: 'blob',
        });
    } catch (error) {
        console.error(error);
        return null;
    }

    if (!res) return null;

    return res.data;
};

export const downloadFile = async (patientId, stepKey, fieldKey, filename) => {
    const blob = await downloadBlobWithoutSaving(
        patientId,
        stepKey,
        fieldKey,
        filename,
    );

    if (!blob) throw new Error('Could not download file');

    try {
        await FileDownload(blob, filename);
    } catch (error) {
        throw new Error('Could not download file');
    }
};

export const uploadFile = async (
    patientId,
    stepKey,
    fieldKey,
    filename,
    filedata,
) => {
    const requestString = `/patients/${patientId}/files/${stepKey}/${fieldKey}/${filename}`;
    const formData = new FormData();
    formData.append('uploadedFile', filedata);
    formData.append('uploadedFileName', filename || filedata.name);

    const res = await instance.post(requestString, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const deleteFile = async (patientId, stepKey, fieldKey, filename) => {
    const requestString = `/patients/${patientId}/files/${stepKey}/${fieldKey}/${filename}`;
    const res = await instance.delete(requestString);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const getAllRoles = async () => {
    const requestString = `/roles`;
    const res = await instance.get(requestString);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const addUserRole = async (username, roleName) => {
    const requestString = `/users/${username}/roles/${roleName}`;
    const res = await instance.put(requestString);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const removeUserRole = async (username, roleName) => {
    const requestString = `/users/${username}/roles/${roleName}`;
    const res = await instance.delete(requestString);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const getAllUsers = async () => {
    const requestString = `/users`;
    const res = await instance.get(requestString);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const setUserAccess = async (username, access) => {
    const requestString = `/users/${username}/access/${access}`;
    const res = await instance.put(requestString);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const getSelf = async () => {
    const requestString = `/users/self`;
    const res = await instance.get(requestString);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};
