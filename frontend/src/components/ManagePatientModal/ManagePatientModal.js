import React, { useState } from 'react';
import {
    FormControlLabel,
    Radio,
    RadioGroup,
    Button,
    Modal,
    TextField,
} from '@material-ui/core';
import _ from 'lodash';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';

import './ManagePatientModal.scss';
import { LANGUAGES, PATIENT_STATUS } from '../../utils/constants';
import { useTranslations } from '../../hooks/useTranslations';

const ManagePatientModal = ({ patientData, isOpen, onClose, onDataSave }) => {
    const [translations, selectedLang] = useTranslations();
    const [updatedPatientData, setUpdatedPatientData] = useState(
        _.cloneDeep(patientData),
    );

    const onFieldUpdate = (e) => {
        e.persist();
        setUpdatedPatientData((data) => ({
            ...data,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
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
                            translations.components.swal.managePatient
                                .profileInformation
                        }
                    </h3>
                    <p>
                        {translations.components.swal.managePatient.firstName}
                    </p>
                    <TextField
                        value={updatedPatientData?.firstName}
                        name="firstName"
                        onChange={onFieldUpdate}
                    />
                    <p>
                        {translations.components.swal.managePatient.fatherName}
                    </p>
                    <TextField
                        value={updatedPatientData?.fathersName}
                        name="fathersName"
                        onChange={onFieldUpdate}
                    />
                    <p>
                        {
                            translations.components.swal.managePatient
                                .grandfatherName
                        }
                    </p>
                    <TextField
                        value={updatedPatientData?.grandfathersName}
                        name="grandfathersName"
                        onChange={onFieldUpdate}
                    />
                    <p>
                        {translations.components.swal.managePatient.familyName}
                    </p>
                    <TextField
                        value={updatedPatientData?.familyName}
                        name="familyName"
                        onChange={onFieldUpdate}
                    />
                </div>
                <div className="profile-management-wrapper">
                    <h3>
                        {
                            translations.components.swal.managePatient
                                .profileManagement
                        }
                    </h3>
                    <p>
                        {
                            translations.components.swal.managePatient
                                .archiveInformation
                        }
                    </p>
                    <div className="profile-management-radio-button-group">
                        <div>
                            <RadioGroup
                                name="status"
                                onChange={onFieldUpdate}
                                value={updatedPatientData?.status}
                            >
                                <FormControlLabel
                                    value={PATIENT_STATUS.ACTIVE}
                                    control={<Radio />}
                                    label={
                                        translations.components.swal
                                            .managePatient.active
                                    }
                                />
                                <FormControlLabel
                                    value={PATIENT_STATUS.FEEDBACK}
                                    control={<Radio />}
                                    label={
                                        translations.components.swal
                                            .managePatient.feedback
                                    }
                                />
                                <FormControlLabel
                                    value={PATIENT_STATUS.ARCHIVE}
                                    control={<Radio />}
                                    label={
                                        translations.components.swal
                                            .managePatient.archive
                                    }
                                />
                            </RadioGroup>
                        </div>
                    </div>
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
                </div>
                <p>{translations.components.swal.managePatient.orderId}</p>
                <TextField
                    value={updatedPatientData?.orderId}
                    name="orderId"
                    onChange={onFieldUpdate}
                />
            </div>
        </Modal>
    );
};

ManagePatientModal.propTypes = {
    patientData: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDataSave: PropTypes.func.isRequired,
};

export default ManagePatientModal;
