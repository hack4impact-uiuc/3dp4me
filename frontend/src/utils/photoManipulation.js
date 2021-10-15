import { downloadBlobWithoutSaving } from '../api/api';
export const blobToDataURL = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.onabort = () => reject(new Error('Read aborted'));
        reader.readAsDataURL(blob);
    });
};

export const convertPhotosToURI = async (
    photoData,
    stepKey,
    fieldKey,
    patientId,
) => {
    const newPhotoData = photoData.map(async (photoObj) => {
        let modifiedPhotoObj = photoObj;
        modifiedPhotoObj.uri = await photoToURI(
            photoObj,
            stepKey,
            fieldKey,
            patientId,
        );
        return modifiedPhotoObj;
    });

    return Promise.all(newPhotoData);
};

export const photoToURI = async (photoObj, stepKey, fieldKey, patientId) => {
    const blob = await downloadBlobWithoutSaving(
        patientId,
        stepKey,
        fieldKey,
        photoObj.filename,
    );
    const uri = await blobToDataURL(blob);
    return uri;
};
