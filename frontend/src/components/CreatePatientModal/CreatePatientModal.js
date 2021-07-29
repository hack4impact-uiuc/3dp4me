import { Button, Modal, TextField } from '@material-ui/core';
import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import './CreatePatientModal.scss';

const CreatePatientModal = ({ isOpen, onClose }) => {
    const translations = useTranslations()[0];

    return (
        <Modal className="create-patient-modal" open={isOpen} onClose={onClose}>
            <div className="create-patient-modal-wrapper">
                <h2 style={{ fontWeight: 'bolder' }}>
                    {translations.components.swal.createPatient.title}
                </h2>
                <div style={{ fontSize: '17px', textAlign: 'left' }}>
                    <span>
                        {translations.components.swal.createPatient.firstName}
                    </span>
                    <TextField
                        size="small"
                        id="createFirstName"
                        fullWidth
                        style={{ padding: 10 }}
                        variant="outlined"
                    />
                    <span>
                        {translations.components.swal.createPatient.middleName}
                    </span>
                    <div style={{ display: 'flex' }}>
                        <TextField
                            size="small"
                            id="createFathersName"
                            fullWidth
                            style={{ padding: 10 }}
                            variant="outlined"
                        />
                        <TextField
                            size="small"
                            id="createGrandfathersName"
                            fullWidth
                            style={{ padding: 10 }}
                            variant="outlined"
                        />
                    </div>
                    <span>
                        {translations.components.swal.createPatient.lastName}
                    </span>
                    <TextField
                        size="small"
                        id="createFamilyName"
                        fullWidth
                        style={{ padding: 10 }}
                        variant="outlined"
                    />
                </div>
                <div
                    style={{
                        display: 'flex',
                        float: 'right',
                        paddingBottom: '10px',
                    }}
                >
                    <Button className="create-patient-button create-patient-edit-button">
                        {
                            translations.components.swal.createPatient.buttons
                                .edit
                        }
                    </Button>
                    <Button className="create-patient-button create-patient-close-button">
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
