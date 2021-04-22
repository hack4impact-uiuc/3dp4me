import React, { useState } from 'react';
import {
    FormControlLabel,
    Radio,
    RadioGroup,
    Button,
    Modal,
    TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import { LanguageDataType } from '../../utils/custom-proptypes';
import './ManagePatientModal.scss';
import { PATIENT_STATUS, PATIENT_KEY_STATUS } from '../../utils/constants';
import _ from 'lodash';

const ManagePatientModal = ({
    languageData,
    patientData,
    isOpen,
    onClose,
    onDataSave,
}) => {
    const [updatedPatientData, setUpdatedPatientData] = useState(
        _.cloneDeep(patientData),
    );

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

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
                    key === 'AR' ? 'controller-manage-patient-wrapper-ar' : ''
                }`}
            >
                <div className="manage-patient-header">
                    <h2>{lang.components.swal.managePatient.title}</h2>
                    <Button onClick={onClose}>
                        <CloseIcon />
                    </Button>
                </div>

                <div className="profile-information-wrapper">
                    <h3>
                        {lang.components.swal.managePatient.profileInformation}
                    </h3>
                    <p>{lang.components.swal.managePatient.firstName}</p>
                    <TextField
                        value={updatedPatientData?.firstName}
                        name="firstName"
                        onChange={onFieldUpdate}
                    />
                    <p>{lang.components.swal.managePatient.fatherName}</p>
                    <TextField
                        value={updatedPatientData?.fathersName}
                        name="fathersName"
                        onChange={onFieldUpdate}
                    />
                    <p>{lang.components.swal.managePatient.grandfatherName}</p>
                    <TextField
                        value={updatedPatientData?.grandfathersName}
                        name="grandfathersName"
                        onChange={onFieldUpdate}
                    />
                    <p>{lang.components.swal.managePatient.familyName}</p>
                    <TextField
                        value={updatedPatientData?.familyName}
                        name="familyName"
                        onChange={onFieldUpdate}
                    />
                </div>
                <div className="profile-management-wrapper">
                    <h3>
                        {lang.components.swal.managePatient.profileManagement}
                    </h3>
                    <p>
                        {lang.components.swal.managePatient.archiveInformation}
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
                                        lang.components.swal.managePatient
                                            .active
                                    }
                                />
                                <FormControlLabel
                                    value={PATIENT_STATUS.FEEDBACK}
                                    control={<Radio />}
                                    label={
                                        lang.components.swal.managePatient
                                            .feedback
                                    }
                                />
                                <FormControlLabel
                                    value={PATIENT_STATUS.ARCHIVE}
                                    control={<Radio />}
                                    label={
                                        lang.components.swal.managePatient
                                            .archive
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
                        {lang.components.swal.managePatient.buttons.save}
                    </Button>
                </div>
                <p>{lang.components.swal.managePatient.orderId}</p>
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
    languageData: LanguageDataType.isRequired,
    patientId: PropTypes.string.isRequired,
    patientData: PropTypes.object.isRequired,
};

export default ManagePatientModal;
