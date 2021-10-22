import _ from "lodash";
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
        const modifiedPhotoObj = _.cloneDeep(photoObj);
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

export const dataURItoBlob = (dataURI) => {
    let byteString = '';
    let mimeString = '';
    if (dataURI) {
        const splitByComma = dataURI.split(',');
        if (splitByComma.length >= 2) {
            const one = splitByComma[1];
            byteString = atob(one);
            if (byteString) {
                const comma = dataURI.split(',')[0];
                const splitByColon = comma.split(':');
                if (splitByColon.length >= 2) {
                    const colonOne = splitByColon[1];
                    const semicolon = colonOne.split(';')[0];
                    mimeString = semicolon;
                }
            }
        }
    }
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
};
