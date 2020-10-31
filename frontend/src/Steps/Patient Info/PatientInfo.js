import React, { useState } from 'react';
import { AppBar, BottomNavigation, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fab, FormControlLabel, Input, MenuItem, Radio, RadioGroup, Select, TextareaAutosize, TextField, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import './PatientInfo.css'
import Notes from '../../Components/Notes/Notes';
import Files from '../../Components/Files/Files';
import WarningIcon from '@material-ui/icons/Warning';
import NoChangeDialog from '../../Components/No Change Dialog/NoChangeDialog';
import colors from '../../colors.json'
import BottomBar from '../../Components/BottomBar/BottomBar';

const useStyles = makeStyles((theme) => ({
    patientDivider: {
        padding: 1,
        background: 'black',
        width: '80%',
        margin: 'auto',
    },
    inputField: {
        background: colors.secondary,
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
    },
    radio: {
        '&:checked': {
            color: colors.secondary
        }
    },
    bottomBar: {
        top: 'auto',
        bottom: '0',
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
    const lang = props.lang.data;
    const key = props.lang.key;

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
            <h1>{lang[key].patientView.patientInfo.title}</h1>
            <p>Created by Evan Eckels on 10/05/2020 9:58PM</p>
            <p>Last edited by Anisha Rao on 10/08/2020 11:58PM</p>
            <div style={{ display: 'flex' }}>
                <h2>{lang[key].patientView.patientInfo.patientSection}</h2>
                <Divider className={classes.patientDivider} />
            </div>
            <h3>{lang[key].patientView.patientInfo.name}</h3>
            <TextField disabled={!edit} className={edit ? classes.activeInput : classes.inputField} variant="outlined" onChange={handleName} value={name} />
            <h3>{lang[key].patientView.patientInfo.dob}</h3>
            <TextField disabled={!edit} className={edit ? classes.activeInput : classes.inputField} variant="outlined" onChange={handleDOB} value={dob} />
            <h3>{lang[key].patientView.patientInfo.ssn}</h3>
            <TextField disabled={!edit} className={edit ? classes.activeInput : classes.inputField} variant="outlined" onChange={handleSSN} value={ssn} />
            <h3>{lang[key].patientView.patientInfo.address}</h3>
            <TextField disabled={!edit} className={edit ? classes.activeInput : classes.inputField} variant="outlined" onChange={handleAddress} value={address} />
            <h3>{lang[key].patientView.patientInfo.phone}</h3>
            <TextField disabled={!edit} className={edit ? classes.activeInput : classes.inputField} variant="outlined" onChange={handlePhone} value={phone} />
            <h2>{lang[key].patientView.patientInfo.emergencySection}</h2>
            <h3>{lang[key].patientView.patientInfo.name}</h3>
            <TextField disabled={!edit} className={edit ? classes.activeInput : classes.inputField} variant="outlined" onChange={handleEmName} value={emName} />
            <h3>{lang[key].patientView.patientInfo.relationship}</h3>
            <TextField disabled={!edit} className={edit ? classes.activeInput : classes.inputField} variant="outlined" onChange={handleEmRelationship} value={emRelationship} />
            <h3>{lang[key].patientView.patientInfo.phone}</h3>
            <TextField disabled={!edit} className={edit ? classes.activeInput : classes.inputField} variant="outlined" onChange={handleEmPhone} value={emPhone} />
            <div style={{ marginTop: 15 }}>
                <Button style={edit ? { backgroundColor: colors.button, color: 'white' } : {}} disabled={!edit} variant="contained">
                    <input type="file" style={{ display: "none" }} />
                    {lang[key].components.button.upload}
                </Button>
            </div>
            <div style={{ display: 'flex' }}>
                <h2>{lang[key].patientView.patientInfo.informationSection}</h2>
                <Divider className={classes.patientDivider} />
            </div>
            <h3>{lang[key].patientView.patientInfo.deliverySection}</h3>
            <RadioGroup
                style={{ maxWidth: 'fit-content' }}
                value={delivery}
                onChange={handleDelivery}
            >
                <FormControlLabel disabled={!edit} value={lang[key].patientView.patientInfo.handDelivery}
                    control={<Radio color="primary" />}
                    label={lang[key].patientView.patientInfo.handDelivery} />
                <FormControlLabel disabled={!edit} value={lang[key].patientView.patientInfo.pickup}
                    control={<Radio color="primary" />}
                    label={lang[key].patientView.patientInfo.pickup}
                />
            </RadioGroup>
            <Notes disabled={!edit} state={setNotes} title={lang[key].components.notes.title} value={notes} />
            <BottomBar status={props.status} edit={edit} setEdit={setEdit} lang={props.lang} />
        </form>
    );
}

export default PatientInfo;