import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fab, FormControlLabel, Input, Radio, RadioGroup, TextareaAutosize, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import './PatientInfo.css'
import Notes from '../../Components/Notes/Notes';
import Files from '../../Components/Files/Files';
import WarningIcon from '@material-ui/icons/Warning';
import NoChangeDialog from '../../Components/No Change Dialog/NoChangeDialog'

const useStyles = makeStyles((theme) => ({
    patientDivider: {
        padding: 1,
        background: 'black',
        width: '80%',
        margin: 'auto',
    },
    inputField: {
        background: '#e5f0ff',
    },
    activeInput: {
        background: 'white'
    },
    patientBtns: {
        background: '#6295e0',
        color: 'white',
        margin: 'auto',
        marginRight: '35px',
        '&:hover': {
            background: '#6295e0'
        }
    },
    approveBtn: {
        position: 'fixed',
        bottom: 15,
        right: 15,
        marginRight: 15,
        padding: 15,
    },
    saveBtn: {
        position: 'fixed',
        bottom: 15,
        right: 240,
        marginRight: 15,
        padding: 15,
    },
    FAB: {
        background: '#6295e0',
        color: 'white',
        '&:hover': {
            background: '#6295e0'
        }
    }
}));

const PatientInfo = (props) => {
    const classes = useStyles();

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
    const [notes, setNotes] = useState("");

    const handleDelivery = (event) => {
      setDelivery(event.target.value);
    };
    const handleName = (e) => {
        setName(e.target.value);
    }
    const handleDOB = (e) => {
        setDOB(e.target.value);
    }
    const handleSSN = (e) => {
        setSSN(e.target.value);
    }
    const handleAddress = (e) => {
        setSSN(e.target.value);
    } 
    const handlePhone = (e) => {
        setPhone(e.target.value);
    } 
    const handleEmName = (e) => {
        setEmName(e.target.value);
    } 
    const handleEmRelationship = (e) => {
        setEmRelationship(e.target.value);
    } 
    const handleEmPhone = (e) => {
        setEmPhone(e.target.value);
    } 
    

    return (

        <form className="patient-info">
            <h1>Patient Information</h1>
            <p>Created by Evan Eckels on 10/05/2020 9:58PM</p>
            <p>Last edited by Anisha Rao on 10/08/2020 11:58PM</p>
            <div style={{ display: 'flex' }}>
                <h2>Patient</h2>
                <Divider className={classes.patientDivider} />
            </div>
            <h3>Name</h3>
            <TextField disabled={!edit} className={edit ? classes.activeInput : classes.inputField} variant="outlined" onChange={handleName} value={name} />
            <h3>DOB</h3>
            <TextField disabled={!edit} className={edit ? classes.activeInput : classes.inputField} variant="outlined" onChange={handleDOB} value={dob} />
            <h3>Jordan SSN</h3>
            <TextField disabled={!edit} className={edit ? classes.activeInput : classes.inputField} variant="outlined" onChange={handleSSN} value={ssn} />
            <h3>Address</h3>
            <TextField disabled={!edit} className={edit ? classes.activeInput : classes.inputField} variant="outlined" onChange={handleAddress} value={address} />
            <h3>Phone</h3>
            <TextField disabled={!edit} className={edit ? classes.activeInput : classes.inputField} variant="outlined" onChange={handlePhone} value={phone} />
            <h2>Emergency Contact</h2>
            <h3>Name</h3>
            <TextField disabled={!edit} className={edit ? classes.activeInput : classes.inputField} variant="outlined" onChange={handleEmName} value={emName} />
            <h3>Relationship</h3>
            <TextField disabled={!edit} className={edit ? classes.activeInput : classes.inputField} variant="outlined" onChange={handleEmRelationship} value={emRelationship} />
            <h3>Phone</h3>
            <TextField disabled={!edit} className={edit ? classes.activeInput : classes.inputField} variant="outlined" onChange={handleEmPhone} value={emPhone} />
            <div style={{ marginTop: 15 }}>
                <Button disabled={!edit} variant="contained">
                    Upload File
                    <input type="file" style={{ display: "none" }} />
                </Button>
            </div>
            <div style={{ display: 'flex' }}>
                <h2>Information</h2>
                <Divider className={classes.patientDivider} />
            </div>
            <h3>Delivery Method</h3>
            <RadioGroup
                style={{ maxWidth: 'fit-content' }}
                value={delivery}
                onChange={handleDelivery}
            >
                <FormControlLabel disabled={!edit} value="delivery" control={<Radio />} label="Hand Delivery" />
                <FormControlLabel disabled={!edit} value="pickup" control={<Radio />} label="Pick up" />
            </RadioGroup>
            <h3>Notes</h3>
            <Notes disabled={!edit} state={setNotes} title="Notes" value={notes} />
            <div className="submit-group">
                <Button onClick={() => setEdit(false)}>Save</Button>
                <Button>Approve for next step</Button>
            </div>
        </form>
    );
}

export default PatientInfo;