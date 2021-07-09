import './CreateFieldModal.scss';
import React, { useState } from 'react';
import {
    Button,
    TextField,
    Select,
    MenuItem,
    Checkbox,
    Modal,
    NativeSelect,
    withStyles,
    InputBase,
    FormControl,
    InputLabel,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';

import { LanguageDataType } from '../../utils/custom-proptypes';
import { FIELD_TYPES } from '../../utils/constants';
import LanguageInput from '../LanguageInput/LanguageInput';

const CreateFieldModal = ({ languageData, isOpen, onModalClose }) => {
    const [fieldType, setFieldType] = useState(FIELD_TYPES.STRING);
    const [numChoices, setNumChoices] = useState(1);

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

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

    const handleFieldTypeSelect = (e) => {
        setFieldType(e.target.value);
    };

    const incrementChoices = () => {
        setNumChoices(numChoices + 1);
    };
    const removeChoice = () => {
        setNumChoices(numChoices - 1);
    };

    const generateChoices = () => {
        const choices = [];
        for (let i = 0; i < numChoices; i += 1) {
            choices.push(
                <div>
                    <span>
                        {lang.components.swal.createField.arabicChoice +
                            (i + 1)}
                    </span>
                    <LanguageInput
                        onDelete={() => {
                            /*TODO:*/
                        }}
                        onUpPressed={() => {
                            /*TODO:*/
                        }}
                        onDownPressed={() => {
                            /*TODO:*/
                        }}
                    />
                </div>,
            );
        }
        return <div>{choices}</div>;
    };

    const generateFields = () => {
        if (
            fieldType === FIELD_TYPES.STRING ||
            fieldType === FIELD_TYPES.MULTILINE_STRING ||
            fieldType === FIELD_TYPES.DATE ||
            fieldType === FIELD_TYPES.PHONE ||
            fieldType === FIELD_TYPES.NUMBER
        ) {
            return (
                <div style={{ fontSize: '17px', textAlign: 'left' }}>
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <LanguageInput />
                    </div>
                </div>
            );
        }
        if (
            fieldType === FIELD_TYPES.RADIO_BUTTON ||
            fieldType === FIELD_TYPES.DROPDOWN
        ) {
            return (
                <div style={{ fontSize: '17px', textAlign: 'left' }}>
                    <span>Question</span>
                    <LanguageInput />
                    {generateChoices()}
                    <Button onClick={incrementChoices}>
                        {lang.components.swal.createField.buttons.addChoice}
                    </Button>
                </div>
            );
        }
        if (fieldType === FIELD_TYPES.FILE) {
            // Need to update this to allow for collection of a file
            return null;
        }
        if (fieldType === FIELD_TYPES.DIVIDER) {
            return (
                <div style={{ fontSize: '17px', textAlign: 'left' }}>
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <Grid>
                            <Row>
                                <Col style={{ padding: 10 }}>
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <span>
                                            {
                                                lang.components.swal.createField
                                                    .arabicDividerName
                                            }
                                        </span>
                                    </div>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        style={{ padding: 10 }}
                                        variant="outlined"
                                    />
                                </Col>
                                <Col style={{ padding: 10 }}>
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <span>
                                            {
                                                lang.components.swal.createField
                                                    .englishDividerName
                                            }
                                        </span>
                                    </div>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        style={{ padding: 10 }}
                                        variant="outlined"
                                    />
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                </div>
            );
        }
        if (fieldType === FIELD_TYPES.HEADER) {
            return (
                <div style={{ fontSize: '17px', textAlign: 'left' }}>
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <Grid>
                            <Row>
                                <Col style={{ padding: 10 }}>
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <span>
                                            {
                                                lang.components.swal.createField
                                                    .arabicHeaderName
                                            }
                                        </span>
                                    </div>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        style={{ padding: 10 }}
                                        variant="outlined"
                                    />
                                </Col>
                                <Col style={{ padding: 10 }}>
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <span>
                                            {
                                                lang.components.swal.createField
                                                    .englishHeaderName
                                            }
                                        </span>
                                    </div>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        style={{ padding: 10 }}
                                        variant="outlined"
                                    />
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <Modal
            open={isOpen}
            onClose={onModalClose}
            className="create-field-modal"
        >
            <div className="create-field-modal-wrapper">
                <span className="create-field-title1">
                    {lang.components.swal.createField.title}
                </span>
                <span className="create-field-title2">
                    {lang.components.swal.createField.title2}
                </span>
                <div className="create-field-title3">
                    <div style={{ padding: 10 }}>
                        <FormControl>
                            <InputLabel htmlFor="create-field-type-dropdown">
                                {lang.components.swal.createField.fieldType}
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
                                <option
                                    value={FIELD_TYPES.STRING}
                                    className="create-field-option"
                                >
                                    {FIELD_TYPES.STRING}
                                </option>
                                <option
                                    value={FIELD_TYPES.MULTILINE_STRING}
                                    className="create-field-option"
                                >
                                    {FIELD_TYPES.MULTILINE_STRING}
                                </option>
                                <option
                                    value={FIELD_TYPES.FILE}
                                    className="create-field-option"
                                >
                                    {FIELD_TYPES.FILE}
                                </option>
                                <option
                                    value={FIELD_TYPES.NUMBER}
                                    className="create-field-option"
                                >
                                    {FIELD_TYPES.NUMBER}
                                </option>
                                <option
                                    value={FIELD_TYPES.DATE}
                                    className="create-field-option"
                                >
                                    {FIELD_TYPES.DATE}
                                </option>
                                <option
                                    value={FIELD_TYPES.PHONE}
                                    className="create-field-option"
                                >
                                    {FIELD_TYPES.PHONE}
                                </option>
                                <option
                                    value={FIELD_TYPES.DIVIDER}
                                    className="create-field-option"
                                >
                                    {FIELD_TYPES.DIVIDER}
                                </option>
                                <option
                                    value={FIELD_TYPES.HEADER}
                                    className="create-field-option"
                                >
                                    {FIELD_TYPES.HEADER}
                                </option>
                                <option
                                    value={FIELD_TYPES.RADIO_BUTTON}
                                    className="create-field-option"
                                >
                                    {FIELD_TYPES.RADIO_BUTTON}
                                </option>
                                <option
                                    value={FIELD_TYPES.DROPDOWN}
                                    className="create-field-option"
                                >
                                    {FIELD_TYPES.DROPDOWN}
                                </option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                    <span>{lang.components.swal.createField.clearance}</span>
                    <div style={{ padding: 10 }}>
                        <Select
                            id="demo-simple-select"
                            MenuProps={{
                                style: { zIndex: 35001 },
                            }}
                            defaultValue="Confidential"
                        >
                            <MenuItem value="Confidential">
                                Confidential
                            </MenuItem>
                            <MenuItem value="Secret">Secret</MenuItem>
                            <MenuItem value="Top Secret">Top Secret</MenuItem>
                        </Select>
                    </div>
                    <div style={{ padding: 10 }}>
                        <Checkbox size="medium" />
                        <span>
                            {lang.components.swal.createField.showOnDashBoard}
                        </span>
                    </div>
                </div>
                <span className="create-field-title3">
                    {lang.components.swal.createField.field}{' '}
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
                        {lang.components.swal.createField.buttons.save}
                    </Button>
                    <Button
                        onClick={onModalClose}
                        className="discard-field-button"
                    >
                        {lang.components.swal.createField.buttons.discard}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

CreateFieldModal.propTypes = {
    languageData: LanguageDataType.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onModalClose: PropTypes.func.isRequired,
};

export default CreateFieldModal;
