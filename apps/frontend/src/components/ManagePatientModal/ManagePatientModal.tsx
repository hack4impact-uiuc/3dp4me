import './ManagePatientModal.scss'

import { Language, Patient, ReservedStep, RootStep } from '@3dp4me/types'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import CloseIcon from '@material-ui/icons/Close'
import _ from 'lodash'
import React, { useState } from 'react'
import swal from 'sweetalert'

import { useTranslations } from '../../hooks/useTranslations'
import language from '../../translations.json'
import { LANGUAGES, PATIENT_STATUS } from '../../utils/constants'
import { getPatientTags, getProfilePictureAsFileArray } from '../../utils/rootStep'
import { FormOption } from '../Fields/FormOption'
import PhotoField from '../Fields/PhotoField'
import RadioButtonField from '../Fields/RadioButtonField'
import TextField from '../Fields/TextField'
import { useSteps } from '../../query/useSteps'

export interface ManagePatientModalProps {
    patientData: Patient
    isOpen: boolean
    onClose: () => void
    onDataSave: (patient: Patient) => void
    onDeleted: () => void
    onUploadProfilePicture: (file: File) => void
}

const ManagePatientModal = ({
    patientData,
    isOpen,
    onClose,
    onDataSave,
    onDeleted,
    onUploadProfilePicture,
}: ManagePatientModalProps) => {
    const [translations, selectedLang] = useTranslations()
    const [updatedPatientData, setUpdatedPatientData] = useState(_.cloneDeep(patientData))

    const onFieldUpdate = (key: string, value: string) => {
        setUpdatedPatientData((data) => ({
            ...data,
            [key]: value,
        }))
    }

    const patientStatusOptions: FormOption[] = [
        {
            _id: PATIENT_STATUS.ACTIVE,
            IsHidden: false,
            Question: {
                [Language.EN]: language[Language.EN].status.active,
                [Language.AR]: language[Language.AR].status.active,
            },
        },
        {
            _id: PATIENT_STATUS.FEEDBACK,
            IsHidden: false,
            Question: {
                [Language.EN]: language[Language.EN].status.feedback,
                [Language.AR]: language[Language.AR].status.feedback,
            },
        },
        {
            _id: PATIENT_STATUS.ARCHIVE,
            IsHidden: false,
            Question: {
                [Language.EN]: language[Language.EN].status.archive,
                [Language.AR]: language[Language.AR].status.archive,
            },
        },
        {
            _id: PATIENT_STATUS.WAITLIST,
            IsHidden: false,
            Question: {
                [Language.EN]: language[Language.EN].status.waitlist,
                [Language.AR]: language[Language.AR].status.waitlist,
            },
        },
    ]

    const deletePatient = () => {
        swal({
            title: translations.components.modal.deleteTitle,
            text: translations.components.modal.deletePatientConfirmation,
            icon: 'warning',
            buttons: [
                translations.components.button.discard.cancelButton,
                translations.components.button.discard.confirmButton,
            ],
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                onClose()
                onDeleted()
            }
        })
    }

    const onProfileUpload = async (_: string, file: File) => {
        onUploadProfilePicture(file)
    }

    console.log(getPatientTags(patientData))

    return (
        <Modal open={isOpen} onClose={onClose} className="manage-patient-modal">
            <div
                className={`controller-manage-patient-wrapper ${
                    selectedLang === LANGUAGES.AR ? 'controller-manage-patient-wrapper-ar' : ''
                }`}
            >
                <div className="manage-patient-header">
                    <h2>{translations.components.swal.managePatient.title}</h2>
                    <Button onClick={onClose}>
                        <CloseIcon />
                    </Button>
                </div>

                <div className="profile-information-wrapper">
                    <h3>{translations.components.swal.managePatient.profileInformation}</h3>
                    <PhotoField
                        displayName={translations.components.swal.managePatient.profilePicture}
                        value={getProfilePictureAsFileArray(patientData)}
                        fieldId="profilePicture"
                        patientId={patientData._id}
                        handleFileUpload={onProfileUpload}
                        fieldPathPrefix=""
                        stepKey={ReservedStep.Root}
                        allowMultiplePhotos={false}
                    />

                    <TextField
                        className="text-field"
                        value={updatedPatientData?.orderId}
                        fieldId="orderId"
                        isDisabled
                        displayName={translations.components.swal.managePatient.orderId}
                        onChange={onFieldUpdate}
                    />

                    <TextField
                        className="text-field"
                        value={updatedPatientData?.firstName}
                        fieldId="firstName"
                        displayName={translations.components.swal.managePatient.firstName}
                        onChange={onFieldUpdate}
                    />
                    <TextField
                        className="text-field"
                        value={updatedPatientData?.fathersName}
                        fieldId="fathersName"
                        displayName={translations.components.swal.managePatient.fatherName}
                        onChange={onFieldUpdate}
                    />
                    <TextField
                        className="text-field"
                        value={updatedPatientData?.grandfathersName}
                        displayName={translations.components.swal.managePatient.grandfatherName}
                        fieldId="grandfathersName"
                        onChange={onFieldUpdate}
                    />
                    <TextField
                        className="text-field"
                        value={updatedPatientData?.familyName}
                        fieldId="familyName"
                        displayName={translations.components.swal.managePatient.familyName}
                        onChange={onFieldUpdate}
                    />

                    <RadioButtonField
                        value={updatedPatientData?.status}
                        fieldId="status"
                        title={translations.components.swal.managePatient.radioTitle}
                        options={patientStatusOptions}
                        onChange={onFieldUpdate}
                    />
                </div>

                <div className="manage-patient-footer">
                    <Button
                        className="manage-patient-save-button"
                        onClick={() => {
                            onDataSave(updatedPatientData)
                        }}
                    >
                        {translations.components.swal.managePatient.buttons.save}
                    </Button>
                    <Button
                        className="manage-patient-delete-button"
                        disabled
                        onClick={deletePatient}
                    >
                        {translations.components.swal.managePatient.buttons.delete}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ManagePatientModal
