import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import {uploadFile} from '../../api/api';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";


const PhotoField = ({patientId, stepKey, handleFileUpload}) => {

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

    
    const handleTakePhoto = async (dataUri) => {
        const photoObj = dataURItoBlob(dataUri);
        const d = Date.now();
        const fileName = d.toString();
        const photoFile = new File([photoObj], fileName);
        handleFileUpload('photo', photoFile);
    }


    //TODO: Delete this boi
    const images = [
  {
    original: 'https://picsum.photos/id/1018/1000/600/',
    thumbnail: 'https://picsum.photos/id/1018/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/250/150/',
  },
];


  return (
    <div>
    <Camera 
      onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
    />
        <ImageGallery items={images} />
    </div>

  );
};

export {PhotoField};


//Questions for Matt
// Deprecated aotb, can we use this function (did we do it right), confirmation button




