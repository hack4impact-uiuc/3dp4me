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
import { FIELD_TYPES , LANGUAGES } from '../../utils/constants';
import LanguageInput from '../LanguageInput/LanguageInput';
import { useTranslations } from '../../hooks/useTranslations';

const CreateFieldModal = ({
    isOpen,
    onModalClose,
    allRoles,
    onAddNewField,
}) => {
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

    const addOption = () => {
        const updatedOptions = _.cloneDeep(options);
        updatedOptions.push({ EN: '', AR: '' });
        setOptions(updatedOptions);
    };

    const updateOptionField = (index, val, language) => {
        const updatedOptions = _.cloneDeep(options);
        updatedOptions[index][language] = val;
        setOptions(updatedOptions);
    };

    const moveOption = (currIndex, newIndex) => {
        if (newIndex >= 0 && newIndex < options.length) {
            const updatedOptions = _.cloneDeep(options);
            const removedChoice = updatedOptions.splice(currIndex, 1)[0];
            updatedOptions.splice(newIndex, 0, removedChoice);
            setOptions(updatedOptions);
        }
    };

    const deleteOption = (index) => {
        const updatedOptions = _.cloneDeep(options);
        updatedOptions.splice(index, 1);
        setOptions(updatedOptions);
    };

    const generateOptions = () => {
        const choices = [];
        for (let i = 0; i < options.length; i++) {
            choices.push(
                <div>
                    <span>
                        {`${translations.components.swal.field.option} ${
                            i + 1
                        }`}
                    </span>
                    <LanguageInput
                        fieldValues={{ EN: options[i].EN, AR: options[i].AR }}
                        handleEnglishFieldChange={(event) => {
                            updateOptionField(
                                i,
                                event.target.value,
                                LANGUAGES.EN,
                            );
                        }}
                        handleArabicFieldChange={(event) => {
                            updateOptionField(
                                i,
                                event.target.value,
                                LANGUAGES.AR,
                            );
                        }}
                        onDelete={() => {
                            deleteOption(i);
                        }}
                        onUpPressed={() => {
                            moveOption(i, i - 1);
                        }}
                        onDownPressed={() => {
                            moveOption(i, i + 1);
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

    const updateArabicDisplayName = (e) => {
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
                        <span>
                            {translations.components.swal.field.question}
                        </span>
                        <LanguageInput
                            fieldValues={displayName}
                            handleEnglishFieldChange={updateEnglishDisplayName}
                            handleArabicFieldChange={updateArabicDisplayName}
                        />
                    </div>
                );
            case FIELD_TYPES.RADIO_BUTTON:
                return (
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>
                            {translations.components.swal.field.question}
                        </span>
                        <LanguageInput
                            fieldValues={displayName}
                            handleEnglishFieldChange={updateEnglishDisplayName}
                            handleArabicFieldChange={updateArabicDisplayName}
                        />
                        <Button
                            className="add-option-button"
                            onClick={addOption}
                        >
                            {
                                translations.components.swal.field.buttons
                                    .addChoice
                            }
                        </Button>
                        {generateOptions()}
                    </div>
                );
            case FIELD_TYPES.DIVIDER:
                return (
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>
                            {translations.components.swal.field.dividerTitle}
                        </span>
                        <LanguageInput
                            fieldValues={displayName}
                            handleEnglishFieldChange={updateEnglishDisplayName}
                            handleArabicFieldChange={updateArabicDisplayName}
                        />
                    </div>
                );
            case FIELD_TYPES.HEADER:
                return (
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>
                            {translations.components.swal.field.headerTitle}
                        </span>
                        <LanguageInput
                            fieldValues={displayName}
                            handleEnglishFieldChange={updateEnglishDisplayName}
                            handleArabicFieldChange={updateArabicDisplayName}
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

        onAddNewField(newFieldData);
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
                    {translations.components.swal.field.createFieldTitle}
                </span>
                <span className="create-field-title2">
                    {translations.components.swal.field.title2}
                </span>
                <div className="create-field-title3">
                    <div style={{ padding: 10 }}>
                        <FormControl>
                            <InputLabel htmlFor="create-field-type-dropdown">
                                {translations.components.swal.field.fieldType}
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
                            title={translations.components.swal.field.clearance}
                            langKey={selectedLang}
                            options={allRoles}
                            selectedOptions={selectedRoles}
                            onChange={onRolesChange}
                            isDisabled={false}
                        />
                    </div>
                    <span>
                        {translations.components.swal.field.customization}
                    </span>
                    <div style={{ padding: 10 }}>
                        <Checkbox
                            size="medium"
                            checked={isVisibleOnDashboard}
                            onChange={handleIsVisibleOnDashboard}
                        />
                        <span>
                            {translations.components.swal.field.showOnDashBoard}
                        </span>
                    </div>
                </div>
                <span className="create-field-title3">
                    {translations.components.swal.field.field}{' '}
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
                        {translations.components.swal.field.buttons.save}
                    </Button>
                    <Button
                        onClick={onDiscard}
                        className="discard-field-button"
                    >
                        {translations.components.swal.field.buttons.discard}
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
    onAddNewField: PropTypes.func.isRequired,
};

export default CreateFieldModal;
