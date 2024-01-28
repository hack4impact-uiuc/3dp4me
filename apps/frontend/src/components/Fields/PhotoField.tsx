import 'react-html5-camera-photo/build/css/index.css'
import 'react-image-gallery/styles/css/image-gallery.css'
import './PhotoField.scss'

import { File as FileType } from '@3dp4me/types'
import { Modal } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Camera from 'react-html5-camera-photo'
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery'

import promptInstructionsAR from '../../assets/camera-prompt-instructions-ar.gif'
import promptInstructions from '../../assets/camera-prompt-instructions-en.gif'
import { useTranslations } from '../../hooks/useTranslations'
import {
    LANGUAGES,
    NUMBER_OF_PHOTOS_FOR_BULLET_VIEW,
    PERMISSION_CONSTRAINTS,
    PERMISSION_STATUS_DENIED,
} from '../../utils/constants'
import { convertPhotosToURI, dataURItoBlob } from '../../utils/photoManipulation'
import { StyledButton } from '../StyledButton/StyledButton'

export interface PhotoFieldProps<T extends string> {
    value: FileType[]
    displayName: string
    patientId: string
    stepKey: string
    fieldId: T
    handleFileUpload: (field: T, file: File) => void
    isDisabled?: boolean
}

const PhotoField = <T extends string>({
    value,
    displayName,
    patientId,
    stepKey,
    fieldId,
    handleFileUpload,
    isDisabled = false,
}: PhotoFieldProps<T>) => {
    const [images, setImages] = useState<ReactImageGalleryItem[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const [shouldPromptCameraAccess, setShouldPromptCameraAccess] = useState(false)
    const [dataUri, setUri] = useState('')
    const [translations, selectedLang] = useTranslations()

    useEffect(() => {
        updateMetaDataPhotos(value)
    }, [value])

    // Must disable these for the permission listener to work
    /* eslint no-param-reassign: "off", react/no-this-in-sfc: "off" */
    const setPermissionListener = (permissionStatus: PermissionStatus) => {
        permissionStatus.onchange = function () {
            if (this.state === PERMISSION_STATUS_DENIED) {
                setShouldPromptCameraAccess(true)
            } else {
                setShouldPromptCameraAccess(false)
            }
        }
    }

    useEffect(() => {
        const updatePermissionStatus = async () => {
            await getMedia(PERMISSION_CONSTRAINTS)
            if (navigator.permissions && navigator.permissions.query) {
                const permissionStatus = await navigator.permissions.query({
                    name: 'camera' as any,
                })
                setPermissionListener(permissionStatus)
            }
        }
        updatePermissionStatus()
    }, [])

    const getMedia = async (constraints: MediaStreamConstraints) => {
        try {
            setShouldPromptCameraAccess(false)
            await navigator.mediaDevices.getUserMedia(constraints)
        } catch (err) {
            setShouldPromptCameraAccess(true)
        }
    }

    const updateMetaDataPhotos = async (data: FileType[]) => {
        const newPhotoData = await convertPhotosToURI(data, stepKey, fieldId, patientId)

        setImages(
            newPhotoData.map((v) => ({
                original: v.uri,
                thumbnail: v.uri,
                originalWidth: 700,
                originalHeight: 300,
            }))
        )
    }

    const handleTakePhoto = (uri: string) => {
        setUri(uri)
        setShowImage(true)
    }

    const confirmUpload = async () => {
        const photoObj = dataURItoBlob(dataUri)
        const date = Date.now()
        const fileName = date.toString()
        const photoFile = new File([photoObj], fileName)
        handleFileUpload(fieldId, photoFile)
        resetUpload()
    }

    const resetUpload = () => {
        setShowImage(false)
        setUri('')
        setIsOpen(false)
    }

    const handleOpenCamera = () => {
        setIsOpen(true)
    }

    const handleOnClose = () => {
        setIsOpen(false)
        resetUpload()
    }

    const handleRetake = () => {
        setShowImage(false)
        setUri('')
    }

    const renderPhotoModal = () => {
        if (showImage) {
            return <img src={dataUri} alt="User Upload" />
        }

        return (
            <Camera
                onTakePhoto={(uri) => {
                    handleTakePhoto(uri)
                }}
                isDisplayStartCameraError
            />
        )
    }

    const renderImagePreviewButtons = () => {
        if (showImage) {
            return (
                <>
                    <br />
                    <div className="button-wrapper">
                        <div className="save-retake-button-wrapper">
                            <StyledButton onClick={confirmUpload} primary>
                                {translations.components.button.discard.saveButton}
                            </StyledButton>
                            <StyledButton onClick={handleRetake}>
                                {translations.components.button.discard.retakeButton}
                            </StyledButton>
                        </div>
                        <div>
                            <StyledButton onClick={resetUpload} danger>
                                {translations.components.button.discard.cancelButton}
                            </StyledButton>
                        </div>
                    </div>
                </>
            )
        }

        return null
    }

    const renderImageGallery = () => {
        if (images.length > 0) {
            return (
                <ImageGallery
                    items={images}
                    showBullets={images.length <= NUMBER_OF_PHOTOS_FOR_BULLET_VIEW}
                />
            )
        }

        return null
    }

    const renderCamera = () => {
        if (shouldPromptCameraAccess) {
            return (
                <>
                    <h1>{translations.components.camera.promptInstructions}</h1>
                    <img
                        src={
                            selectedLang === LANGUAGES.EN
                                ? promptInstructions
                                : promptInstructionsAR
                        }
                        alt="instructions"
                    />
                </>
            )
        }
        return (
            <>
                {renderPhotoModal()}
                {renderImagePreviewButtons()}
            </>
        )
    }

    return (
        <div>
            <h3>{displayName}</h3>
            <StyledButton onClick={handleOpenCamera} primary isDisabled={isDisabled}>
                {translations.components.button.photo}
            </StyledButton>
            <br />
            <Modal open={isOpen} onClose={handleOnClose} className="take-photo-modal">
                <div className="take-photo-modal-wrapper">{renderCamera()}</div>
            </Modal>
            {renderImageGallery()}
        </div>
    )
}

export default PhotoField
