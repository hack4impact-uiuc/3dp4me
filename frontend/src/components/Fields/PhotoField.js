import React, { useState, useEffect } from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImageGallery from 'react-image-gallery';

import 'react-image-gallery/styles/css/image-gallery.css';
import { Modal } from '@material-ui/core';

import { StyledButton } from '../StyledButton/StyledButton';
import { useTranslations } from '../../hooks/useTranslations';
import './PhotoField.scss';
import { NUMBER_OF_PHOTOS_FOR_BULLET_VIEW } from '../../utils/constants';
import PropTypes from 'prop-types';

const PhotoField = ({
    value,
    displayName,
    fieldId,
    handleSimpleUpdate,
    handleFileUpload,
}) => {
    const [images, setImages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [dataUri, setUri] = useState('');
    const translations = useTranslations()[0];

    useEffect(() => {
        setImages(
            value.map((v) => {
                return {
                    original: v.uri,
                    thumbnail: v.uri,
                    originalWidth: '700',
                    originalHeight: '300',
                };
            }),
        );
    }, [value]);

    const dataURItoBlob = (dataURI) => {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], { type: mimeString });
    };

    const handleTakePhoto = (uri) => {
        setUri(uri);
        setShowImage(true);
    };

    const confirmUpload = async () => {
        const photoObj = dataURItoBlob(dataUri);
        const dUri = await blobToDataURL(photoObj);
        const d = Date.now();
        const fileName = d.toString();
        const photoFile = new File([photoObj], fileName);
        handleFileUpload(fieldId, photoFile);
        const photoTaken = { uri: dUri };
        const newImages = value;
        newImages.push(photoTaken);
        handleSimpleUpdate(fieldId, newImages);
        resetUpload();
    };

    const resetUpload = () => {
        setShowImage(false);
        setUri('');
        setIsOpen(false);
    };

    const blobToDataURL = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.onabort = () => reject(new Error('Read aborted'));
            reader.readAsDataURL(blob);
        });
    };

    const handleOpenCamera = () => {
        setIsOpen(true);
    };

    const handleOnClose = () => {
        setIsOpen(false);
        resetUpload();
    };

    return (
        <div>
            <h3>{displayName}</h3>
            <StyledButton onClick={handleOpenCamera} primary={true}>
                {translations.components.button.photo}
            </StyledButton>
            <br />
            <Modal
                open={isOpen}
                onClose={handleOnClose}
                className="take-photo-modal"
            >
                <div className="take-photo-modal-wrapper">
                    {showImage ? (
                        <img src={dataUri} alt="User Upload" />
                    ) : (
                        <Camera
                            onTakePhoto={(uri) => {
                                handleTakePhoto(uri);
                            }}
                        />
                    )}
                    {showImage && (
                        <>
                            <br />
                            <div className="button-wrapper">
                                <StyledButton
                                    onClick={confirmUpload}
                                    primary={true}
                                >
                                    {
                                        translations.components.button.discard
                                            .confirmButton
                                    }
                                </StyledButton>
                                <StyledButton
                                    onClick={resetUpload}
                                    primary={false}
                                >
                                    {
                                        translations.components.button.discard
                                            .cancelButton
                                    }
                                </StyledButton>
                            </div>
                        </>
                    )}
                </div>
            </Modal>
            {images.length > 0 && (
                <ImageGallery
                    items={images}
                    className="image-gallery"
                    showBullets={
                        images.length <= NUMBER_OF_PHOTOS_FOR_BULLET_VIEW
                    }
                />
            )}
        </div>
    );
};

PhotoField.propTypes = {
    value: PropTypes.array.isRequired,
    displayName: PropTypes.string.isRequired,
    fieldId: PropTypes.string.isRequired,
    handleSimpleUpdate: PropTypes.func.isRequired,
    handleFileUpload: PropTypes.func.isRequired,
};

export { StyledButton };

export { PhotoField };
