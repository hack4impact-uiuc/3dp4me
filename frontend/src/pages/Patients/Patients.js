import React, { useEffect, useState } from 'react'
import { Button, IconButton, Snackbar, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MainTable from '../../components/Table/MainTable'
import './Patients.scss'
import MuiAlert from '@material-ui/lab/Alert';
import allpatients from '../../Test Data/all-patients.json';
import search from '../../assets/search.svg';
import swal from 'sweetalert';
import reactSwal from '@sweetalert/with-react';
import archive from '../../assets/archive.svg';

const useStyles = makeStyles((theme) => ({
    swalEditButton: {
        backgroundColor: "#5395F8",
        color: 'white',
        padding: "10px 20px 10px 20px",
        marginRight: '10px',
        " &:hover": {
            backgroundColor: "#5395F8",
        },
    },
    swalCloseButton: {
        backgroundColor: "white",
        color: 'black',
        padding: "10px 20px 10px 20px",
        marginRight: '10px',
        " &:hover": {
            backgroundColor: "white",
            color: 'white'
        }
    },
}));

const Patients = (props) => {
    const classes = useStyles();
    const [allPatients, setAllPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPatients, setFilteredPatients] = useState([]);
    const [noPatient, setNoPatient] = useState(false);

    const lang = props.lang.data;
    const key = props.lang.key;

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        let filtered = allPatients.filter(patient =>
            patient.patientInfo.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1 ||
            (patient._id).indexOf(e.target.value) !== -1);
        setNoPatient(filtered.length === 0);
        setFilteredPatients(filtered);
    }

    const handleNoPatientClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setNoPatient(false);
    };

    const createPatientHelper = (edit, id) => {
        if (edit) {
            window.location.href = window.location.href.substring(0, window.location.href.indexOf("patients")) + `patient-info/${id}`
        } else {
            let name = document.getElementById("createFirstName").value;
            let dob = document.getElementById("createDOB").value;
            let id = document.getElementById("createId").value;
            swal(lang[key].components.swal.createPatient.successMsg, `${lang[key].components.swal.createPatient.firstName}: ${name}\n${lang[key].components.swal.createPatient.dob}: ${dob}\n${lang[key].components.swal.createPatient.id}: ${id}`, "success");
        }
    }

    const createPatient = (e) => {
        let auto_id = Math.random().toString(36).substr(2, 24);
        reactSwal({
            buttons: {},
            content: (
                <div style={{ marginRight: '10px', fontFamily: 'Ubuntu', margin: '0px !important', textAlign: "left" }}>
                    <h2 style={{ fontWeight: 'bolder' }}>{lang[key].components.swal.createPatient.title}</h2>
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>{lang[key].components.swal.createPatient.firstName}</span>
                        <TextField size="small" id="createFirstName" fullWidth style={{ padding: 10 }} variant="outlined" />
                        <span>{lang[key].components.swal.createPatient.middleName}</span>
                        <div style={{ display: 'flex' }}>
                            <TextField size="small" id="createMiddleName1" fullWidth style={{ padding: 10 }} variant="outlined" />
                            <TextField size="small" id="createMiddleName2" fullWidth style={{ padding: 10 }} variant="outlined" />
                        </div>
                        <span>{lang[key].components.swal.createPatient.lastName}</span>
                        <TextField size="small" id="createLastName" fullWidth style={{ padding: 10 }} variant="outlined" />
                    </div>
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>{lang[key].components.swal.createPatient.dob} </span>
                        <TextField size="small" id="createDOB" fullWidth style={{ padding: 10 }} variant="outlined" />
                    </div>
                    <div style={{ fontSize: '17px', textAlign: 'left' }}>
                        <span>{lang[key].components.swal.createPatient.id} </span>
                        <TextField size="small" id="createId" fullWidth style={{ padding: 10 }} defaultValue={auto_id} variant="outlined" />
                    </div>
                    <div style={{ display: 'flex', float: 'right', paddingBottom: '10px' }}>
                        <Button className={classes.swalEditButton} onClick={(e) => createPatientHelper(true, auto_id)}>{lang[key].components.swal.createPatient.buttons.edit}</Button>
                        <Button onClick={(e) => createPatientHelper(false, auto_id)}>{lang[key].components.swal.createPatient.buttons.noEdit}</Button>
                    </div>
                </div>
            ),

        })
    }


    const getData = (props) => {
        // TODO: api call to get all patients and assign it to all patients state variable
    }

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    useEffect(() => {
        getData();
        setAllPatients(allpatients);
    }, []);

    return (
        <div className="all-patients">
            <div className="all-patients-header">
                <Snackbar open={noPatient} autoHideDuration={3000} onClose={handleNoPatientClose}>
                    <Alert onClose={handleNoPatientClose} severity="error">
                        {lang[key].components.table.noPatientsFound}
                    </Alert>
                </Snackbar>
                <div className="header">
                    <div className="section">
                        <h2 className={key === "AR" ? "all-patients-header-text-ar" : "all-patients-header-text"}>{lang[key].components.navbar.patients.pageTitle}</h2>
                        <div style={{ backgroundColor: '#eeeeee', padding: "3px", marginRight: "15px" }}>
                            <img className="archive-button" src={archive} />
                        </div>
                        <TextField InputProps={{
                            startAdornment: (
                                <img style={{ marginRight: "10px" }} src={search} width="16px" />
                            ),
                        }} className="all-patients-search-field" onChange={handleSearch} value={searchQuery} size="small" variant="outlined" placeholder={lang[key].components.search.placeholder} />

                        <Button className="create-patient-button" onClick={createPatient}>{lang[key].components.button.createPatient}</Button>

                    </div>
                </div>
            </div>
            {
                searchQuery.length === 0 ? (
                    <MainTable
                        headers={[
                            { title: lang[key].components.table.mainHeaders.name, sortKey: "name" },
                            { title: lang[key].components.table.mainHeaders.added, sortKey: "createdDate" },
                            { title: lang[key].components.table.mainHeaders.lastEdit, sortKey: "lastEdit" },
                            { title: lang[key].components.table.mainHeaders.status, sortKey: "status" },
                        ]}
                        rowIds={[
                            "name",
                            "createdDate",
                            "lastEdited",
                            "status"
                        ]}
                        lang={props.lang}
                        patients={allPatients}
                    />
                ) : (
                        <MainTable
                            headers={[
                                { title: lang[key].components.table.mainHeaders.name, sortKey: "name" },
                                { title: lang[key].components.table.mainHeaders.added, sortKey: "createdDate" },
                                { title: lang[key].components.table.mainHeaders.lastEdit, sortKey: "lastEdit" },
                                { title: lang[key].components.table.mainHeaders.status, sortKey: "status" },
                            ]}
                            rowIds={[
                                "name",
                                "createdDate",
                                "lastEdited",
                                "status"
                            ]}
                            lang={props.lang}
                            patients={filterPatients} />
                    )
            }
        </div>
    )
}

export default Patients;