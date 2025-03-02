import './ManagePatientModal.scss'

import { Language, Nullish, Patient, PatientTagsField, ReservedStep, Step } from '@3dp4me/types'
import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import _ from 'lodash'
import React, { useState } from 'react'
import swal from 'sweetalert'

import { useTranslations } from '../../hooks/useTranslations'
import language from '../../translations.json'
import { LANGUAGES, PATIENT_STATUS } from '../../utils/constants'
import {
    getPatientTagOptions,
    getPatientTagValues,
    getProfilePictureAsFileArray,
} from '../../utils/rootStep'
import { FormOption } from '../Fields/FormOption'
import PhotoField from '../Fields/PhotoField'
import RadioButtonField from '../Fields/RadioButtonField'
import TagsField from '../Fields/TagsField'
import TextField from '../Fields/TextField'

export interface ManagePatientModalProps {
    stepMetadata: Step[]
    patientData: Patient
    isOpen: boolean
    onClose: () => void
    onDataSave: (patient: Patient) => void
    onStepSave: (stepKey: string, stepData: Step) => void
    onDeleted: () => void
    onUploadProfilePicture: (file: File) => void
}

const ManagePatientModal = ({
    stepMetadata,
    patientData,
    isOpen,
    onClose,
    onDataSave,
    onStepSave,
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

    const onTagUpdate = (key: string, value: string[]) => {
        setUpdatedPatientData((data) => {
            const rootData = (data as any)?.[ReservedStep.Root] || {}
            const allData = data || {}

            const d = {
                ...allData,
                [ReservedStep.Root]: {
                    ...rootData,
                    [key]: value,
                },
            }

            return d
        })
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

                    <TagsField
                        displayName={PatientTagsField.displayName[selectedLang]}
                        fieldId={PatientTagsField.key}
                        options={getPatientTagOptions(stepMetadata)}
                        value={getPatientTagValues(updatedPatientData, stepMetadata)}
                        onChange={onTagUpdate}
                    />
                </div>

                <div className="manage-patient-footer">
                    <Button
                        className="manage-patient-save-button"
                        onClick={() => {
                            onDataSave(updatedPatientData)
                            const root = (updatedPatientData as any)?.[
                                ReservedStep.Root
                            ] as Nullish<Step>
                            if (root) {
                                onStepSave(ReservedStep.Root, _.cloneDeep(root))
                            }
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
