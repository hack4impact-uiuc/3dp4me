import './EditFieldModal.scss';
import React, { useState, useEffect } from 'react';
import {
    Button,
    Checkbox,
    Modal,
    NativeSelect,
    withStyles,
    InputBase,
    FormControl,
    FormControlLabel,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import _ from 'lodash';
import swal from 'sweetalert';

import MultiSelectField from '../Fields/MultiSelectField';
import CustomSwitch from '../Fields/CustomSwitch';

import { FIELD_TYPES, ADMIN_ID } from '../../utils/constants';
import LanguageInput from '../LanguageInput/LanguageInput';
import { useTranslations } from '../../hooks/useTranslations';
import { validateField } from '../../utils/fields';
import { useErrorWrap } from '../../hooks/useErrorWrap';

const EditFieldModal = ({
    isOpen,
    initialData,
    onModalClose,
    allRoles,
    onEditField,
}) => {
    const [translations, selectedLang] = useTranslations();
    const [fieldType, setFieldType] = useState(FIELD_TYPES.STRING);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [isVisibleOnDashboard, setIsVisibleOnDashboard] = useState(false);
    const [displayName, setDisplayName] = useState({ EN: '', AR: '' });
    const [options, setOptions] = useState([]);
    const [isHidden, setIsHidden] = useState(false);

    const errorWrap = useErrorWrap();

    useEffect(() => {
        setFieldType(initialData.fieldType);
        setIsVisibleOnDashboard(initialData.isVisibleOnDashboard);
        setDisplayName(initialData.displayName);
        setIsHidden(initialData.isHidden);

        const initialRoles = initialData.readableGroups;

        // Automatically select the admin role
        if (initialRoles.indexOf(ADMIN_ID) === -1) {
            initialRoles.push(ADMIN_ID);
        }

        setSelectedRoles(initialRoles);

        const formattedOptions = initialData.options.map((option) => {
            return option.Question;
        });

        setOptions(formattedOptions);
    }, [initialData, isOpen]);

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
                        handleFieldChange={(value, language) => {
                            updateOptionField(i, value, language);
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

    const updateDisplayName = (value, language) => {
        const updatedDisplayName = _.clone(displayName);
        updatedDisplayName[language] = value;

        setDisplayName(updatedDisplayName);
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
                    <div className="edit-field-div">
                        <span>
                            {translations.components.swal.field.question}
                        </span>
                        <LanguageInput
                            fieldValues={displayName}
                            handleFieldChange={(value, language) => {
                                updateDisplayName(value, language);
                            }}
                        />
                    </div>
                );
            case FIELD_TYPES.RADIO_BUTTON:
                return (
                    <div className="edit-field-div">
                        <span>
                            {translations.components.swal.field.question}
                        </span>
                        <LanguageInput
                            fieldValues={displayName}
                            handleFieldChange={(value, language) => {
                                updateDisplayName(value, language);
                            }}
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
                    <div className="edit-field-div">
                        <span>
                            {translations.components.swal.field.dividerTitle}
                        </span>
                        <LanguageInput
                            fieldValues={displayName}
                            handleFieldChange={(value, language) => {
                                updateDisplayName(value, language);
                            }}
                        />
                    </div>
                );
            case FIELD_TYPES.HEADER:
                return (
                    <div className="edit-field-div">
                        <span>
                            {translations.components.swal.field.headerTitle}
                        </span>
                        <LanguageInput
                            fieldValues={displayName}
                            handleFieldChange={(value, language) => {
                                updateDisplayName(value, language);
                            }}
                        />
                    </div>
                );
            default:
                return <p>This field is not yet supported</p>;
        }
    };

    const generateFieldDropdownOptions = () => {
        const fieldDropdownOptions = [];
        Object.values(FIELD_TYPES).forEach((value) => {
            fieldDropdownOptions.push(
                <option value={value} className="edit-field-option">
                    {value}
                </option>,
            );
        });

        return fieldDropdownOptions;
    };

    const getUpdatedData = () => {
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
            key: initialData.key,
            fieldNumber: initialData.fieldNumber,
            isHidden: isHidden,
            isDeleted: initialData.isDeleted,
        };

        return newFieldData;
    };

    const saveField = () => {
        const newFieldData = getUpdatedData();
        editField(newFieldData);
    };

    const editField = (newFieldData) => {
        errorWrap(
            () => {
                validateField(newFieldData);
            },
            () => {
                onEditField(newFieldData);
                onModalClose();
            },
        );
    };

    const handleIsVisibleOnDashboard = (event) => {
        setIsVisibleOnDashboard(event.target.checked);
    };

    const onDiscard = () => {
        onModalClose();
    };

    const onDelete = () => {
        swal({
            title: 'Are you sure?',
            text: 'Once deleted, you will not be able to see this field. However, it can be recovered in the database.',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                const deletedFieldData = getUpdatedData();
                deletedFieldData.isDeleted = true;
                editField(deletedFieldData);
            }
        });
    };

    const handleHiddenFieldSwitchChange = (isChecked) => {
        //added the "not" operator because when the switch is on, we want isHidden to be false
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
        <Modal
            open={isOpen}
            onClose={onModalClose}
            className="edit-field-modal"
        >
            <div className="edit-field-modal-wrapper">
                <div
                    style={{
                        float: 'right',
                        paddingBottom: '10px',
                    }}
                >
                    <span className="edit-field-title1">
                        {translations.components.swal.field.editFieldTitle}
                    </span>
                    {generateHiddenFieldSwitch()}
                    <br />
                    <br />
                    <span className="edit-field-title2">
                        {translations.components.swal.field.fieldSettings}
                    </span>
                </div>

                <div className="edit-field-title3">
                    <div>
                        <FormControl>
                            <span>
                                {translations.components.swal.field.fieldType}
                            </span>
                            <NativeSelect
                                id="edit-field-type-dropdown"
                                onChange={handleFieldTypeSelect}
                                MenuProps={{
                                    style: { zIndex: 35001 }, // for keeping this component on the top layer
                                }}
                                defaultValue={fieldType}
                                input={<BootstrapInput />}
                            >
                                {generateFieldDropdownOptions()}
                            </NativeSelect>
                        </FormControl>
                    </div>
                    <div>
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
                    <span>
                        {translations.components.swal.field.customization}
                    </span>
                    <div>
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
                <span className="edit-field-title3">
                    {translations.components.swal.field.field}{' '}
                </span>
                {generateFields()}
                <div
                    style={{
                        float: 'right',
                        paddingBottom: '10px',
                    }}
                >
                    <Button onClick={saveField} className="save-field-button">
                        {translations.components.swal.field.buttons.save}
                    </Button>
                    <Button
                        onClick={onDiscard}
                        className="discard-field-button"
                    >
                        {translations.components.swal.field.buttons.cancel}
                    </Button>
                    <Button onClick={onDelete} className="delete-field-button">
                        {translations.components.swal.field.buttons.delete}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

EditFieldModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    initialData: PropTypes.object.isRequired,
    onModalClose: PropTypes.func.isRequired,
    allRoles: PropTypes.array.isRequired,
    onEditField: PropTypes.func.isRequired,
};

export default EditFieldModal;
