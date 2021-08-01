import './CreateStepModal.scss';
import React from 'react';
import { Button, TextField, Modal } from '@material-ui/core';
import PropTypes from 'prop-types';

import { useTranslations } from '../../hooks/useTranslations';

const CreateStepModal = ({ isOpen, onModalClose }) => {
    const translations = useTranslations()[0];

    const generateFields = () => {
        return (
            <div className="create-step-modal-field-container">
                <span>Section Title</span>

                <p className="create-step-modal-subheading">English</p>
                <TextField
                    className="create-step-modal-field"
                    size="small"
                    variant="outlined"
                />

                <p className="create-step-modal-subheading">Arabic</p>
                <TextField
                    className="create-step-modal-field"
                    size="small"
                    variant="outlined"
                />
            </div>
        );
    };

    return (
        <Modal
            open={isOpen}
            onClose={onModalClose}
            className="create-step-modal"
        >
            <div className="create-step-modal-wrapper">
                <h2 className="create-step-modal-title">New Section</h2>
                <div className="create-step-modal-text">{generateFields()}</div>

                <div>
                    <Button onClick={onModalClose} className="save-step-button">
                        {translations.components.swal.createField.buttons.save}
                    </Button>
                    <Button
                        onClick={onModalClose}
                        className="discard-step-button"
                    >
                        {
                            translations.components.swal.createField.buttons
                                .discard
                        }
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

CreateStepModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onModalClose: PropTypes.func.isRequired,
};

export default CreateStepModal;
