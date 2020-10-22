import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';

import './PatientInfo.css'

const PatientInfo = (props) => {
    const [edit, setEdit] = useState(false);

    return (
        <div>
            <h4>Patient Information</h4>
            <p>Created by Evan Eckels on 10/05/2020 9:58PM</p>
            <p>Last edited by Anisha Rao on 10/08/2020 11:58PM</p>
            <h5>Name</h5>
            <input defaultValue="" />
            <h5>DOB</h5>
            <input defaultValue="" />
            <h5>Jordan SSN</h5>
            <input defaultValue="" />
            <h5>Address</h5>
            <input defaultValue="" />
            <h5>Phone</h5>
            <input defaultValue="" />
            <b><h5>Emergency Contact</h5></b>
            <h5>Name</h5>
            <input defaultValue="" />
            <h5>Relationship</h5>
            <input defaultValue="" />
            <h5>Phone</h5>
            <input defaultValue="" />
            <h5>Delivery Method</h5>
            <h5>Notes</h5>
            <textarea disabled={!edit} />
            <div style={{ display: 'flex' }}>
                <button onClick={() => setEdit(false)}>Save</button>
                <button>Approve for next step</button>
            </div>
        </div>
    );
}

export default PatientInfo;