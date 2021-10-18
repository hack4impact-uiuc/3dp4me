import './CreateFieldModal.scss';
import React, { useState } from 'react';
import {
    Button,
    Checkbox,
    Modal,
    NativeSelect,
    withStyles,
    InputBase,
    FormControl,
    InputLabel,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import _ from 'lodash';

import MultiSelectField from '../Fields/MultiSelectField';
import { FIELD_TYPES } from '../../utils/constants';
import LanguageInput from '../LanguageInput/LanguageInput';
import { useTranslations } from '../../hooks/useTranslations';

const CreateFieldModal = ({ isOpen, onModalClose, allRoles, addNewField }) => {
    const [translations, selectedLang] = useTranslations();
    const [fieldType, setFieldType] = useState(FIELD_TYPES.STRING);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [isVisibleOnDashboard, setIsVisibleOnDashboard] = useState(false);
    const [displayName, setDisplayName] = useState({ EN: '', AR: '' });
    const [options, setOptions] = useState([]);

    const BootstrapInput = withStyles((theme) => ({
        root: {
            'label + &': {
                marginTop: theme.spacing(3),
            },
        },
        input: {
            borderRadius: 4,
            position: 'relative',
            backgroundColor: '#dedffb',
            border: '1px solid #ced4da',
            fontSize: 16,
            padding: '10px 26px 10px 12px',
            transition: theme.transitions.create([
                'border-color',
                'box-shadow',
            ]),
            // Use the system font instead of the default Roboto font.
            '&:focus': {
                borderRadius: 4,
                borderColor: '#80bdff',
                boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
            },
            selected: {
                backgroundColor: '#dedffb',
            },
        },
    }))(InputBase);

    const onRolesChange = (id, roles) => {
        setSelectedRoles(roles);
    };

    const handleFieldTypeSelect = (e) => {
        setFieldType(e.target.value);
    };

    const incrementChoices = () => {
        const updatedOptions = _.cloneDeep(options);
        updatedOptions.push({ EN: '', AR: '' });
        setOptions(updatedOptions);
    };

    const updateChoiceEnglishField = (index, val) => {
        const updatedOptions = _.cloneDeep(options);
        updatedOptions[index].EN = val;
        setOptions(updatedOptions);
    };

    const updateChoiceArabicField = (index, val) => {
        const updatedOptions = _.cloneDeep(options);
        updatedOptions[index].AR = val;
        setOptions(updatedOptions);
    };

    const moveChoiceDown = (index) => {
        if (index < options.length - 1) {
            const updatedOptions = _.cloneDeep(options);
            const removedChoice = updatedOptions.splice(index, 1)[0];
            updatedOptions.splice(index + 1, 0, removedChoice);
            setOptions(updatedOptions);
        }
    };

    const moveChoiceUp = (index) => {
        if (index > 0) {
            const updatedOptions = _.cloneDeep(options);
            const removedChoice = updatedOptions.splice(index, 1)[0];
            updatedOptions.splice(index - 1, 0, removedChoice);
            setOptions(updatedOptions);
        }
    };

    const deleteChoice = (index) => {
        const updatedOptions = _.cloneDeep(options);
        updatedOptions.splice(index, 1);
        setOptions(updatedOptions);
    };

    const generateChoices = () => {
        const choices = [];
        for (let i = 0; i < options.length; i++) {
            choices.push(
                <div>
                    <span>
                        {`${translations.components.swal.createField.option} ${
                            i + 1
                        }`}
                    </span>
                    <LanguageInput
                        fieldValues={{ EN: options[i].EN, AR: options[i].AR }}
                        handleEnglishFieldChange={(event) => {
                            updateChoiceEnglishField(i, event.target.value);
                        }}
                        handleArabicFieldChange={(event) => {
                            updateChoiceArabicField(i, event.target.value);
                        }}
                        onDelete={() => {
                            deleteChoice(i);
                        }}
                        onUpPressed={() => {
                            moveChoiceUp(i);
                        }}
                        onDownPressed={() => {
                            moveChoiceDown(i);
                        }}
                    />
                </div>,
            );
        }
        return <div>{choices}</div>;
    };

    const updateEnglishDisplayName = (e) => {
        setDisplayName({ ...displayName, EN: e.target.value });
    };

    const updateArabicDislayName = (e) => {
        setDisplayName({ ...displayName, AR: e.target.value });
    };

    const generateFields = () => {
        switch (fieldType) {
            case FIELD_TYPES.STRING:
            case FIELD_TYPES.MULTILINE_STRING:
            case FIELD_TYPES.DATE:
            case FIELD_TYPES.PHONE:
            case FIELD_TYPES.NUMBER:
            case FIELD_TYPES.FILE:
            case FIELD_TYPES.AUDIO:
                return (
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>Question</span>
                        <LanguageInput
                            fieldValues={displayName}
                            handleEnglishFieldChange={updateEnglishDisplayName}
                            handleArabicFieldChange={updateArabicDislayName}
                        />
                    </div>
                );
            case FIELD_TYPES.RADIO_BUTTON:
            case FIELD_TYPES.DROPDOWN:
                return (
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>Question</span>
                        <LanguageInput
                            fieldValues={displayName}
                            handleEnglishFieldChange={updateEnglishDisplayName}
                            handleArabicFieldChange={updateArabicDislayName}
                        />
                        <Button
                            className="add-option-button"
                            onClick={incrementChoices}
                        >
                            {
                                translations.components.swal.createField.buttons
                                    .addChoice
                            }
                        </Button>
                        {generateChoices()}
                    </div>
                );
            case FIELD_TYPES.DIVIDER:
                return (
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>Divider Title</span>
                        <LanguageInput
                            fieldValues={displayName}
                            handleEnglishFieldChange={updateEnglishDisplayName}
                            handleArabicFieldChange={updateArabicDislayName}
                        />
                    </div>
                );
            case FIELD_TYPES.HEADER:
                return (
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>Header Title</span>
                        <LanguageInput
                            fieldValues={displayName}
                            handleEnglishFieldChange={updateEnglishDisplayName}
                            handleArabicFieldChange={updateArabicDislayName}
                        />
                    </div>
                );
            // case FIELD_TYPES.FIELD_GROUP:
            //     return (
            //        <div>Add Field</div>
            //     )
            default:
                return <p>This field is not yet supported</p>;
        }
    };

    const generateFieldDropdownOptions = () => {
        const fieldDropdownOptions = [];
        Object.values(FIELD_TYPES).forEach((value) => {
            fieldDropdownOptions.push(
                <option value={value} className="create-field-option">
                    {value}
                </option>,
            );
        });

        return fieldDropdownOptions;
    };

    const saveNewField = () => {
        const formattedOptions = options.map((option, index) => {
            return { Index: index, Question: option };
        });

        const newFieldData = {
            fieldType,
            isVisibleOnDashboard,
            displayName,
            options: formattedOptions,
            readableGroups: selectedRoles,
            writableGroups: selectedRoles,
            subFields: [],
        };

        addNewField(newFieldData);
        onModalClose();
        clearState();
    };

    const handleIsVisibleOnDashboard = (event) => {
        setIsVisibleOnDashboard(event.target.checked);
    };

    const clearState = () => {
        setSelectedRoles([]);
        setIsVisibleOnDashboard(false);
        setDisplayName({ EN: '', AR: '' });
        setOptions([]);
        setFieldType(FIELD_TYPES.STRING);
    };

    const onDiscard = () => {
        clearState();
        onModalClose();
    };

    return (
        <Modal
            open={isOpen}
            onClose={onModalClose}
            className="create-field-modal"
        >
            <div className="create-field-modal-wrapper">
                <span className="create-field-title1">
                    {translations.components.swal.createField.title}
                </span>
                <span className="create-field-title2">
                    {translations.components.swal.createField.title2}
                </span>
                <div className="create-field-title3">
                    <div style={{ padding: 10 }}>
                        <FormControl>
                            <InputLabel htmlFor="create-field-type-dropdown">
                                {
                                    translations.components.swal.createField
                                        .fieldType
                                }
                            </InputLabel>
                            <NativeSelect
                                id="create-field-type-dropdown"
                                onChange={handleFieldTypeSelect}
                                MenuProps={{
                                    style: { zIndex: 35001 },
                                }}
                                defaultValue={fieldType}
                                input={<BootstrapInput />}
                            >
                                {generateFieldDropdownOptions()}
                            </NativeSelect>
                        </FormControl>
                    </div>
                    <div style={{ padding: 10 }}>
                        <MultiSelectField
                            title={
                                translations.components.swal.createField
                                    .clearance
                            }
                            langKey={selectedLang}
                            options={allRoles}
                            selectedOptions={selectedRoles}
                            onChange={onRolesChange}
                            isDisabled={false}
                        />
                    </div>
                    <span>
                        {translations.components.swal.createField.customization}
                    </span>
                    <div style={{ padding: 10 }}>
                        <Checkbox
                            size="medium"
                            checked={isVisibleOnDashboard}
                            onChange={handleIsVisibleOnDashboard}
                        />
                        <span>
                            {
                                translations.components.swal.createField
                                    .showOnDashBoard
                            }
                        </span>
                    </div>
                </div>
                <span className="create-field-title3">
                    {translations.components.swal.createField.field}{' '}
                </span>
                {generateFields()}
                <div
                    style={{
                        display: 'flex',
                        float: 'right',
                        paddingBottom: '10px',
                    }}
                >
                    <Button
                        onClick={saveNewField}
                        className="save-field-button"
                    >
                        {translations.components.swal.createField.buttons.save}
                    </Button>
                    <Button
                        onClick={onDiscard}
                        className="discard-field-button"
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

CreateFieldModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onModalClose: PropTypes.func.isRequired,
    allRoles: PropTypes.array.isRequired,
    addNewField: PropTypes.func.isRequired,
};

export default CreateFieldModal;
