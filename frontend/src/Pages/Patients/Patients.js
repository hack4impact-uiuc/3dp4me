import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Snackbar, TextField } from '@material-ui/core';
import MainTable from '../../Components/Table/MainTable'
<<<<<<< HEAD
import './Patients.scss'
=======
import './Patients.css'
>>>>>>> origin/aws-backend-auth
import MuiAlert from '@material-ui/lab/Alert';
import allpatients from '../../Test Data/all-patients.json';

const Patients = (props) => {

    const [allPatients, setAllPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPatients, setFilteredPatients] = useState([]);
    const [noPatient, setNoPatient] = useState(false);

    const lang = props.lang.data;
    const key = props.lang.key;

    const handleSearch = (e) => {
        console.log(e.target.value)
        setSearchQuery(e.target.value);
        let filtered = allPatients.filter(patient =>
            patient.name.toLowerCase().search(e.target.value.toLowerCase()) !== -1 ||
            (patient.serial + "").search(e.target.value) !== -1 ||
            (patient._id).search(e.target.value) !== -1);
        setNoPatient(filtered.length === 0);
        setFilteredPatients(filtered);
    }

    const handleNoPatientClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setNoPatient(false);
    };


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
        <div>
            <div className="all-patients-header">
                <Snackbar open={noPatient} autoHideDuration={3000} onClose={handleNoPatientClose}>
                    <Alert onClose={handleNoPatientClose} severity="error">
                        {lang[key].components.table.noPatientsFound}
                    </Alert>
                </Snackbar>
<<<<<<< HEAD
                <h2 className={key === "AR" ? "all-patients-header-text-ar" : "all-patients-header-text"}>{lang[key].components.navbar.patients.pageTitle}</h2>
                <TextField className="all-patients-search-field" onChange={handleSearch} value={searchQuery} variant="outlined" placeholder={lang[key].components.search.placeholder} />
=======
                <h2 style={key === "AR" ? { flexGrow: 1, marginRight: '10px' } : { flexGrow: 1 }}>{lang[key].components.navbar.patients.pageTitle}</h2>
                <TextField onChange={handleSearch} value={searchQuery} variant="outlined" style={{ margin: '10px' }} placeholder={lang[key].components.search.placeholder} />
>>>>>>> origin/aws-backend-auth
                <Button>{lang[key].components.button.createPatient}</Button>
            </div>
            {
                searchQuery.length === 0 ? (
                    <MainTable
                        headers={[
                            { title: lang[key].components.table.mainHeaders.name, sortKey: "name" },
                            { title: lang[key].components.table.mainHeaders.serial, sortKey: "serial" },
                            { title: lang[key].components.table.mainHeaders.added, sortKey: "createdDate" },
                            { title: lang[key].components.table.mainHeaders.lastEdit, sortKey: "lastEdit" },
                            { title: lang[key].components.table.mainHeaders.status, sortKey: "status" },
                        ]}
                        rowIds={[
                            "name",
                            "serial",
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
                                { title: lang[key].components.table.mainHeaders.serial, sortKey: "serial" },
                                { title: lang[key].components.table.mainHeaders.added, sortKey: "createdDate" },
                                { title: lang[key].components.table.mainHeaders.lastEdit, sortKey: "lastEdit" },
                                { title: lang[key].components.table.mainHeaders.status, sortKey: "status" },
                            ]}
                            rowIds={[
                                "name",
                                "serial",
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