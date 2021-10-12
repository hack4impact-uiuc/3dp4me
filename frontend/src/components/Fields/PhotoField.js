import React, { useState, useEffect } from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import {StyledButton} from '../StyledButton/StyledButton';
import { Modal } from '@material-ui/core';
import './PhotoField.scss';

const PhotoField = ({handleFileUpload, value, displayName, fieldId, handleSimpleUpdate}) => {
    const [images, setImages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [dataUri, setUri] = useState("");

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
        setUri(dataUri);
        setShowImage(true);
    }

    // TODO: How to handle when to show buttons
    const confirmUpload = async () => {
      if (showImage) {
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
        resetUpload();
      }
    }

    const resetUpload = () => {
      setShowImage(false);
      setUri("");
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

    const handleOnClick = () => {
      setIsOpen(true);
    }

    //TODO: SHould we reset or save the pic in there? 
    const handleOnClose = () => {
      setIsOpen(false);
    }

    //TODO: Loading Icon, switch rtl for arabic languages, translation, better way to handle showBullets logic and magic number
  return (
    <div>
      <h3>{displayName}</h3>
      <StyledButton onClick={handleOnClick}>Take Photo</StyledButton>
      <br/>
      <Modal
        open={isOpen}
        onClose={handleOnClose}
        className={"take-photo-modal"}
      > 
        <div className={"take-photo-modal-wrapper"}>
          {showImage ? <img src={dataUri}/> : <Camera onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }/>}
          <br/>
          <div className={"button-wrapper"}>
          <StyledButton onClick={confirmUpload}>Confirm</StyledButton>
          <StyledButton onClick={resetUpload}>Delete</StyledButton>
          </div>
        </div>
      </Modal>
      {images.length > 0 && <ImageGallery items={images} className={"image-gallery"} showBullets={images.length <= 20}/>}
    </div>
  );
};

export {PhotoField};





