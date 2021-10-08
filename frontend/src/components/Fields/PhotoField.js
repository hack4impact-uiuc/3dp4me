import React, { useState, useEffect } from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";


const PhotoField = ({handleFileUpload, value, displayName, fieldId, handleSimpleUpdate}) => {
    const [images, setImages] = useState([]);

    useEffect(() => {
      setImages(value.map(v => {return {original: v.uri, thumbnail: v.uri, originalWidth: "700"}}));
    }, [value]);

    const dataURItoBlob = (dataURI) => {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], {type: mimeString});
    }

    
    const handleTakePhoto = async (dataUri) => {
        const photoObj = dataURItoBlob(dataUri);
        const uri = await blobToDataURL(photoObj);
        const d = Date.now();
        const fileName = d.toString();
        const photoFile = new File([photoObj], fileName);
        handleFileUpload(fieldId, photoFile);
        const photoTaken = {uri: uri};
        const newImages = value;
        newImages.push(photoTaken);
        handleSimpleUpdate(fieldId, newImages);
    }

    const blobToDataURL = (blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = _e => resolve(reader.result);
        reader.onerror = _e => reject(reader.error);
        reader.onabort = _e => reject(new Error("Read aborted"));
        reader.readAsDataURL(blob);
      });
    }

    //TODO: Loading Icon, Resize Image Gallery, Modal/button to open up the photo component
  return (
    <div>
    <h3>{displayName}</h3>
    <Camera 
      onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
    /> {images.length > 0 && <ImageGallery items={images} />}
    </div>

  );
};

export {PhotoField};





