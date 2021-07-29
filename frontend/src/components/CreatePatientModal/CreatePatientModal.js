import { Button, Modal, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import './CreatePatientModal.scss';

const CreatePatientModal = ({ isOpen, onClose, onSave, onSaveAndEdit }) => {
    const translations = useTranslations()[0];
    const [firstName, setFirstName] = useState('');
    const [fathersName, setFathersName] = useState('');
    const [grandfathersName, setGrandfathersName] = useState('');
    const [familyName, setFamilyName] = useState('');

    const onSavePatient = (isSaveAndEdit) => {
        const patientData = {
            firstName: firstName,
            fathersName: fathersName,
            grandfathersName: grandfathersName,
            familyName: familyName,
        };

        if (isSaveAndEdit) onSaveAndEdit(patientData);
        else onSave(patientData);

        onClose();
    };

    return (
        <Modal className="create-patient-modal" open={isOpen} onClose={onClose}>
            <div className="create-patient-modal-wrapper">
                <h2 className="create-patient-header">
                    {translations.components.swal.createPatient.title}
                </h2>
                <div className="create-patient-input-wrapper">
                    <span>
                        {translations.components.swal.createPatient.firstName}
                    </span>
                    <TextField
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="create-patient-text-field"
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                    <span>
                        {translations.components.swal.createPatient.middleName}
                    </span>
                    <div className="create-patient-row">
                        <TextField
                            value={fathersName}
                            onChange={(e) => setFathersName(e.target.value)}
                            className="create-patient-text-field"
                            size="small"
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            value={grandfathersName}
                            onChange={(e) =>
                                setGrandfathersName(e.target.value)
                            }
                            className="create-patient-text-field"
                            size="small"
                            variant="outlined"
                            fullWidth
                        />
                    </div>
                    <span>
                        {translations.components.swal.createPatient.lastName}
                    </span>
                    <TextField
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                        className="create-patient-text-field"
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                </div>
                <div className="create-patient-button-container">
                    <Button
                        className="create-patient-button create-patient-edit-button"
                        onClick={() => onSavePatient(true)}
                    >
                        {
                            translations.components.swal.createPatient.buttons
                                .edit
                        }
                    </Button>
                    <Button
                        className="create-patient-button create-patient-close-button"
                        onClick={() => onSavePatient(false)}
                    >
                        {
                            translations.components.swal.createPatient.buttons
                                .noEdit
                        }
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

CreatePatientModal.propTypes = {};

export default CreatePatientModal;
