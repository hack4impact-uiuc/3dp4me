import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Snackbar, TextField } from '@material-ui/core';
import MainTable from '../../Components/Table/MainTable'
import './Patients.css'
import MuiAlert from '@material-ui/lab/Alert';

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
        let filtered = allPatients.filter(patient => patient.name.toLowerCase().search(e.target.value.toLowerCase()) !== -1 || patient.serial.search(e.target.value) !== -1);
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

    const patientsTest = [
        { name: "Amit", serial: '309310', createdDate: 'January 1, 2020', lastEdited: 'January 1, 2020', status: 'Unfinished' },
        { name: "Evan", serial: '635058', createdDate: 'January 2, 2020', lastEdited: 'January 2, 2020', status: 'Unfinished' },
        { name: "Anisha", serial: '100231', createdDate: 'January 3, 2020', lastEdited: 'January 3, 2020', status: 'Unfinished' },
        { name: "Lauren", serial: '127332', createdDate: 'January 4, 2020', lastEdited: 'January 4, 2020', status: 'Unfinished' },
        { name: "Navam", serial: '269402', createdDate: 'January 5, 2020', lastEdited: 'January 5, 2020', status: 'Unfinished' },
        { name: "Ashank", serial: '164650', createdDate: 'January 6, 2020', lastEdited: 'January 6, 2020', status: 'Unfinished' },
        { name: "Andy", serial: '259048', createdDate: 'January 7, 2020', lastEdited: 'January 7, 2020', status: 'Unfinished' },
        { name: "Gene", serial: '909285', createdDate: 'January 8, 2020', lastEdited: 'January 8, 2020', status: 'Unfinished' },
    ]

    useEffect(() => {
        getData();
        setAllPatients(patientsTest);
    }, []);

    return (
        <div>
            <div className="all-patients-header">
                <Snackbar open={noPatient} autoHideDuration={3000} onClose={handleNoPatientClose}>
                    <Alert onClose={handleNoPatientClose} severity="error">
                        Sorry! No matching patients
                    </Alert>
                </Snackbar>
                <h2 style={{ flexGrow: 1 }}>{lang[key].components.navbar.patients.pageTitle}</h2>
                <TextField onChange={handleSearch} value={searchQuery} variant="outlined" style={{ margin: '10px' }} placeholder="Search..." />
                <Button>{lang[key].components.button.createPatient}</Button>
            </div>
            {
              searchQuery.length === 0 ? (
                <MainTable lang={props.lang} patients={allPatients} />
              ) : (
                  <MainTable lang={props.lang} patients={filterPatients} />
                )
            }
        </div>
    )
}

export default Patients;