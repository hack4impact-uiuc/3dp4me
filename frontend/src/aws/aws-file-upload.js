import React from 'react';
import { Storage } from 'aws-amplify';

// TODO: What file types do they use? .stl, .cad?

function notifyUploadError(err){
    console.log(err);
    alert("An error occured while uploading.");
}

function notifyUploadSuccess(result){
    console.log(result);
    alert("File uploaded");
}

async function onChange(evt, patientDir, filename) {
    const localFile = evt.target.files[0];
    let fullAWSPath = `${patientDir}/${filename}`
    Storage.put(fullAWSPath, localFile, {
        contentType: 'text'
    })

    .then(notifyUploadSuccess)
    .catch(notifyUploadError);
}

/**
 * Uploads a file to S3 bucket relative to the /public directory.
 * @param patientDir The name of the patient's folder.
 * @param filename The name of this file with the filetype. Ex: earscan.stl
 */
const S3FileUpload = function(patientDir, filename) {
    return (
        <input
            type="file" accept='text'
            onChange={(evt) => onChange(evt, patientDir, filename)}
        />
    )
}

export default S3FileUpload;