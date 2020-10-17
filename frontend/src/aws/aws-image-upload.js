import React from 'react';
import { Storage } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';

function notifyUploadError(err){
    console.log(err);
    alert("An error occured while uploading.");
}

function notifyUploadSuccess(result){
    console.log(result);
    alert("File uploaded");
}

async function onChange(e) {
    const file = e.target.files[0];

    // This is what the file is named on AWS. Not sure if we want to standardize names, add dates, etc.
    const fileName = file;

    Storage.put(fileName, file, {
        contentType: 'text'
    })

    .then(notifyUploadSuccess)
    .catch(notifyUploadError);
}

const S3ImageUpload = function() {
    return (
        <input
            type="file" accept='text'
            onChange={(evt) => onChange(evt)}
        />
    )
}

export default withAuthenticator(S3ImageUpload);