import instance from './axios-config';

const FileDownload = require('js-file-download');

export const getPatientsCount = async () => {
    const requestString = '/patients/count';
    const res = await instance.get(requestString);
    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const getPatientsByPageNumberAndSearch = async (
    pageNumber,
    nPerPage,
    searchQuery = '',
) => {
    const requestString = `/patients?pageNumber=${pageNumber}&nPerPage=${nPerPage}&searchQuery=${searchQuery}`;
    const res = await instance.get(requestString);
    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const getPatientsByStageAndPageNumberAndSearch = async (
    stage,
    pageNumber,
    nPerPage,
    searchQuery = '',
) => {
    const requestString = `/stages/${stage}?pageNumber=${pageNumber}&nPerPage=${nPerPage}&searchQuery=${searchQuery}`;
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

export const getAllStepsMetadata = async (showHiddenField = false) => {
    const requestString = `/metadata/steps?showHiddenFields=${showHiddenField}`;

    /**
     * In order to test this method and its steps, hardcode an entire object (subFields, displayName, etc.) from the database
     * and push it to res.data.result[0].fields
     */
    const res = await instance.get(requestString);
    if (!res?.data?.success) throw new Error(res?.data?.message);
    return res.data;
};

export const updateMultipleSteps = async (updatedSteps) => {
    const requestString = '/metadata/steps';

    const res = await instance.put(requestString, updatedSteps);
    if (!res?.data?.success) throw new Error(res?.data?.message);

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

export const addRole = async (roleInfo) => {
    const requestString = `/roles`;
    const res = await instance.post(requestString, roleInfo);
    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const deleteRole = async (userId) => {
    const requestString = `/roles/${userId}`;
    const res = await instance.delete(requestString);
    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const editRole = async (userId, updatedRoleInfo) => {
    const requestString = `/roles/${userId}`;
    const res = await instance.put(requestString, updatedRoleInfo);
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

export const getUsersByPageNumber = async (nPerPage) => {
    const requestString = `/users?nPerPage=${nPerPage}`;

    const res = await instance.get(requestString);

    if (!res?.data?.success) throw new Error(res?.data?.message);

    return res.data;
};

export const getUsersByPageNumberAndToken = async (token, nPerPage) => {
    const encodedToken = encodeURIComponent(token);
    const requestString = `/users?token=${encodedToken}&nPerPage=${nPerPage}`;

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
