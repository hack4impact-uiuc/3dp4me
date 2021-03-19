import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import reactSwal from '@sweetalert/with-react';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import {
    Button,
    Notes,
    TextField,
    Snackbar,
    Select,
    MenuItem,
    Checkbox,
    Modal,
} from '@material-ui/core';

import {
    REQUIRED_DASHBOARD_SORT_KEYS,
    REQUIRED_DASHBOARD_HEADERS,
} from '../../utils/constants';
import MainTable from '../../components/Table/MainTable';
import ToggleButtons from '../../components/ToggleButtons/ToggleButtons';
import search from '../../assets/search.svg';
import { getAllStepsMetadata, getPatientsByStage } from '../../utils/api';
import { FIELD_TYPES } from '../../utils/constants';
import './Dashboard.scss';
import { LanguageDataType } from '../../utils/custom-proptypes';

// TODO: Expand these as needed

const useStyles = makeStyles(() => ({
    swalEditButton: {
        backgroundColor: '#5395F8',
        color: 'white',
        padding: '0 24px 0 24px',
        height: '38px',
        width: 'auto',
        fontSize: '12px',
        fontWeight: 'bold',
        transition: 'all 0.2s',
        borderRadius: '2px',
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.15)',
        '&:hover': {
            backgroundColor: '#84b3fa',
        },
    },
    swalCloseButton: {
        backgroundColor: 'white',
        color: 'black',
        padding: '0 24px 0 24px',
        height: '38px',
        width: 'auto',
        fontSize: '12px',
        fontWeight: 'bold',
        marginLeft: '10px',
        '&:hover': {
            backgroundColor: '#D3D3D3',
        },
    },
}));

const Dashboard = ({ languageData }) => {
    const classes = useStyles();

    const [patients, setPatients] = useState([]);
    const [stepsMetaData, setStepsMetaData] = useState(null);
    const [step, setStep] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [noPatient, setNoPatient] = useState(false);
    const [fieldType, setFieldType] = useState('String');

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const createPatientHelper = (edit, id) => {
        if (edit) {
            window.location.href += `patient-info/${id}`;
        } else {
            const name = document.getElementById('createFirstName').value;
            const dob = document.getElementById('createDOB').value;
            const createId = document.getElementById('createId').value;
            swal(
                lang.components.swal.createPatient.successMsg,
                `${lang.components.swal.createPatient.firstName}: ${name}\n${lang.components.swal.createPatient.dob}: ${dob}\n${lang.components.swal.createPatient.id}: ${createId}`,
                'success',
            );
        }
    };

    const createPatient = () => {
        // TODO: Might want a better way of doing this
        const autoId = Math.random().toString(36).substr(2, 24);
        reactSwal({
            buttons: {},
            content: (
                <div
                    style={{
                        marginRight: '10px',
                        fontFamily: 'Ubuntu',
                        margin: '0px !important',
                        textAlign: 'left',
                    }}
                >
                    <h2 style={{ fontWeight: 'bolder' }}>
                        {lang.components.swal.createPatient.title}
                    </h2>
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>
                            {lang.components.swal.createPatient.firstName}
                        </span>
                        <TextField
                            size="small"
                            id="createFirstName"
                            fullWidth
                            style={{ padding: 10 }}
                            variant="outlined"
                        />
                        <span>
                            {lang.components.swal.createPatient.middleName}
                        </span>
                        <div style={{ display: 'flex' }}>
                            <TextField
                                size="small"
                                id="createMiddleName1"
                                fullWidth
                                style={{ padding: 10 }}
                                variant="outlined"
                            />
                            <TextField
                                size="small"
                                id="createMiddleName2"
                                fullWidth
                                style={{ padding: 10 }}
                                variant="outlined"
                            />
                        </div>
                        <span>
                            {lang.components.swal.createPatient.lastName}
                        </span>
                        <TextField
                            size="small"
                            id="createLastName"
                            fullWidth
                            style={{ padding: 10 }}
                            variant="outlined"
                        />
                    </div>
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>{lang.components.swal.createPatient.dob} </span>
                        <TextField
                            size="small"
                            id="createDOB"
                            fullWidth
                            style={{ padding: 10 }}
                            variant="outlined"
                        />
                    </div>
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>{lang.components.swal.createPatient.id} </span>
                        <TextField
                            size="small"
                            id="createId"
                            fullWidth
                            style={{ padding: 10 }}
                            defaultValue={autoId}
                            variant="outlined"
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            float: 'right',
                            paddingBottom: '10px',
                        }}
                    >
                        <Button
                            className={classes.swalEditButton}
                            onClick={() => createPatientHelper(true, autoId)}
                        >
                            {lang.components.swal.createPatient.buttons.edit}
                        </Button>
                        <Button
                            className={classes.swalCloseButton}
                            onClick={() => createPatientHelper(false, autoId)}
                        >
                            {lang.components.swal.createPatient.buttons.noEdit}
                        </Button>
                    </div>
                </div>
            ),
        });
    };

    const createField = () => {
        const autoId = Math.random().toString(36).substr(2, 24);
        return (
            <Modal open={true}>
                <div
                    style={{
                        marginRight: '10px',
                        fontFamily: 'Ubuntu',
                        margin: '0px !important',
                        textAlign: 'left',
                    }}
                >
                    <h2 style={{ fontWeight: 'bolder' }}>
                        {lang.components.swal.createField.title}
                    </h2>
                    <h2 style={{ fontWeight: 'normal' }}>
                        {lang.components.swal.createField.title2}
                    </h2>
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>
                            {lang.components.swal.createField.fieldType}
                        </span>
                        <div style={{ padding: 10 }}>
                            <Select
                                //value={fieldType}
                                onChange={handleFieldTypeSelect}
                                labelId="demo-simple-select-label"
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
                        <span>
                            {lang.components.swal.createField.clearance}
                        </span>
                        <div style={{ padding: 10 }}>
                            <Select
                                labelId="demo-simple-select-label"
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
                                <MenuItem value={'Top Secret'}>
                                    Top Secret
                                </MenuItem>
                            </Select>
                        </div>
                        <div style={{ padding: 10 }}>
                            <Checkbox
                                size="small"
                                fullWidth
                                style={{ padding: 10 }}
                            />
                            <span>
                                {
                                    lang.components.swal.createField
                                        .showOnDashBoard
                                }
                            </span>
                        </div>
                    </div>
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>{lang.components.swal.createField.field} </span>
                        <div style={{ fontSize: '12px', textAlign: 'left' }}>
                            <span>
                                {lang.components.swal.createField.arabic}{' '}
                            </span>
                        </div>
                        <TextField
                            size="small"
                            id="createDOB"
                            fullWidth
                            style={{ padding: 10 }}
                            variant="outlined"
                        />
                        <div style={{ fontSize: '12px', textAlign: 'left' }}>
                            <span>
                                {lang.components.swal.createField.english}{' '}
                            </span>
                        </div>
                        <TextField
                            size="small"
                            id="createId"
                            fullWidth
                            style={{ padding: 10 }}
                            variant="outlined"
                        />
                    </div>
                    {generateFields()}
                    <div
                        style={{
                            display: 'flex',
                            float: 'right',
                            paddingBottom: '10px',
                        }}
                    >
                        <Button
                            className={classes.swalEditButton}
                            onClick={() => createPatientHelper(true, autoId)}
                        >
                            {lang.components.swal.createField.buttons.edit}
                        </Button>
                        <Button
                            className={classes.swalCloseButton}
                            onClick={() => createPatientHelper(false, autoId)}
                        >
                            {lang.components.swal.createField.buttons.discard}
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        const filtered = patients.filter(
            (patient) =>
                patient.name
                    .toLowerCase()
                    .indexOf(e.target.value.toLowerCase()) !== -1 ||
                patient._id.indexOf(e.target.value) !== -1,
        );
        setNoPatient(filtered.length === 0);
        setFilteredPatients(filtered);
    };

    const handleNoPatientClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setNoPatient(false);
    };

    const handleStep = async (stepKey) => {
        setSearchQuery('');
        if (stepKey !== null) {
            setStep(stepKey);
            const res = await getPatientsByStage(stepKey);
            // TODO: Set patients to be result of getPatients by stage
            setPatients(res);
        }
    };

    // TODO: hook up dashboard to display fetched patients

    useEffect(() => {
        const getMetadata = async () => {
            const metaData = await getAllStepsMetadata();
            // TODO: Error handling
            setStepsMetaData(metaData);

            if (metaData.length > 0) setStep(metaData[0].key);
        };

        getMetadata();
    }, [setStep, setStepsMetaData]);

    useEffect(() => {
        const getPatients = async () => {
            const res = await getPatientsByStage(step);
            // TODO: Error handling
            setPatients(res);
        };

        getPatients();
    }, [setPatients, step]);

    function generatePageHeader() {
        if (stepsMetaData == null) return lang.components.table.loading;

        return stepsMetaData.map((element) => {
            if (step !== element.key) return null;

            return <h>{element.displayName[key]}</h>;
        });
    }

    function generateHeaders(fields) {
        if (fields == null) return [];

        const headers = _.cloneDeep(REQUIRED_DASHBOARD_HEADERS);
        fields.forEach((field) => {
            if (field.isVisibleOnDashboard)
                headers.push({
                    title: field.displayName[key],
                    sortKey: field.key,
                });
        });

        return headers;
    }

    function generateRowIds(stepKey, fields) {
        if (fields == null) return [];

        const rowIDs = _.cloneDeep(REQUIRED_DASHBOARD_SORT_KEYS);
        fields.forEach((field) => {
            if (field.isVisibleOnDashboard)
                rowIDs.push(`${stepKey}.${field.key}`);
        });

        return rowIDs;
    }

    function generateMainTable() {
        if (stepsMetaData == null) return null;

        return stepsMetaData.map((element) => {
            if (step !== element.key) return null;

            return (
                <MainTable
                    headers={generateHeaders(element.fields)}
                    rowIds={generateRowIds(element.key, element.fields)}
                    languageData={languageData}
                    patients={
                        searchQuery.length === 0 ? patients : filteredPatients
                    }
                />
            );
        });
    }

    const handleFieldTypeSelect = (e) => {
        console.log(e.target.value);
        setFieldType(e.target.value);
        console.log(fieldType);
    };

    const generateFields = () => {
        //console.log(fieldType)
        if (fieldType === 'String') {
            return (
                <div style={{ fontSize: '17px', textAlign: 'left' }}>
                    <div style={{ fontSize: '12px', textAlign: 'left' }}>
                        <span>
                            {lang.components.swal.createField.arabicChoice}
                        </span>
                    </div>
                    <TextField
                        size="small"
                        id="createDOB"
                        fullWidth
                        style={{ padding: 10 }}
                        variant="outlined"
                    />
                    <div style={{ fontSize: '12px', textAlign: 'left' }}>
                        <span>
                            {lang.components.swal.createField.englishChoice}
                        </span>
                    </div>
                    <TextField
                        size="small"
                        id="createId"
                        fullWidth
                        style={{ padding: 10 }}
                        variant="outlined"
                    />
                </div>
            );
        }
        if (fieldType === 'MultilineString') {
            return (
                <div>
                    <TextField
                    /**disabled={!edit}
                            onChange={handleSimpleUpdate}
                            title={field.displayName[key]}
                            key={field.key}
                            fieldId={field.key}
                            value={updatedData[field.key]}**/
                    />
                </div>
            );
        }
        if (fieldType === 'Date') {
            return (
                <TextField
                /**displayName={field.displayName[key]}
                        isDisabled={!edit}
                        onChange={handleSimpleUpdate}
                        key={field.key}
                        fieldId={field.key}
                        value={updatedData[field.key]}**/
                />
            );
        }
        if (fieldType === 'Phone') {
            return (
                <TextField
                /**displayName={field.displayName[key]}
                        isDisabled={!edit}
                        onChange={handleSimpleUpdate}
                        fieldId={field.key}
                        key={field.key}
                        value={updatedData[field.key]}**/
                />
            );
        }
        if (fieldType === 'File') {
            return (
                <TextField
                /**languageData={languageData}
                        title={field.displayName[key]}
                        files={updatedData[field.key]}
                        fieldKey={field.key}
                        key={field.key}
                        handleDownload={handleFileDownload}
                        handleUpload={handleFileUpload}
                        handleDelete={handleFileDelete}**/
                />
            );
        }
        if (fieldType === 'Divider') {
            return <h3>{'Divider'}</h3>;
        }
        if (fieldType === 'Header') {
            return <h3>{'Header'}</h3>;
        }
        if (fieldType === 'Number') {
            return <h3>{'Number'}</h3>;
        }
        if (fieldType === 'RadioButton') {
            return <h3>{'RadioButton'}</h3>;
        }
        if (fieldType === 'Dropdown') {
            return <h3>{'Dropdown'}</h3>;
        }

        return null;
    };

    return (
        <div className="dashboard">
            <Snackbar
                open={noPatient}
                autoHideDuration={3000}
                onClose={handleNoPatientClose}
            >
                <MuiAlert
                    onClose={handleNoPatientClose}
                    severity="error"
                    elevation={6}
                    variant="filled"
                >
                    {lang.components.table.noPatientsFound}
                </MuiAlert>
            </Snackbar>
            <div className="tabs">
                <ToggleButtons
                    languageData={languageData}
                    step={step}
                    metaData={stepsMetaData}
                    handleStep={handleStep}
                />
            </div>
            <div className="patient-list">
                <div className="header">
                    <div className="section">
                        <h2
                            className={
                                key === 'AR'
                                    ? 'patient-list-title-ar'
                                    : 'patient-list-title'
                            }
                        >
                            {generatePageHeader()}
                        </h2>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <img
                                        alt="star"
                                        style={{ marginRight: '10px' }}
                                        src={search}
                                        width="16px"
                                    />
                                ),
                            }}
                            className="patient-list-search-field"
                            onChange={handleSearch}
                            value={searchQuery}
                            size="small"
                            variant="outlined"
                            placeholder={lang.components.search.placeholder}
                        />
                        <Button
                            className="create-patient-button"
                            onClick={createPatient}
                        >
                            {lang.components.button.createPatient}
                        </Button>
                        <Button
                            className="create-field-button"
                            onClick={createField}
                        >
                            {lang.components.button.createField}
                        </Button>
                    </div>
                </div>
                {createField()}
                {generateMainTable()}
            </div>
        </div>
    );
};

Dashboard.propTypes = {
    languageData: LanguageDataType.isRequired,
    fieldType: PropTypes.string.isRequired,
};

export default Dashboard;
