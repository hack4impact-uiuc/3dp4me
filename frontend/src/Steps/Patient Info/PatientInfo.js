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
    const [patientInfoNotes, setPatientInfoNotes] = useState();
    const [changed, setChanged] = useState(false);
    const [confirmNoChange, setConfirmNoChange] = useState(false);

    const handleSave = (e) => {
        if (changed) {
            setEdit(!edit);
            postData();
            setConfirmNoChange(false);
        } else if (e === "override") {
            setConfirmNoChange(false);
            setEdit(!edit);
        } else {
            setConfirmNoChange(true);
        }
    }

    const postData = (e) => {
        console.log("Data posted!")
        setChanged(false);
    }

    return (

        <form className="patient-info">
            <div style={{ display: 'flex' }}>
                <h1 style={{ flexGrow: 1 }}>Medical Information</h1>
                {!edit ? (
                    <Button onClick={() => setEdit(!edit)} className={classes.patientBtns}>Edit Step</Button>
                ) : (
                        <Button onClick={() => { setEdit(!edit); setConfirmNoChange(false) }} className={classes.patientBtns}>View Mode</Button>
                    )
                }
            </div>
            <p>Created by Evan Eckels on 10/05/2020 9:58PM</p>
            <p>Last edited by Anisha Rao on 10/08/2020 11:58PM</p>
            <div style={{ display: 'flex' }}>
                <h2>Patient</h2>
                <Divider className={classes.patientDivider} />
            </div>
            <h3>Name</h3>
            <TextField
                disabled={!edit}
                className={edit ? classes.activeInput : classes.inputField}
                variant="outlined"
                onChange={(e) => {
                    setName(e.target.value)
                    setChanged(true);
                }}
                value={name} />
            <h3>DOB</h3>
            <TextField
                disabled={!edit}
                className={edit ? classes.activeInput : classes.inputField}
                variant="outlined"
                onChange={(e) => {
                    setDOB(e.target.value)
                    setChanged(true);
                }}
                value={dob} />
            <h3>Jordan SSN</h3>
            <TextField
                disabled={!edit}
                className={edit ? classes.activeInput : classes.inputField}
                variant="outlined"
                onChange={(e) => {
                    setSSN(e.target.value)
                    setChanged(true);
                }}
                value={ssn} />
            <h3>Address</h3>
            <TextField
                disabled={!edit}
                className={edit ? classes.activeInput : classes.inputField}
                variant="outlined"
                onChange={(e) => {
                    setAddress(e.target.value)
                    setChanged(true);
                }}
                value={address} />
            <h3>Phone</h3>
            <TextField
                disabled={!edit} className={edit ? classes.activeInput : classes.inputField}
                variant="outlined"
                onChange={(e) => {
                    setPhone(e.target.value)
                    setChanged(true);
                }}
                value={phone} />
            <div style={{ display: 'flex' }}>
                <h2>Emergency Contact</h2>
                <Divider className={classes.patientDivider} />
            </div>
            <h3>Name</h3>
            <TextField
                disabled={!edit}
                className={edit ? classes.activeInput : classes.inputField}
                variant="outlined"
                onChange={(e) => {
                    setEmName(e.target.value)
                    setChanged(true);
                }}
                value={emName}
            />
            <h3>Relationship</h3>
            <TextField
                disabled={!edit}
                className={edit ? classes.activeInput : classes.inputField}
                variant="outlined"
                onChange={(e) => {
                    setEmRelationship(e.target.value)
                    setChanged(true);
                }}
                value={emRelationship} />
            <h3>Phone</h3>
            <TextField
                disabled={!edit}
                className={edit ? classes.activeInput : classes.inputField}
                variant="outlined"
                onChange={(e) => {
                    setEmPhone(e.target.value)
                    setChanged(true);
                }}
                value={emPhone} />
            <div style={{ marginTop: 15 }}>
                <Button disabled={!edit} variant="contained">
                    Upload File
                    <input type="file" style={{ display: "none" }} />
                </Button>
            </div>
            <div style={{ display: 'flex' }}>
                <h2>Information</h2>
                <Divider variant="fullWidth" className={classes.patientDivider} />
            </div>
            <h3>Delivery Method</h3>
            <RadioGroup
                style={{ maxWidth: 'fit-content' }}
                value={delivery}
                onChange={(e) => {
                    setDelivery(e.target.value);
                    setChanged(true);
                }}>
                <FormControlLabel disabled={!edit} value="delivery" control={<Radio />} label="Hand Delivery" />
                <FormControlLabel disabled={!edit} value="pickup" control={<Radio />} label="Pick up" />
            </RadioGroup>
            <Files disabled={!edit} title="Files" files={['file_name1.SCAN', 'file_name2.SCAN', 'file_name3.SCAN']} />
            <Notes disabled={!edit} changed={setChanged} state={setPatientInfoNotes} title="Notes" value={patientInfoNotes} />
            <div className={classes.approveBtn}>
                <Fab className={classes.FAB} variant="extended">
                    Approve for next step
                </Fab>
            </div>
            {edit ? (
                <div className={classes.saveBtn}>
                    <Fab onClick={handleSave} className={classes.FAB} style={{ marginRight: 15 }} variant="extended">
                        Save
                    </Fab>

                </div>
            ) : (<></>)}

            <NoChangeDialog open={confirmNoChange} save={handleSave} setEdit={setEdit} noChange={setConfirmNoChange} />
        </form>
    );
}

export default PatientInfo;