import { FIELD_TYPES } from '../../utils/constants';
import React, { useState } from 'react';
import { LanguageDataType } from '../../utils/custom-proptypes';
import {
    Button,
    TextField,
    Select,
    MenuItem,
    Checkbox,
    Modal,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';

const CreateFieldModal = ({ languageData, isOpen, onModalClose }) => {
    const [fieldType, setFieldType] = useState('String');
    const [numChoices, setNumChoices] = useState(1);

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const handleFieldTypeSelect = (e) => {
        setFieldType(e.target.value);
        console.log(fieldType);
    };

    const incrementChoices = () => {
        setNumChoices(numChoices + 1);
    };
    const removeChoice = () => {
        setNumChoices(numChoices - 1);
    };

    const generateChoices = () => {
        const choices = [];
        for (var i = 0; i < numChoices; i++) {
            choices.push(
                <Grid>
                    <Row>
                        <Col style={{ padding: 10 }}>
                            <div
                                style={{ fontSize: '12px', textAlign: 'left' }}
                            >
                                <span>
                                    {lang.components.swal.createField
                                        .arabicChoice +
                                        (i + 1)}
                                </span>
                            </div>
                            <TextField
                                size="small"
                                id="createDOB"
                                fullWidth
                                style={{ padding: 10 }}
                                variant="outlined"
                            />
                        </Col>
                        <Col style={{ padding: 10 }}>
                            <div
                                style={{ fontSize: '12px', textAlign: 'left' }}
                            >
                                <span>
                                    {lang.components.swal.createField
                                        .englishChoice +
                                        (i + 1)}
                                </span>
                            </div>
                            <TextField
                                size="small"
                                fullWidth
                                style={{ padding: 10 }}
                                variant="outlined"
                            />
                        </Col>
                        <Col>
                            <Button onClick={removeChoice}>
                                {
                                    lang.components.swal.createField.buttons
                                        .removeChoice
                                }
                            </Button>
                        </Col>
                    </Row>
                </Grid>,
            );
        }
        return <div>{choices}</div>;
    };

    const generateFields = () => {
        if (
            fieldType === 'String' ||
            fieldType === 'MultilineString' ||
            fieldType === 'Date' ||
            fieldType === 'Phone' ||
            fieldType === 'Number' ||
            fieldType === 'RadioButton' ||
            fieldType === 'Dropdown'
        ) {
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
                                                    .arabic
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
                                                    .english
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
                    {generateChoices()}
                    <Grid>
                        <Row style={{ contentAlign: 'center' }}>
                            <Button onClick={incrementChoices}>
                                {
                                    lang.components.swal.createField.buttons
                                        .addChoice
                                }
                            </Button>
                        </Row>
                    </Grid>
                </div>
            );
        }
        if (fieldType === 'File') {
            // Need to update this to allow for collection of a file
            return;
        }
        if (fieldType === 'Divider') {
            return (
                <div>
                    <h3>{'Divider'}</h3>
                    <TextField variant="outlined" />
                </div>
            );
        }
        if (fieldType === 'Header') {
            return (
                <div>
                    <h3>{'Header'}</h3>
                    <TextField variant="outlined" />
                </div>
            );
        }

        return null;
    };

    return (
        <Modal
            open={isOpen}
            style={{ background: 'white', padding: '24px 100px 24px 24px' }}
        >
            <div
                style={{
                    marginRight: '10px',
                    fontFamily: 'Ubuntu',
                    margin: '0px !important',
                    textAlign: 'left',
                    padding: '24px 24px 48px 24px',
                }}
            >
                <h2 style={{ fontWeight: 'bolder' }}>
                    {lang.components.swal.createField.title}
                </h2>
                <h2 style={{ fontWeight: 'normal' }}>
                    {lang.components.swal.createField.title2}
                </h2>
                <div style={{ fontSize: '17px', textAlign: 'left' }}>
                    <span>{lang.components.swal.createField.fieldType}</span>
                    <div style={{ padding: 10 }}>
                        <Select
                            onChange={handleFieldTypeSelect}
                            MenuProps={{
                                style: { zIndex: 35001 },
                            }}
                            defaultValue={'String'}
                        >
                            <MenuItem value={FIELD_TYPES.STRING}>
                                {FIELD_TYPES.STRING}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.MULTILINE_STRING}>
                                {FIELD_TYPES.MULTILINE_STRING}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.FILE}>
                                {FIELD_TYPES.FILE}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.NUMBER}>
                                {FIELD_TYPES.NUMBER}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.DATE}>
                                {FIELD_TYPES.DATE}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.PHONE}>
                                {FIELD_TYPES.PHONE}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.DIVIDER}>
                                {FIELD_TYPES.DIVIDER}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.HEADER}>
                                {FIELD_TYPES.HEADER}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.RADIO_BUTTON}>
                                {FIELD_TYPES.RADIO_BUTTON}
                            </MenuItem>
                            <MenuItem value={FIELD_TYPES.DROPDOWN}>
                                {FIELD_TYPES.DROPDOWN}
                            </MenuItem>
                        </Select>
                    </div>
                    <span>{lang.components.swal.createField.clearance}</span>
                    <div style={{ padding: 10 }}>
                        <Select
                            id="demo-simple-select"
                            MenuProps={{
                                style: { zIndex: 35001 },
                            }}
                            defaultValue={'Confidential'}
                        >
                            <MenuItem value={'Confidential'}>
                                Confidential
                            </MenuItem>
                            <MenuItem value={'Secret'}>Secret</MenuItem>
                            <MenuItem value={'Top Secret'}>Top Secret</MenuItem>
                        </Select>
                    </div>
                    <div style={{ padding: 10 }}>
                        <Checkbox
                            size="small"
                            fullWidth
                            style={{ padding: 10 }}
                        />
                        <span>
                            {lang.components.swal.createField.showOnDashBoard}
                        </span>
                    </div>
                </div>
                <span>{lang.components.swal.createField.field} </span>
                {generateFields()}
                <div
                    style={{
                        display: 'flex',
                        float: 'right',
                        paddingBottom: '10px',
                    }}
                >
                    <Button onClick={onModalClose}>
                        {lang.components.swal.createField.buttons.save}
                    </Button>
                    <Button onClick={onModalClose}>
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
