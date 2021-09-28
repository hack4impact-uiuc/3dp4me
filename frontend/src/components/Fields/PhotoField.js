import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import {uploadFile} from '../../api/api'

const PhotoField = ({patientId, stepKey}) => {

    const dataURItoBlob = (dataURI) => {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], {type: mimeString});
    }

    
    const handleTakePhoto = (dataUri) => {
        const photo = dataURItoBlob(dataUri);
        const fileName = "hi"; //TODO: CHANGE THIS NAME TO BE UNIQUE THROUGH Date class --> String 
        uploadFile(patientId, stepKey, 'PHOTO', fileName, photo);
        console.log('takePhoto');
    }

  return (
    <Camera 
      onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
    />
  );
};

export {PhotoField};


//Questions for Matt
// Deprecated aotb, can we use this function (did we do it right), 




