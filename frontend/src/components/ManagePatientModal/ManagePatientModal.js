import React, { useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import swal from 'sweetalert';
import CloseIcon from '@material-ui/icons/Close';

import { LanguageDataType } from '../../utils/custom-proptypes';
import patientFile from '../../Test Data/patient.json';
import './ManagePatientModal.scss';

const ManagePatientModal = (props) => {
    const [patientStatus, setPatientStatus] = useState('active');

    const key = props.languageData.selectedLanguage;
    const lang = props.languageData.translations[key];

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
        const name = document.getElementById('manage-patient-name').value;
        const dob = document.getElementById('manage-patient-dob').value;
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
                <p>{lang.components.swal.managePatient.name}</p>
                <TextField
                    id="manage-patient-name"
                    defaultValue={patientFile.patientInfo.name}
                />
                <p>{lang.components.swal.managePatient.dob}</p>
                <TextField
                    id="manage-patient-dob"
                    defaultValue={patientFile.patientInfo.dob}
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
                            value="active"
                            name="status"
                            checked={patientStatus === 'active'}
                        />{' '}
                        {lang.components.swal.managePatient.active}
                    </div>
                    <div>
                        <input
                            type="radio"
                            value="feedback"
                            name="status"
                            checked={patientStatus === 'feedback'}
                        />{' '}
                        {lang.components.swal.managePatient.feedback}
                    </div>
                    <div>
                        <input
                            type="radio"
                            value="archived"
                            name="status"
                            checked={patientStatus === 'archived'}
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
        </div>
    );
};

ManagePatientModal.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default ManagePatientModal;
