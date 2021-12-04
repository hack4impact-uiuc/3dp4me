import './EditStepModal.scss';
import React, { useState, useEffect } from 'react';
import { Button, Modal, FormControlLabel } from '@material-ui/core';
import PropTypes from 'prop-types';
import _ from 'lodash';
import swal from 'sweetalert';

import CustomSwitch from '../CustomSwitch/CustomSwitch';
import { useTranslations } from '../../hooks/useTranslations';
import MultiSelectField from '../Fields/MultiSelectField';
import LanguageInput from '../LanguageInput/LanguageInput';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import {
    ERR_LANGUAGE_VALIDATION_FAILED,
    ADMIN_ID,
} from '../../utils/constants';

const EditStepModal = ({
    isOpen,
    onModalClose,
    allRoles,
    initialData,
    onEditStep,
}) => {
    const [translations, selectedLang] = useTranslations();
    const [selectedRoles, setSelectedRoles] = useState([ADMIN_ID]);
    const [displayName, setDisplayName] = useState({ EN: '', AR: '' });
    const [isHidden, setIsHidden] = useState(false);

    const errorWrap = useErrorWrap();

    useEffect(() => {
        setDisplayName(initialData.displayName);
        setIsHidden(initialData.isHidden);

        const initialRoles = initialData.readableGroups;

        // Automatically select the admin role
        if (initialRoles.indexOf(ADMIN_ID) === -1) {
            initialRoles.push(ADMIN_ID);
        }

        setSelectedRoles(initialRoles);
    }, [initialData, isOpen]);

    const onRolesChange = (id, roles) => {
        setSelectedRoles(roles);
    };
    const updateDisplayName = (value, language) => {
        const updatedDisplayName = _.clone(displayName);
        updatedDisplayName[language] = value;

        setDisplayName(updatedDisplayName);
    };

    const validateStep = (stepData) => {
        if (
            stepData.displayName.EN.trim() === '' ||
            stepData.displayName.AR.trim() === ''
        ) {
            throw new Error(ERR_LANGUAGE_VALIDATION_FAILED);
        }
    };

    const generateFields = () => {
        return (
            <div className="create-step-modal-field-container">
                <span>{translations.components.swal.step.createStepTitle}</span>
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

    const getUpdatedData = () => {
        const editStepData = {
            readableGroups: selectedRoles,
            writableGroups: selectedRoles,
            displayName,
            fields: initialData.fields,
            stepNumber: initialData.stepNumber,
            key: initialData.key,
            isHidden,
            isDeleted: initialData.isDeleted,
            defaultToListView: initialData.defaultToListView,
        };

        return editStepData;
    };

    const saveField = () => {
        const newFieldData = getUpdatedData();
        updateStep(newFieldData);
    };

    const updateStep = (editStepData) => {
        errorWrap(
            () => {
                validateStep(editStepData);
            },
            () => {
                onEditStep(editStepData);
                onModalClose();
                clearState();
            },
        );
    };

    const onDelete = () => {
        swal({
            title: translations.components.modal.deleteTitle,
            text: translations.components.modal.deleteConfirmation,
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                const deletedFieldData = getUpdatedData();
                deletedFieldData.isDeleted = true;
                updateStep(deletedFieldData);
            }
        });
    };

    const handleHiddenFieldSwitchChange = (isChecked) => {
        // added the "not" operator because when the switch is on, we want isHidden to be false
        setIsHidden(!isChecked);
    };

    const generateHiddenFieldSwitch = () => {
        return (
            <FormControlLabel
                className="hidden-field-switch"
                control={
                    <CustomSwitch
                        checked={!isHidden}
                        setChecked={handleHiddenFieldSwitchChange}
                    />
                }
            />
        );
    };

    return (
        <Modal open={isOpen} onClose={onModalClose} className="edit-step-modal">
            <div className="edit-step-modal-wrapper">
                <div className="edit-step-modal-title-div">
                    <h2 className="edit-step-modal-title">
                        {translations.components.swal.step.editStepHeader}
                    </h2>
                    {generateHiddenFieldSwitch()}
                </div>

                <div className="edit-step-modal-text">{generateFields()}</div>

                <div className="edit-step-multiselect">
                    <MultiSelectField
                        title={translations.components.swal.step.clearance}
                        langKey={selectedLang}
                        options={allRoles}
                        selectedOptions={selectedRoles}
                        onChange={onRolesChange}
                        isDisabled={false}
                        disabledOptions={[ADMIN_ID]}
                    />
                </div>

                <div
                    style={{
                        float: 'right',
                        paddingBottom: '10px',
                    }}
                >
                    <Button onClick={saveField} className="save-step-button">
                        {translations.components.swal.step.buttons.save}
                    </Button>
                    <Button onClick={onDiscard} className="discard-step-button">
                        {translations.components.swal.step.buttons.discard}
                    </Button>
                    <Button onClick={onDelete} className="delete-field-button">
                        {translations.components.swal.field.buttons.delete}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

EditStepModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onModalClose: PropTypes.func.isRequired,
    allRoles: PropTypes.array.isRequired,
    initialData: PropTypes.object.isRequired,
    onEditStep: PropTypes.func.isRequired,
};

export default EditStepModal;
