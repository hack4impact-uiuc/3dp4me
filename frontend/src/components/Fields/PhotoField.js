import { Modal } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import ImageGallery from 'react-image-gallery';

import 'react-image-gallery/styles/css/image-gallery.css';
import { useTranslations } from '../../hooks/useTranslations';
import { NUMBER_OF_PHOTOS_FOR_BULLET_VIEW } from '../../utils/constants';
import { blobToDataURL, convertPhotosToURI, dataURItoBlob } from '../../utils/photoManipulation';
import { StyledButton } from '../StyledButton/StyledButton';
import './PhotoField.scss';


const PhotoField = ({
    value,
    displayName,
    patientId,
    stepKey,
    fieldId,
    handleFileUpload,
}) => {
    const [images, setImages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [dataUri, setUri] = useState('');
    const translations = useTranslations()[0];

    useEffect(() => {
        updateMetaDataPhotos(value)
    }, [value]);

    const updateMetaDataPhotos = async (data) => {
        const newPhotoData = await convertPhotosToURI(
            data,
            stepKey,
            fieldId,
            patientId,
        );

        setImages(newPhotoData.map((v) => {
            return {
                original: v.uri,
                thumbnail: v.uri,
                originalWidth: '700',
                originalHeight: '300',
            };
        }))
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
        setImages(newImages);
        resetUpload();
    };

    const resetUpload = () => {
        setShowImage(false);
        setUri('');
        setIsOpen(false);
    };

    const handleOpenCamera = () => {
        setIsOpen(true);
    };

    const handleOnClose = () => {
        setIsOpen(false);
        resetUpload();
    };

    const handleRetake = () => {
        setShowImage(false);
        setUri('');
    };

    const renderPhotoModal = () => {
        if (showImage) {
            return <img src={dataUri} alt="User Upload" />;
        }

        return (
            <Camera
                onTakePhoto={(uri) => {
                    handleTakePhoto(uri);
                }}
            />
        );
    };

    const renderImagePreviewButtons = () => {
        if (showImage) {
            return (
                <>
                    <br />
                    <div className="button-wrapper">
                        <StyledButton onClick={confirmUpload} primary>
                            {translations.components.button.discard.saveButton}
                        </StyledButton>
                        <StyledButton onClick={handleRetake} primary={false}>
                            {
                                translations.components.button.discard
                                    .retakeButton
                            }
                        </StyledButton>
                        <StyledButton onClick={resetUpload} primary={false}>
                            {
                                translations.components.button.discard
                                    .cancelButton
                            }
                        </StyledButton>
                    </div>
                </>
            );
        }

        return null;
    };

    const renderImageGallery = () => {
        if (images.length > 0) {
            return (
                <ImageGallery
                    items={images}
                    className="image-gallery"
                    showBullets={
                        images.length <= NUMBER_OF_PHOTOS_FOR_BULLET_VIEW
                    }
                />
            );
        }

        return null;
    };

    return (
        <div>
            <h3>{displayName}</h3>
            <StyledButton onClick={handleOpenCamera} primary>
                {translations.components.button.photo}
            </StyledButton>
            <br />
            <Modal
                open={isOpen}
                onClose={handleOnClose}
                className="take-photo-modal"
            >
                <div className="take-photo-modal-wrapper">
                    {renderPhotoModal()}
                    {renderImagePreviewButtons()}
                </div>
            </Modal>
            {renderImageGallery()}
        </div>
    );
};

PhotoField.propTypes = {
    value: PropTypes.array,
    displayName: PropTypes.string.isRequired,
    fieldId: PropTypes.string.isRequired,
    patientId: PropTypes.string.isRequired,
    handleFileUpload: PropTypes.func.isRequired,
    stepKey: PropTypes.string.isRequired,
};

export default PhotoField;
