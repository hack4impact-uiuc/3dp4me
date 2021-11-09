import {
    Button, FormControlLabel, Modal, Radio,
    RadioGroup
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { useTranslations } from '../../hooks/useTranslations';
import { LANGUAGES, PATIENT_STATUS } from '../../utils/constants';
import TextField from '../Fields/TextField';
import './ManagePatientModal.scss';


const ManagePatientModal = ({ patientData, isOpen, onClose, onDataSave }) => {
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
                            translations.components.swal.managePatient
                                .profileInformation
                        }
                    </h3>
                    <TextField
                        className="text-field"
                        value={updatedPatientData?.orderId}
                        name="orderId"
                        displayName={translations.components.swal.managePatient.orderId}
                        onChange={onFieldUpdate}/>

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
                </div>
                <div className="profile-management-wrapper">
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
