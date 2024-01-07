import { Button, Modal } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import swal from 'sweetalert';

import { useTranslations } from '../../hooks/useTranslations';
import language from '../../translations.json';
import { LANGUAGES, PATIENT_STATUS } from '../../utils/constants';
import RadioButtonField from '../Fields/RadioButtonField';
import TextField from '../Fields/TextField';
import './ManagePatientModal.scss';
import { Language, Patient, } from '@3dp4me/types';
import { FormOption } from '../Fields/FormOption';

export interface ManagePatientModalProps {
    patientData: Patient
    isOpen: boolean
    onClose: () => void
    onDataSave: (patient: Patient) => void
    onDeleted: () => void
}

const ManagePatientModal = ({
    patientData,
    isOpen,
    onClose,
    onDataSave,
    onDeleted,
}: ManagePatientModalProps) => {
    const [translations, selectedLang] = useTranslations();
    const [updatedPatientData, setUpdatedPatientData] = useState(
        _.cloneDeep(patientData),
    );

    const onFieldUpdate = (key: string, value: string) => {
        setUpdatedPatientData((data) => ({
            ...data,
            [key]: value,
        }));
    };

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
    ];

    const deletePatient = () => {
        swal({
            title: translations.components.modal.deleteTitle,
            text: translations.components.modal.deletePatientConfirmation,
            icon: 'warning',
            buttons: [true],
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                onClose();
                onDeleted();
            }
        });
    };

    return (
        <Modal open={isOpen} onClose={onClose} className="manage-patient-modal">
            <div
                className={`controller-manage-patient-wrapper ${
                    selectedLang === LANGUAGES.AR
                        ? 'controller-manage-patient-wrapper-ar'
                        : ''
                }`}
            >
                <div className="manage-patient-header">
                    <h2>{translations.components.swal.managePatient.title}</h2>
                    <Button onClick={onClose}>
                        <CloseIcon />
                    </Button>
                </div>

                <div className="profile-information-wrapper">
                    <h3>
                        {
                            translations.components.swal.managePatient.profileInformation
                        }
                    </h3>
                    <TextField
                        className="text-field"
                        value={updatedPatientData?.orderId}
                        fieldId="orderId"
                        isDisabled
                        displayName={
                            translations.components.swal.managePatient.orderId
                        }
                        onChange={onFieldUpdate}
                    />

                    <TextField
                        className="text-field"
                        value={updatedPatientData?.firstName}
                        fieldId="firstName"
                        displayName={
                            translations.components.swal.managePatient.firstName
                        }
                        onChange={onFieldUpdate}
                    />
                    <TextField
                        className="text-field"
                        value={updatedPatientData?.fathersName}
                        fieldId="fathersName"
                        displayName={
                            translations.components.swal.managePatient
                                .fatherName
                        }
                        onChange={onFieldUpdate}
                    />
                    <TextField
                        className="text-field"
                        value={updatedPatientData?.grandfathersName}
                        displayName={
                            translations.components.swal.managePatient
                                .grandfatherName
                        }
                        fieldId="grandfathersName"
                        onChange={onFieldUpdate}
                    />
                    <TextField
                        className="text-field"
                        value={updatedPatientData?.familyName}
                        fieldId="familyName"
                        displayName={
                            translations.components.swal.managePatient
                                .familyName
                        }
                        onChange={onFieldUpdate}
                    />

                    <RadioButtonField
                        className="text-field"
                        value={updatedPatientData?.status}
                        fieldId="status"
                        langKey={selectedLang}
                        title={
                            translations.components.swal.managePatient
                                .radioTitle
                        }
                        options={patientStatusOptions}
                        onChange={onFieldUpdate}
                    />
                </div>

                <div className="manage-patient-footer">
                    <Button
                        className="manage-patient-save-button"
                        onClick={() => {
                            onDataSave(updatedPatientData);
                        }}
                    >
                        {
                            translations.components.swal.managePatient.buttons
                                .save
                        }
                    </Button>
                    <Button
                        className="manage-patient-delete-button"
                        disabled
                        onClick={deletePatient}
                    >
                        {
                            translations.components.swal.managePatient.buttons
                                .delete
                        }
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ManagePatientModal;
