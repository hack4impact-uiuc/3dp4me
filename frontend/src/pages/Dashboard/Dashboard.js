import React, { useState, useEffect } from 'react';
import {
    Button,
    MenuItem,
    TextField,
    Select,
    Snackbar,
    Grid,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import MainTable from '../../components/Table/MainTable';
import ToggleButtons from '../../components/ToggleButtons/ToggleButtons';
import './Dashboard.scss';

import reactSwal from '@sweetalert/with-react';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import search from '../../assets/search.svg';
import archive from '../../assets/archive.svg';
import { getPatientsByStage } from '../../utils/api';

const useStyles = makeStyles((theme) => ({
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
    const [sort, setSort] = useState('new');
    const [step, setStep] = useState('info');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPatients, setFilteredPatients] = useState([]);
    const [stepTitle, setStepTitle] = useState('patientInfoTitle');
    const [noPatient, setNoPatient] = useState(false);
    const [sortedField, setSortedField] = React.useState(null);

    const lang = props.lang.data;
    const key = props.lang.key;

    const handlesort = (e) => {
        setSort(e.target.value);
    };

    const createPatientHelper = (edit, id) => {
        if (edit) {
            window.location.href += `patient-info/${id}`;
        } else {
            let name = document.getElementById('createFirstName').value;
            let dob = document.getElementById('createDOB').value;
            let id = document.getElementById('createId').value;
            swal(
                lang[key].components.swal.createPatient.successMsg,
                `${lang[key].components.swal.createPatient.firstName}: ${name}\n${lang[key].components.swal.createPatient.dob}: ${dob}\n${lang[key].components.swal.createPatient.id}: ${id}`,
                'success',
            );
        }
    };

    const createPatient = (e) => {
        let auto_id = Math.random().toString(36).substr(2, 24);
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
                        {lang[key].components.swal.createPatient.title}
                    </h2>
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>
                            {lang[key].components.swal.createPatient.firstName}
                        </span>
                        <TextField
                            size="small"
                            id="createFirstName"
                            fullWidth
                            style={{ padding: 10 }}
                            variant="outlined"
                        />
                        <span>
                            {lang[key].components.swal.createPatient.middleName}
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
                            {lang[key].components.swal.createPatient.lastName}
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
                        <span>
                            {lang[key].components.swal.createPatient.dob}{' '}
                        </span>
                        <TextField
                            size="small"
                            id="createDOB"
                            fullWidth
                            style={{ padding: 10 }}
                            variant="outlined"
                        />
                    </div>
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>
                            {lang[key].components.swal.createPatient.id}{' '}
                        </span>
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
                            {
                                lang[key].components.swal.createPatient.buttons
                                    .edit
                            }
                        </Button>
                        <Button
                            className={classes.swalCloseButton}
                            onClick={(e) => createPatientHelper(false, auto_id)}
                        >
                            {
                                lang[key].components.swal.createPatient.buttons
                                    .noEdit
                            }
                        </Button>
                    </div>
                </div>
            ),
        });
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        let filtered = patients.filter(
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
            let stepPatients = res.result;
            setPatients(stepPatients);
        }
    };

    // useEffect(() => {
    //   setPatients(patientInfo)
    // }, []);

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
    }, [setPatients]);

    return (
        <div className="dashboard">
            <Snackbar
                open={noPatient}
                autoHideDuration={3000}
                onClose={handleNoPatientClose}
            >
                <Alert onClose={handleNoPatientClose} severity="error">
                    {lang[key].components.table.noPatientsFound}
                </Alert>
            </Snackbar>
            <div className="tabs">
                <ToggleButtons
                    lang={props.lang}
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
                            {lang[key].pages[stepTitle]}
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
                            placeholder={
                                lang[key].components.search.placeholder
                            }
                        />
                        {stepTitle === 'patientInfoTitle' ? (
                            <Button
                                className="create-patient-button"
                                onClick={createPatient}
                            >
                                {lang[key].components.button.createPatient}
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
                                            lang[key].components.table
                                                .mainHeaders.name,
                                        sortKey: 'name',
                                    },
                                    {
                                        title:
                                            lang[key].components.table
                                                .mainHeaders.added,
                                        sortKey: 'createdDate',
                                    },
                                    {
                                        title:
                                            lang[key].components.table
                                                .mainHeaders.lastEdit,
                                        sortKey: 'lastEdited',
                                    },
                                    {
                                        title:
                                            lang[key].components.table
                                                .mainHeaders.status,
                                        sortKey: 'status',
                                    },
                                ]}
                                rowIds={[
                                    'name',
                                    'createdDate',
                                    'lastEdited',
                                    'status',
                                ]}
                                lang={props.lang}
                                patients={patients}
                            />
                        ) : (
                            <MainTable
                                headers={[
                                    {
                                        title:
                                            lang[key].components.table
                                                .mainHeaders.name,
                                        sortKey: 'name',
                                    },
                                    {
                                        title:
                                            lang[key].components.table
                                                .mainHeaders.added,
                                        sortKey: 'createdDate',
                                    },
                                    {
                                        title:
                                            lang[key].components.table
                                                .mainHeaders.lastEdit,
                                        sortKey: 'lastEdited',
                                    },
                                    {
                                        title:
                                            lang[key].components.table
                                                .mainHeaders.status,
                                        sortKey: 'status',
                                    },
                                ]}
                                rowIds={[
                                    'name',
                                    'createdDate',
                                    'lastEdited',
                                    'status',
                                ]}
                                lang={props.lang}
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
                                            lang[key].components.table
                                                .feedbackHeaders.name,
                                        sortKey: 'name',
                                    },
                                    {
                                        title:
                                            lang[key].components.table
                                                .feedbackHeaders.added,
                                        sortKey: 'createdDate',
                                    },
                                    {
                                        title:
                                            lang[key].components.table
                                                .feedbackHeaders.feedbackCycle,
                                        sortKey: 'feedbackCycle',
                                    },
                                    {
                                        title:
                                            lang[key].components.table
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
                                lang={props.lang}
                                patients={patients}
                            />
                        ) : (
                            <MainTable
                                headers={[
                                    {
                                        title:
                                            lang[key].components.table
                                                .feedbackHeaders.name,
                                        sortKey: 'name',
                                    },
                                    {
                                        title:
                                            lang[key].components.table
                                                .feedbackHeaders.added,
                                        sortKey: 'createdDate',
                                    },
                                    {
                                        title:
                                            lang[key].components.table
                                                .feedbackHeaders.feedbackCycle,
                                        sortKey: 'feedbackCycle',
                                    },
                                    {
                                        title:
                                            lang[key].components.table
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
                                lang={props.lang}
                                patients={filterPatients}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
