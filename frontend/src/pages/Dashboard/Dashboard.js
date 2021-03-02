import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import reactSwal from '@sweetalert/with-react';
import swal from 'sweetalert';
import { Button, TextField, Snackbar } from '@material-ui/core';

import MainTable from '../../components/Table/MainTable';
import ToggleButtons from '../../components/ToggleButtons/ToggleButtons';
import search from '../../assets/search.svg';
import { getPatientsByStage } from '../../utils/api';
import './Dashboard.scss';
import { LanguageDataType } from '../../utils/custom-proptypes';
import { getStageMetadata } from '../../utils/api';

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
    const [step, setStep] = useState('pateintInfo');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPatients, setFilteredPatients] = useState([]);
    const [stepTitle, setStepTitle] = useState('patientInfoTitle');
    const [noPatient, setNoPatient] = useState(false);
    const [stepMetadata, setStepMetadata] = useState([]);

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

    const handleStep = async (event, newStep) => {
        setSearchQuery('');
        if (newStep !== null) {
            setStep(newStep);
            let res = {};
            if (newStep === 'info') {
                setStepTitle('patientInfoTitle');
                res = await getPatientsByStage('patientInfo');
            } else if (newStep === 'scan') {
                setStepTitle('earScanTitle');
                res = await getPatientsByStage('earScanInfo');
            } else if (newStep === 'cad') {
                setStepTitle('CADModelingTitle');
                res = await getPatientsByStage('modelInfo');
            } else if (newStep === 'printing') {
                setStepTitle('printingTitle');
                res = await getPatientsByStage('printingInfo');
            } else if (newStep === 'processing') {
                setStepTitle('postProcessingTitle');
                res = await getPatientsByStage('processingInfo');
            } else if (newStep === 'delivery') {
                setStepTitle('deliveryTitle');
                res = await getPatientsByStage('deliveryInfo');
            } else if (newStep === 'feedback') {
                setStepTitle('feedbackTitle');
                res = await getPatientsByStage('feedbackInfo');
            }
            // What are you doing, step-patients?
            const stepPatients = res.result;
            setPatients(stepPatients);
        }
    };

    // TODO: hook up dashboard to display fetched patients
    const getPatients = async () => {
        const res = await getPatientsByStage('patientInfo');
        // TODO: Error handling
        setPatients(res.result);
    };

    useEffect(async () => {
        const stepMetadata = await getStageMetadata();
        if (stepMetadata != null) {
            setStepMetadata(stepMetadata);
        }
    }, [setStepMetadata]);

    useEffect(() => {
        getPatients();
    }, []);

    function generateMainTable() {
        return stepMetadata.map((element) => {
            if (stepTitle !== element.key) {
                return null;
            }
            return (
                <MainTable
                    headers={generateHeaders(element)}
                    rowIds={generateRowIds(element)}
                    languageData={languageData}
                    patients={patients}
                />
            );
        });
    }

    function generateHeaders(element) {
        return element.fields.map((value) => {
            if (value.isVisibleOnDashboard) {
                return {
                    title: element.displayName[key],
                    sortKey: element.key,
                };
            }
            return null;
        });
    }

    function generateRowIds(element) {
        return element.fields.map((value) => {
            if (value.isVisibleOnDashboard) {
                return element.key;
            }
            return null;
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
                            {lang.pages[stepTitle]}
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
                        {stepTitle === 'patientInfoTitle' ? (
                            <Button
                                className="create-patient-button"
                                onClick={createPatient}
                            >
                                {lang.components.button.createPatient}
                            </Button>
                        ) : (
                            <></>
                        )}
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
