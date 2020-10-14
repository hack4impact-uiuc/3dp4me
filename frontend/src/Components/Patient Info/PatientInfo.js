import React, { useState, useEffect } from 'react'
import Button from '../Helpers/Button/Button';

import './PatientInfo.css'

const PatientInfo = (props) => {

    const [edit, setEdit] = useState(false);
    let manage = document.getElementById('manage-patient');

    useEffect(() => {
        // we need to call the data for this patient from the id? 


    }, []);

    const getPatientData = () => {

    }


    return (
        <div className="patient-info">
            <div className="sidebar">
                <div className="sidebar-content">
                    <input disabled={!edit} id="name" value="" />
                    <input disabled={!edit} id="order-id" value="" />
                    <input disabled={!edit} id="dob" value="" />
                    <div id="notes-section">

                    </div>

                    <button onClick={() => setEdit(true)}>Manage Patient</button>
                </div>
            </div>
            <div className="patient-content">
                <h4>Patient Information</h4>
                <p>Created by Evan Eckels on 10/05/2020 9:58PM</p>
                <p>Last edited by Anisha Rao on 10/08/2020 11:58PM</p>
                <h5>Name</h5>
                <input disabled={!edit} defaultValue="" />
                <h5>DOB</h5>
                <input disabled={!edit} defaultValue="" />
                <h5>Jordan SSN</h5>
                <input disabled={!edit} defaultValue="" />
                <h5>Address</h5>
                <input disabled={!edit} defaultValue="" />
                <h5>Phone</h5>
                <input disabled={!edit} defaultValue="" />
                <b><h5>Emergency Contact</h5></b>
                <h5>Name</h5>
                <input disabled={!edit} defaultValue="" />
                <h5>Relationship</h5>
                <input disabled={!edit} defaultValue="" />
                <h5>Phone</h5>
                <input disabled={!edit} defaultValue="" />
                <h5>Delivery Method</h5>
                <h5>Notes</h5>
                <textarea disabled={!edit} />
                <div style={{ display: 'flex' }}>
                    <button onClick = {() => setEdit(false)}>Save</button>
                    <button>Approve for next step</button>
                </div>
            </div>
        </div>
    )
}

export default PatientInfo;