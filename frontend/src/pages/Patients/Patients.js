import React, { useEffect, useState } from 'react';
import { Button, Snackbar, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './Patients.scss';
import MuiAlert from '@material-ui/lab/Alert';
import swal from 'sweetalert';
import reactSwal from '@sweetalert/with-react';

import { getPatientName } from '../../utils/utils';
import MainTable from '../../components/Table/MainTable';
import search from '../../assets/search.svg';
import { LanguageDataType } from '../../utils/custom-proptypes';
import archive from '../../assets/archive.svg';
import { getAllPatients } from '../../utils/api';
import {
    REQUIRED_DASHBOARD_HEADERS,
    REQUIRED_DASHBOARD_SORT_KEYS,
} from '../../utils/constants';
import { useErrorWrap } from '../../hooks/useErrorWrap';

const useStyles = makeStyles(() => ({
    swalEditButton: {
        backgroundColor: '#5395F8',
        color: 'white',
        padding: '10px 20px 10px 20px',
        marginRight: '10px',
        ' &:hover': {
            backgroundColor: '#5395F8',
        },
    },
    swalCloseButton: {
        backgroundColor: 'white',
        color: 'black',
        padding: '10px 20px 10px 20px',
        marginRight: '10px',
        ' &:hover': {
            backgroundColor: 'white',
            color: 'white',
        },
    },
}));

const Patients = ({ languageData }) => {
    const classes = useStyles();
    const [allPatients, setAllPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPatients, setFilteredPatients] = useState([]);
    const [noPatient, setNoPatient] = useState(false);
    const errorWrap = useErrorWrap();

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

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
        const filtered = allPatients.filter((patient) =>
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

    const createPatientHelper = (edit, id) => {
        if (edit) {
            window.location.href = `${window.location.href.substring(
                0,
                window.location.href.indexOf('patients'),
            )}patient-info/${id}`;
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
        // TODO: We need to check for ID conflicts
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
                            onClick={() => createPatientHelper(false, autoId)}
                        >
                            {lang.components.swal.createPatient.buttons.noEdit}
                        </Button>
                    </div>
                </div>
            ),
        });
    };

    const getData = async () => {
        errorWrap(async () => {
            const res = await getAllPatients();
            setAllPatients(res.result);
        });
    };

    useEffect(() => {
        getData();
    }, [setAllPatients, errorWrap]);

    return (
        <div className="all-patients">
            <div className="all-patients-header">
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
                <div className="header">
                    <div className="section">
                        <h2
                            className={
                                key === 'AR'
                                    ? 'all-patients-header-text-ar'
                                    : 'all-patients-header-text'
                            }
                        >
                            {lang.components.navbar.patients.pageTitle}
                        </h2>
                        <div
                            style={{
                                backgroundColor: '#eeeeee',
                                padding: '3px',
                                marginRight: '15px',
                            }}
                        >
                            <img
                                alt="archive"
                                className="archive-button"
                                src={archive}
                            />
                        </div>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <img
                                        alt="Star"
                                        style={{ marginRight: '10px' }}
                                        src={search}
                                        width="16px"
                                    />
                                ),
                            }}
                            className="all-patients-search-field"
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
            </div>
            <MainTable
                headers={REQUIRED_DASHBOARD_HEADERS}
                rowIds={REQUIRED_DASHBOARD_SORT_KEYS}
                languageData={languageData}
                patients={
                    searchQuery.length === 0 ? allPatients : filterPatients
                }
            />
            )
        </div>
    );
};

Patients.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default Patients;
