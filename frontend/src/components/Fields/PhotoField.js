import Camera from 'react-html5-camera-photo';
import ImageGallery from 'react-image-gallery';
import { Modal } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { NUMBER_OF_PHOTOS_FOR_BULLET_VIEW } from '../../utils/constants';
import { StyledButton } from '../StyledButton/StyledButton';
import { useTranslations } from '../../hooks/useTranslations';
import './PhotoField.scss';
import 'react-html5-camera-photo/build/css/index.css';
import 'react-image-gallery/styles/css/image-gallery.css';

import { blobToDataURL, dataURItoBlob } from '../../utils/photoManipulation';

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
        return showImage ? (
            <img src={dataUri} alt="User Upload" />
        ) : (
            <Camera
                onTakePhoto={(uri) => {
                    handleTakePhoto(uri);
                }}
            />
        );
    };

    const renderImagePreviewButtons = () => {
        return (
            showImage && (
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
            )
        );
    };

    const renderImageGallery = () => {
        return (
            images.length > 0 && (
                <ImageGallery
                    items={images}
                    className="image-gallery"
                    showBullets={
                        images.length <= NUMBER_OF_PHOTOS_FOR_BULLET_VIEW
                    }
                />
            )
        );
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

PhotoField.defaultProps = {
    value: [],
};

PhotoField.propTypes = {
    value: PropTypes.array,
    displayName: PropTypes.string.isRequired,
    fieldId: PropTypes.string.isRequired,
    handleSimpleUpdate: PropTypes.func.isRequired,
    handleFileUpload: PropTypes.func.isRequired,
};

export default PhotoField;
