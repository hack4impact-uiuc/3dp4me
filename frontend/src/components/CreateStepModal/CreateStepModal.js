import './CreateStepModal.scss';
import React, { useState } from 'react';
import { Button, Modal } from '@material-ui/core';
import PropTypes from 'prop-types';

import { useTranslations } from '../../hooks/useTranslations';
import MultiSelectField from '../Fields/MultiSelectField';
import LanguageInput from '../LanguageInput/LanguageInput';

// Need: readableGroups, writeableGroups, key, displayName, stepNumber, fields (empty at first?)
// key will be dealt with in DashboardManagement!
// Question: handle step number in DashboardManagement too?
//      Can loop through the array and add 1 to the highest number

// Next steps: connect to backend

const CreateStepModal = ({ isOpen, onModalClose, allRoles, onAddNewStep }) => {
    const [translations, selectedLang] = useTranslations();
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [displayName, setDisplayName] = useState({ EN: '', AR: '' });

    // const [options, setOptions] = useState([]);

    const onRolesChange = (id, roles) => {
        setSelectedRoles(roles);
    };

    const updateEnglishDisplayName = (e) => {
        setDisplayName({ ...displayName, EN: e.target.value });
    };

    const updateArabicDisplayName = (e) => {
        setDisplayName({ ...displayName, AR: e.target.value });
    };

    const generateFields = () => {
        return (
            <div className="create-step-modal-field-container">
                <span>Step Title</span>
                <LanguageInput
                    fieldValues={displayName}
                    handleEnglishFieldChange={updateEnglishDisplayName}
                    handleArabicFieldChange={updateArabicDisplayName}
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
        onAddNewStep(newStepData);
        onModalClose();
        clearState();
    };

    // Formatting Question: Do we want to use the initial format of the text field inputs or the languageInput styling?
    //      languageInput
    // Formatting Question: Should we clear state when clicking out of modal (without clicking discard)?
    //      No! Don't need to
    // Question: How should I handle fields upon creation?
    //      Empty array!

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
                        title={
                            translations.components.swal.createField.clearance
                        }
                        langKey={selectedLang}
                        options={allRoles}
                        selectedOptions={selectedRoles}
                        onChange={onRolesChange}
                        isDisabled={false}
                    />
                </div>

                <div>
                    <Button onClick={saveNewStep} className="save-step-button">
                        {translations.components.swal.createField.buttons.save}
                    </Button>
                    <Button onClick={onDiscard} className="discard-step-button">
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
    allRoles: PropTypes.array.isRequired,
    onAddNewStep: PropTypes.func.isRequired,
};

export default CreateStepModal;
