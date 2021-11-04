import './CreateStepModal.scss';
import React, { useState } from 'react';
import { Button, Modal } from '@material-ui/core';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { useTranslations } from '../../hooks/useTranslations';
import MultiSelectField from '../Fields/MultiSelectField';
import LanguageInput from '../LanguageInput/LanguageInput';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import { ERR_LANGUAGE_VALIDATION_FAILED } from '../../utils/constants';

const CreateStepModal = ({ isOpen, onModalClose, allRoles, onAddNewStep }) => {
    const [translations, selectedLang] = useTranslations();
    const [selectedRoles, setSelectedRoles] = useState([]);
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

    // Ashay had this in fields.js, is it ok to just have this
    // because it's the only one we need?
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
        setSelectedRoles([]);
        setDisplayName({ EN: '', AR: '' });
    };

    const onDiscard = () => {
        clearState();
        onModalClose();
    };

    const saveNewStep = () => {
        // add key later
        // add stepNumber later
        const newStepData = {
            readableGroups: selectedRoles,
            writableGroups: selectedRoles,
            displayName,
            fields: [],
        };

        errorWrap(
            () => {
                validateStep(newStepData);
                // validate step
            },
            () => {
                onAddNewStep(newStepData);
                onModalClose();
                clearState();
            },
        );
    };

    // TODO: Make sure that the new steps are not uploaded onto the database until it is ready to be (upon save!)
    // TODO: Have admin auto-selected
    // QUESTION: Should I hold all the added steps as elements in an array and then upon saving, make a post request for them
    //           before moving
    // TODO: use button component!
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
