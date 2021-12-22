import { Button, Modal } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { useTranslations } from '../../hooks/useTranslations';
import language from '../../translations.json';
import { LANGUAGES, PATIENT_STATUS } from '../../utils/constants';
import RadioButtonField from '../Fields/RadioButtonField';
import TextField from '../Fields/TextField';
import './ManagePatientModal.scss';
import swal from 'sweetalert';

const ManagePatientModal = ({ patientData, isOpen, onClose, onDataSave, onDeleted }) => {
    const [translations, selectedLang] = useTranslations();
    const [updatedPatientData, setUpdatedPatientData] = useState(
        _.cloneDeep(patientData),
    );

    const onFieldUpdate = (key, value) => {
        setUpdatedPatientData((data) => ({
            ...data,
            [key]: value,
        }));
    };

    const patientStatusOptions = [
        {
            _id: PATIENT_STATUS.ACTIVE,
            IsHidden: false,
            Question: {
                [LANGUAGES.EN]: language[LANGUAGES.EN].status.active,
                [LANGUAGES.AR]: language[LANGUAGES.EN].status.active,
            },
        },
        {
            _id: PATIENT_STATUS.FEEDBACK,
            IsHidden: false,
            Question: {
                [LANGUAGES.EN]: language[LANGUAGES.EN].status.feedback,
                [LANGUAGES.AR]: language[LANGUAGES.EN].status.feedback,
            },
        },
        {
            _id: PATIENT_STATUS.ARCHIVE,
            IsHidden: false,
            Question: {
                [LANGUAGES.EN]: language[LANGUAGES.EN].status.archive,
                [LANGUAGES.AR]: language[LANGUAGES.EN].status.archive,
            },
        },
    ];

    const deletePatient = () => {
        swal({
            title: translations.components.modal.deleteTitle,
            text: translations.components.modal.deletePatientConfirmation,
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                onClose();
                onDeleted();
            }
        });
    }

    return (
        <Modal open={isOpen} onClose={onClose} className="manage-patient-modal">
            <div
                className={`controller-manage-patient-wrapper ${selectedLang === LANGUAGES.AR
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
                            translations.components.swal.managePatient
                                .profileInformation
                        }
                    </h3>
                    <TextField
                        className="text-field"
                        value={updatedPatientData?.orderId}
                        fieldId="orderId"
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

ManagePatientModal.propTypes = {
    patientData: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDataSave: PropTypes.func.isRequired,
    onDeleted: PropTypes.func.isRequired,
};

export default ManagePatientModal;
