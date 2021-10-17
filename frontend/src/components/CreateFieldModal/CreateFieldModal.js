import {
    Button,
    Checkbox, FormControl, InputBase, InputLabel, Modal,
    NativeSelect,
    withStyles
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { FIELD_TYPES } from '../../utils/constants';
import MultiSelectField from '../Fields/MultiSelectField';
import LanguageInput from '../LanguageInput/LanguageInput';
import './CreateFieldModal.scss';


const CreateFieldModal = ({ isOpen, onModalClose, allRoles }) => {
    const [translations, selectedLang] = useTranslations();
    const [fieldType, setFieldType] = useState(FIELD_TYPES.STRING);
    const [numChoices, setNumChoices] = useState(1);
    const [selectedRoles, setSelectedRoles] = useState([]);

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
        setNumChoices(numChoices + 1);
    };

    const generateChoices = () => {
        const choices = [];
        for (let i = 0; i < numChoices; i++) {
            choices.push(
                <div>
                    <span>
                        {translations.components.swal.createField.arabicChoice +
                            (i + 1)}
                    </span>
                    <LanguageInput
                        onDelete={() => {
                            /* TODO: */
                        }}
                        onUpPressed={() => {
                            /* TODO: */
                        }}
                        onDownPressed={() => {
                            /* TODO: */
                        }}
                    />
                </div>,
            );
        }
        return <div>{choices}</div>;
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
                        <LanguageInput />
                    </div>
                );
            case FIELD_TYPES.RADIO_BUTTON:
            case FIELD_TYPES.DROPDOWN:
                return (
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>Question</span>
                        <LanguageInput />
                        {generateChoices()}
                        <Button onClick={incrementChoices}>
                            {
                                translations.components.swal.createField.buttons
                                    .addChoice
                            }
                        </Button>
                    </div>
                );
            case FIELD_TYPES.DIVIDER:
                return (
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>Divider Title</span>
                        <LanguageInput />
                    </div>
                );
            case FIELD_TYPES.HEADER:
                return (
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>Header Title</span>
                        <LanguageInput />
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
        const options = [];
        Object.values(FIELD_TYPES).forEach((value) => {
            options.push(
                <option value={value} className="create-field-option">
                    {value}
                </option>,
            );
        });

        return options;
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
                            // onChange={onRolesChange}
                            isDisabled={false}
                        />
                    </div>
                    <span>
                        {translations.components.swal.createField.customization}
                    </span>
                    <div style={{ padding: 10 }}>
                        <Checkbox size="medium" />
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
                        onClick={onModalClose}
                        className="save-field-button"
                    >
                        {translations.components.swal.createField.buttons.save}
                    </Button>
                    <Button
                        onClick={onModalClose}
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
};

export default CreateFieldModal;
