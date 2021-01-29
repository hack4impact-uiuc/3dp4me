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

const Dashboard = (props) => {
    const classes = useStyles();

    const [patients, setPatients] = useState([]);
    const [step, setStep] = useState('info');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPatients, setFilteredPatients] = useState([]);
    const [stepTitle, setStepTitle] = useState('patientInfoTitle');
    const [noPatient, setNoPatient] = useState(false);

    const key = props.languageData.selectedLanguage;
    const lang = props.languageData.translations[key];

    const createPatientHelper = (edit, id) => {
        if (edit) {
            window.location.href += `patient-info/${id}`;
        } else {
            const name = document.getElementById('createFirstName').value;
            const dob = document.getElementById('createDOB').value;
            const id = document.getElementById('createId').value;
            swal(
                lang.components.swal.createPatient.successMsg,
                `${lang.components.swal.createPatient.firstName}: ${name}\n${lang.components.swal.createPatient.dob}: ${dob}\n${lang.components.swal.createPatient.id}: ${id}`,
                'success',
            );
        }
    };

    const createPatient = (e) => {
        // TODO: Might want a better way of doing this
        const auto_id = Math.random().toString(36).substr(2, 24);
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
                            defaultValue={auto_id}
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
                            onClick={(e) => createPatientHelper(true, auto_id)}
                        >
                            {lang.components.swal.createPatient.buttons.edit}
                        </Button>
                        <Button
                            className={classes.swalCloseButton}
                            onClick={(e) => createPatientHelper(false, auto_id)}
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

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    // TODO: hook up dashboard to display fetched patients
    const getPatients = async () => {
        const res = await getPatientsByStage('patientInfo');
        // TODO: Error handling
        setPatients(res.result);
    };

    useEffect(() => {
        getPatients();
    }, []);

    return (
        <div className="dashboard">
            <Snackbar
                open={noPatient}
                autoHideDuration={3000}
                onClose={handleNoPatientClose}
            >
                <Alert onClose={handleNoPatientClose} severity="error">
                    {lang.components.table.noPatientsFound}
                </Alert>
            </Snackbar>
            <div className="tabs">
                <ToggleButtons
                    languageData={props.languageData}
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
                {stepTitle !== 'feedbackTitle' ? (
                    <>
                        {searchQuery.length === 0 ? (
                            <MainTable
                                headers={[
                                    {
                                        title:
                                            lang.components.table.mainHeaders
                                                .name,
                                        sortKey: 'name',
                                    },
                                    {
                                        title:
                                            lang.components.table.mainHeaders
                                                .added,
                                        sortKey: 'createdDate',
                                    },
                                    {
                                        title:
                                            lang.components.table.mainHeaders
                                                .lastEdit,
                                        sortKey: 'lastEdited',
                                    },
                                    {
                                        title:
                                            lang.components.table.mainHeaders
                                                .status,
                                        sortKey: 'status',
                                    },
                                ]}
                                rowIds={[
                                    'name',
                                    'createdDate',
                                    'lastEdited',
                                    'status',
                                ]}
                                languageData={props.languageData}
                                patients={patients}
                            />
                        ) : (
                            <MainTable
                                headers={[
                                    {
                                        title:
                                            lang.components.table.mainHeaders
                                                .name,
                                        sortKey: 'name',
                                    },
                                    {
                                        title:
                                            lang.components.table.mainHeaders
                                                .added,
                                        sortKey: 'createdDate',
                                    },
                                    {
                                        title:
                                            lang.components.table.mainHeaders
                                                .lastEdit,
                                        sortKey: 'lastEdited',
                                    },
                                    {
                                        title:
                                            lang.components.table.mainHeaders
                                                .status,
                                        sortKey: 'status',
                                    },
                                ]}
                                rowIds={[
                                    'name',
                                    'createdDate',
                                    'lastEdited',
                                    'status',
                                ]}
                                languageData={props.languageData}
                                patients={filterPatients}
                            />
                        )}
                    </>
                ) : (
                    <>
                        {searchQuery.length === 0 ? (
                            <MainTable
                                headers={[
                                    {
                                        title:
                                            lang.components.table
                                                .feedbackHeaders.name,
                                        sortKey: 'name',
                                    },
                                    {
                                        title:
                                            lang.components.table
                                                .feedbackHeaders.added,
                                        sortKey: 'createdDate',
                                    },
                                    {
                                        title:
                                            lang.components.table
                                                .feedbackHeaders.feedbackCycle,
                                        sortKey: 'feedbackCycle',
                                    },
                                    {
                                        title:
                                            lang.components.table
                                                .feedbackHeaders.status,
                                        sortKey: 'status',
                                    },
                                ]}
                                rowIds={[
                                    'name',
                                    'createdDate',
                                    'feedbackCycle',
                                    'status',
                                ]}
                                languageData={props.languageData}
                                patients={patients}
                            />
                        ) : (
                            <MainTable
                                headers={[
                                    {
                                        title:
                                            lang.components.table
                                                .feedbackHeaders.name,
                                        sortKey: 'name',
                                    },
                                    {
                                        title:
                                            lang.components.table
                                                .feedbackHeaders.added,
                                        sortKey: 'createdDate',
                                    },
                                    {
                                        title:
                                            lang.components.table
                                                .feedbackHeaders.feedbackCycle,
                                        sortKey: 'feedbackCycle',
                                    },
                                    {
                                        title:
                                            lang.components.table
                                                .feedbackHeaders.status,
                                        sortKey: 'status',
                                    },
                                ]}
                                rowIds={[
                                    'name',
                                    'createdDate',
                                    'feedbackCycle',
                                    'status',
                                ]}
                                languageData={props.languageData}
                                patients={filterPatients}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

Dashboard.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default Dashboard;
