import './CreateStepModal.scss';
import React, { useState } from 'react';
import { Button, Modal } from '@material-ui/core';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { useTranslations } from '../../hooks/useTranslations';
import MultiSelectField from '../Fields/MultiSelectField';
import LanguageInput from '../LanguageInput/LanguageInput';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import {
    ERR_LANGUAGE_VALIDATION_FAILED,
    ADMIN_ID,
} from '../../utils/constants';

const CreateStepModal = ({ isOpen, onModalClose, allRoles, onAddNewStep }) => {
    const [translations, selectedLang] = useTranslations();
    const [selectedRoles, setSelectedRoles] = useState([ADMIN_ID]);
    const [displayName, setDisplayName] = useState({ EN: '', AR: '' });

    const errorWrap = useErrorWrap();

    const onRolesChange = (id, roles) => {
        setSelectedRoles(roles);
    };
    const updateDisplayName = (value, language) => {
        const updatedDisplayName = _.clone(displayName);
        updatedDisplayName[language] = value;

        setDisplayName(updatedDisplayName);
    };

    const validateStep = (stepData) => {
        if (stepData.displayName.EN === '' || stepData.displayName.AR === '') {
            throw new Error(ERR_LANGUAGE_VALIDATION_FAILED);
        }
    };

    const generateFields = () => {
        return (
            <div className="create-step-modal-field-container">
                <span>Step Title</span>
                <LanguageInput
                    fieldValues={displayName}
                    handleFieldChange={(value, language) => {
                        updateDisplayName(value, language);
                    }}
                />
            </div>
        );
    };

    const clearState = () => {
        setSelectedRoles([ADMIN_ID]);
        setDisplayName({ EN: '', AR: '' });
    };

    const onDiscard = () => {
        clearState();
        onModalClose();
    };

    const saveNewStep = () => {
        const newStepData = {
            readableGroups: selectedRoles,
            writableGroups: selectedRoles,
            displayName,
            fields: [],
        };

        errorWrap(
            () => {
                validateStep(newStepData);
            },
            () => {
                onAddNewStep(newStepData);
                onModalClose();
                clearState();
            },
        );
    };

    return (
        <Modal
            open={isOpen}
            onClose={onModalClose}
            className="create-step-modal"
        >
            <div className="create-step-modal-wrapper">
                <h2 className="create-step-modal-title">New Step</h2>
                <div className="create-step-modal-text">{generateFields()}</div>

                <div style={{ padding: 10 }}>
                    <MultiSelectField
                        title={translations.components.swal.field.clearance}
                        langKey={selectedLang}
                        options={allRoles}
                        selectedOptions={selectedRoles}
                        onChange={onRolesChange}
                        isDisabled={false}
                        disabledOptions={[ADMIN_ID]}
                    />
                </div>

                <div>
                    <Button onClick={saveNewStep} className="save-step-button">
                        {translations.components.swal.field.buttons.save}
                    </Button>
                    <Button onClick={onDiscard} className="discard-step-button">
                        {translations.components.swal.field.buttons.discard}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

CreateStepModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onModalClose: PropTypes.func.isRequired,
    allRoles: PropTypes.array.isRequired,
    onAddNewStep: PropTypes.func.isRequired,
};

export default CreateStepModal;
