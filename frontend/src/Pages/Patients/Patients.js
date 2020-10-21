import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { Button } from '@material-ui/core';

import Table from '../../Components/Table/Table'

import './Patients.css'

const Patients = (props) => {

    const allpatients = useState([]);

    const getData = (props) => {
        // TODO: api call to get all patients and assign it to all patients state variable
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
    }, []);

    return (
        <div>
            <div className="all-patients-header">
                <h2 style={{flexGrow: 1}}>All Patients</h2>
                <input placeholder="Search..." />
                <Button>Create new patient</Button>
            </div>
            <Table headers={["Name", "Serial", "Date Added", "Last Edit By", "Stage"]} data={patientsTest} />
        </div>
    )
}

export default Patients;