import React, { useState } from 'react';
import { Button, FormControlLabel, Input, Radio, RadioGroup, TextareaAutosize, TextField } from '@material-ui/core';
import './PatientInfo.css'
import Notes from '../../Components/Notes/Notes';

const PatientInfo = (props) => {
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState("");
    const [dob, setDOB] = useState("");
    const [ssn, setSSN] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [emName, setEmName] = useState("");
    const [emRelationship, setEmRelationship] = useState("");
    const [emPhone, setEmPhone] = useState("");
    const [delivery, setDelivery] = useState('delivery');

    const handleDelivery = (event) => {
      setDelivery(event.target.value);
    };
    const handleName = (e) => {
        setName(e.target.value);
    }
    

    return (

        <form className="patient-info">
            <h1>Patient Information</h1>
            <p>Created by Evan Eckels on 10/05/2020 9:58PM</p>
            <p>Last edited by Anisha Rao on 10/08/2020 11:58PM</p>
            <h3>Name</h3>
            <TextField variant="outlined" onChange={handleName} value={name} />
            <h3>DOB</h3>
            <TextField variant="outlined" onChange={handleName} value={name} />
            <h3>Jordan SSN</h3>
            <TextField variant="outlined" onChange={handleName} value={name} />
            <h3>Address</h3>
            <TextField variant="outlined" onChange={handleName} value={name} />
            <h3>Phone</h3>
            <TextField variant="outlined" onChange={handleName} value={name} />
            <h2>Emergency Contact</h2>
            <h3>Name</h3>
            <TextField variant="outlined" onChange={handleName} value={name} />
            <h3>Relationship</h3>
            <TextField variant="outlined" onChange={handleName} value={name} />
            <h3>Phone</h3>
            <TextField variant="outlined" onChange={handleName} value={name} />
            <div style={{ marginTop: 15 }}>
                <Button variant="contained">
                    Upload File
                    <input type="file" style={{ display: "none" }} />
                </Button>
            </div>
            <h2>Delivery Method</h2>
            <RadioGroup style={{maxWidth: 'fit-content'}} value={delivery} onChange={handleDelivery}>
                <FormControlLabel value="delivery" control={<Radio />} label="Hand Delivery" />
                <FormControlLabel value="pickup" control={<Radio />} label="Pick up" />
            </RadioGroup>
            <h3>Notes</h3>
            <Notes onChange={handleName} title="Notes" value={name} />
            <div className="submit-group">
                <Button onClick={() => setEdit(false)}>Save</Button>
                <Button>Approve for next step</Button>
            </div>
        </form>
    );
}

export default PatientInfo;