import React from 'react';
import { Button, TextField, Modal } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';

import { LanguageDataType } from '../../utils/custom-proptypes';

const CreateFieldModal = ({ languageData, isOpen, onModalClose }) => {
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const generateFields = () => {
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
                                />
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
                <h2 style={{ fontWeight: 'bolder' }}>New Section</h2>
                <div style={{ fontSize: '17px', textAlign: 'left' }}>
                    {console.log(lang.components.swal)}
                    <span>Section Title</span>
                    {generateFields()}
                    <span>{lang.components.swal.createField.clearance}</span>
                </div>

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
