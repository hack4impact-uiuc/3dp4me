import React from 'react';
import { Storage } from 'aws-amplify'

function onChange(e) {
    const file = e.target.files[0];
    console.log(file)
    Storage.put('example.txt', file, {
        contentType: 'text'
    })
    .then (result => console.log(result))
    .catch(err => console.log(err));
}

const S3ImageUpload = function() {
    return (
        <input
            type="file" accept='text'
            onChange={(evt) => onChange(evt)}
        />
    )
}

export default S3ImageUpload;