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

export const dataURItoBlob = (dataURI) => {
    let byteString = '';
    let mimeString = '';
    if (dataURI) {
        const one = dataURI.split(',')[1];
        byteString = atob(one);
        if (byteString) {
            const comma = dataURI.split(',')[0];
            const colonOne = comma.split(':')[1];
            const semicolon = colonOne.split(';')[0];
            mimeString = semicolon;
        }
    }
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
};
