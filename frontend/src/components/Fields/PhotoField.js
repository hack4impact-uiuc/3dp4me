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

    const handleOnClick = () => {
      setIsOpen(true);
    }

    const handleOnClose = () => {
      setIsOpen(false);
    }

    //TODO: Loading Icon, Confirm and delete buttons, switch rtl for arabic languages?, translation, better way to handle showBullets logic and magic number
    //Logic we need to implement:
    // Once photo button is clicked we need to show the photo while confirm is not pressed and there is a photo in memory and delete the photo from memory once it is closed
    // If confirm is pressed we can continue with the rest of the actions and delete the photo and bring it back to regular
    // If delete is pressed we bring it back to regular but we don't execute rest of instructions
    // Confirm can set uploadPhoto variable to true, Delete can set it to false 
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
          <Camera onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }/>
          <div className={"button-wrapper"}>

          {/* added in button components into modal, delete this comment later*/}
          <StyledButton>Confirm</StyledButton>
          <StyledButton>Delete</StyledButton>
          </div>
        </div>
      </Modal>
      {images.length > 0 && <ImageGallery items={images} className={"image-gallery"} showBullets={images.length > 20 ? false : true}/>}
    </div>
  );
};

export {PhotoField};





