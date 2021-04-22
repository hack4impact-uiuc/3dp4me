import React, { useState } from 'react';
import { Button, Modal, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import { LanguageDataType } from '../../utils/custom-proptypes';
import './ManagePatientModal.scss';
import { PATIENT_STATUS, PATIENT_KEY_STATUS } from '../../utils/constants';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import { updatePatient } from '../../utils/api';
import _ from 'lodash';

const ManagePatientModal = ({
    languageData,
    patientId,
    patientData,
    isOpen,
    onClose,
    onDataSave,
}) => {
    const errorWrap = useErrorWrap();
    const [updatedPatientData, setUpdatedPatientData] = useState(
        _.cloneDeep(patientData),
    );

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const handleManagePatientStatus = (e) => {
        //setPatientStatus(e.target.value);
    };

    const handleManagePatientClose = () => {
        // swal.close();
    };

    const getRadioButtonValue = (buttonName) => {
        let ele = document.getElementsByName(buttonName);

        for (let i = 0; i < ele.length; i++) {
            if (ele[i].checked) return ele[i].value;
        }

        return null;
    };

    // TODO: Populate modal data
    const handleManagePatientSave = async () => {
        const firstName = document.getElementById('manage-patient-firstName')
            .value;
        const fatherName = document.getElementById('manage-patient-fatherName')
            .value;
        const grandfatherName = document.getElementById(
            'manage-patient-grandfatherName',
        ).value;
        const familyName = document.getElementById('manage-patient-familyName')
            .value;
        const orderId = document.getElementById('manage-patient-orderId').value;
        const status = getRadioButtonValue(PATIENT_KEY_STATUS);

        const updatedData = {
            firstName: firstName,
            fathersName: fatherName,
            grandfathersName: grandfatherName,
            familyName: familyName,
            orderId: orderId,
        };

        if (status) updatedData.status = status;

        // Think we need to get rid of the swal
        await errorWrap(async () => {
            await updatePatient(patientId, updatedData);
        });

        // swal(lang.components.swal.managePatient.successMsg, '', 'success');
    };

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
                    <Button onClick={handleManagePatientClose}>
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
                    <div
                        className="profile-management-radio-button-group"
                        onChange={handleManagePatientStatus}
                    >
                        <div>
                            <input
                                type="radio"
                                value={PATIENT_STATUS.ACTIVE}
                                name={PATIENT_KEY_STATUS}
                                checked={
                                    patientData?.status ===
                                    PATIENT_STATUS.ACTIVE
                                }
                            />{' '}
                            {lang.components.swal.managePatient.active}
                        </div>
                        <div>
                            <input
                                type="radio"
                                value={PATIENT_STATUS.FEEDBACK}
                                name={PATIENT_KEY_STATUS}
                                checked={
                                    patientData?.status ===
                                    PATIENT_STATUS.FEEDBACK
                                }
                            />{' '}
                            {lang.components.swal.managePatient.feedback}
                        </div>
                        <div>
                            <input
                                type="radio"
                                value={PATIENT_STATUS.ARCHIVE}
                                name={PATIENT_KEY_STATUS}
                                checked={
                                    patientData?.status ===
                                    PATIENT_STATUS.ARCHIVE
                                }
                            />{' '}
                            {lang.components.swal.managePatient.archive}
                        </div>
                    </div>
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
