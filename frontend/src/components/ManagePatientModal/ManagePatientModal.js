import React, { useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import swal from 'sweetalert';
import CloseIcon from '@material-ui/icons/Close';

import { LanguageDataType } from '../../utils/custom-proptypes';
import patientFile from '../../Test Data/patient.json';
import './ManagePatientModal.scss';
import { PATIENT_STATUS, PATIENT_KEY_STATUS } from '../../utils/constants';

const ManagePatientModal = ({ languageData }) => {
    const [patientStatus, setPatientStatus] = useState('active');

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const handleManagePatientStatus = (e) => {
        setPatientStatus(e.target.value);
    };

    const handleManagePatientClose = () => {
        swal.close();
    };

    const handleDeletePatient = () => {
        swal({
            title: lang.components.swal.managePatient.confirmDeleteMsg,
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                swal({
                    title: lang.components.swal.managePatient.deleteSuccessMsg,
                    icon: 'success',
                }).then(() => {
                    // TODO: call delete patient endpoint
                    window.location.href = '/';
                });
            }
        });
    };

    const handleManagePatientSave = () => {
        // const name = document.getelementbyid('manage-patient-name').value;
        // const dob = document.getelementbyid('manage-patient-dob').value;
        // TODO: call edit patient endpoint with new name / dob / patientStatus
        swal(lang.components.swal.managePatient.successMsg, '', 'success');
    };

    return (
        <div
            className={`controller-manage-patient-wrapper ${
                key === 'AR' ? 'controller-manage-patient-wrapper-ar' : ''
            }`}
        >
            <div className="manage-patient-header">
                <h2>{lang.components.swal.managePatient.title}</h2>
                <Button onClick={handleManagePatientClose}>
                    <CloseIcon />
                </Button>
            </div>
            <div className="profile-information-wrapper">
                <h3>{lang.components.swal.managePatient.profileInformation}</h3>
                <p>{lang.components.swal.managePatient.firstName}</p>
                <TextField
                    id="manage-patient-firstName"
                    defaultValue={patientFile.patientInfo.firstName}
                />
                <p>{lang.components.swal.managePatient.fatherName}</p>
                <TextField
                    id="manage-patient-fatherName"
                    defaultValue={patientFile.patientInfo.fatherName}
                />
                <p>{lang.components.swal.managePatient.grandfatherName}</p>
                <TextField
                    id="manage-patient-grandfatherName"
                    defaultValue={patientFile.patientInfo.grandfatherName}
                />
                <p>{lang.components.swal.managePatient.familyName}</p>
                <TextField
                    id="manage-patient-familyName"
                    defaultValue={patientFile.patientInfo.familyName}
                />
            </div>
            <div className="profile-management-wrapper">
                <h3>{lang.components.swal.managePatient.profileManagement}</h3>
                <p>{lang.components.swal.managePatient.archiveInformation}</p>
                <div
                    className="profile-management-radio-button-group"
                    onChange={handleManagePatientStatus}
                >
                    <div>
                        <input
                            type="radio"
                            value={PATIENT_STATUS.ACTIVE}
                            name={PATIENT_KEY_STATUS}
                            checked={patientStatus === PATIENT_STATUS.ACTIVE}
                        />{' '}
                        {lang.components.swal.managePatient.active}
                    </div>
                    <div>
                        <input
                            type="radio"
                            value={PATIENT_STATUS.FEEDBACK}
                            name={PATIENT_KEY_STATUS}
                            checked={patientStatus === PATIENT_STATUS.FEEDBACK}
                        />{' '}
                        {lang.components.swal.managePatient.feedback}
                    </div>
                    <div>
                        <input
                            type="radio"
                            value={PATIENT_STATUS.ARCHIVE}
                            name={PATIENT_KEY_STATUS}
                            checked={patientStatus === PATIENT_STATUS.ARCHIVE}
                        />{' '}
                        {lang.components.swal.managePatient.archive}
                    </div>
                </div>
            </div>
            <div
                className={`manage-patient-delete ${
                    key === 'AR' ? 'manage-patient-delete-ar' : ''
                }`}
            >
                <p>{lang.components.swal.managePatient.deleteInformation}</p>
                <Button
                    className="manage-patient-delete-button"
                    onClick={handleDeletePatient}
                >
                    {lang.components.swal.managePatient.buttons.delete}
                </Button>
            </div>
            <div className="manage-patient-footer">
                <Button
                    className="manage-patient-save-button"
                    onClick={handleManagePatientSave}
                >
                    {lang.components.swal.managePatient.buttons.save}
                </Button>
            </div>
            <p>{lang.components.swal.managePatient.orderId}</p>
            <TextField
                id="manage-patient-orderId"
                defaultValue={patientFile.patientInfo.orderId}
            />
        </div>
    );
};

ManagePatientModal.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default ManagePatientModal;
