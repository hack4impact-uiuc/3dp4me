import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import reactSwal from '@sweetalert/with-react';
import swal from 'sweetalert';
import { Button, TextField, Snackbar } from '@material-ui/core';

import { useErrorWrap } from '../../hooks/useErrorWrap';
import { getPatientName } from '../../utils/utils';
import {
    REQUIRED_DASHBOARD_SORT_KEYS,
    REQUIRED_DASHBOARD_HEADERS,
    REQUIRED_DASHBOARD_METADATAS,
} from '../../utils/constants';
import MainTable from '../../components/Table/MainTable';
import ToggleButtons from '../../components/ToggleButtons/ToggleButtons';
import search from '../../assets/search.svg';
import {
    getAllStepsMetadata,
    getPatientsByStage,
    postNewPatient,
} from '../../utils/api';
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
    const errorWrap = useErrorWrap();
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const createPatientHelper = async (edit) => {
        const patient = {};
        patient.firstName = document.getElementById('createFirstName').value;
        patient.fathersName = document.getElementById(
            'createFathersName',
        ).value;
        patient.grandfathersName = document.getElementById(
            'createGrandfathersName',
        ).value;
        patient.familyName = document.getElementById('createFamilyName').value;

        let res = null;
        try {
            res = await postNewPatient(patient);
            const id = res.result._id;

            if (edit) window.location.href += `patient-info/${id}`;
        } catch (error) {
            console.error(error);
        } finally {
            swal({
                title: res?.success
                    ? lang.components.swal.createPatient.successMsg
                    : lang.components.swal.createPatient.failMsg,
                icon: res?.success ? 'success' : 'warning',
            });
        }
    };

    const createPatient = () => {
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
                                id="createFathersName"
                                fullWidth
                                style={{ padding: 10 }}
                                variant="outlined"
                            />
                            <TextField
                                size="small"
                                id="createGrandfathersName"
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
                            id="createFamilyName"
                            fullWidth
                            style={{ padding: 10 }}
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
                            onClick={() => createPatientHelper(true)}
                        >
                            {lang.components.swal.createPatient.buttons.edit}
                        </Button>
                        <Button
                            className={classes.swalCloseButton}
                            onClick={() => createPatientHelper(false)}
                        >
                            {lang.components.swal.createPatient.buttons.noEdit}
                        </Button>
                    </div>
                </div>
            ),
        });
    };

    const doesPatientMatchQuery = (patient, query) => {
        if (
            getPatientName(patient)
                .toLowerCase()
                .indexOf(query.toLowerCase()) !== -1
        )
            return true;

        if (patient._id.indexOf(query) !== -1) return true;

        return false;
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        const filtered = patients.filter((patient) =>
            doesPatientMatchQuery(patient, e.target.value),
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
            errorWrap(async () => {
                const res = await getPatientsByStage(stepKey);
                setPatients(res.result);
            });
        }
    };

    useEffect(() => {
        const getMetadata = async () => {
            errorWrap(async () => {
                let res = await getAllStepsMetadata();
                setStepsMetaData(res.result);
                if (res.result.length > 0) {
                    setStep(res.result[0].key);
                    res = await getPatientsByStage(res.result[0].key);
                    setPatients(res.result);
                }
            });
        };

        getMetadata();
    }, [setStep, setStepsMetaData, errorWrap]);

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
                    sortKey: `${step}.${field.key}`,
                    fieldType: field.fieldType,
                });
        });

        return headers;
    }

    function generateRowData(stepKey, fields) {
        if (fields == null) return [];

        const rowData = _.cloneDeep(REQUIRED_DASHBOARD_SORT_KEYS);
        fields.forEach((field) => {
            if (field.isVisibleOnDashboard)
                rowData.push({
                    id: `${stepKey}.${field?.key}`,
                    dataType: field?.fieldType,
                });
        });

        return rowData;
    }

    function generateMainTable() {
        if (stepsMetaData == null) return null;

        return stepsMetaData.map((element) => {
            if (step !== element.key) return null;

            return (
                <MainTable
                    headers={generateHeaders(element.fields)}
                    rowData={generateRowData(element.key, element.fields)}
                    languageData={languageData}
                    patients={
                        searchQuery.length === 0 ? patients : filteredPatients
                    }
                />
            );
        });
    }

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
                    </div>
                </div>
                {generateMainTable()}
            </div>
        </div>
    );
};

Dashboard.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default Dashboard;
