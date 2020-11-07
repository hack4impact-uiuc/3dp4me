import React, { useEffect, useState } from 'react';
import { CircularProgress, Divider, Button, FormControlLabel, Radio, RadioGroup, TextField, Backdrop } from '@material-ui/core';
<<<<<<< HEAD:frontend/src/Steps/Patient Info/PatientInfo.js
import { makeStyles } from '@material-ui/core/styles'
<<<<<<< HEAD
import './PatientInfo.scss'
=======
import './PatientInfo.css'
>>>>>>> origin/aws-backend-auth
import Notes from '../../Components/Notes/Notes';
import Files from '../../Components/Files/Files';
=======
import './MedicalInfo.scss'
import Notes from '../../components/Notes/Notes';
import Files from '../../components/Files/Files';
>>>>>>> origin/master:frontend/src/Steps/MedicalInfo/MedicalInfo.js
import WarningIcon from '@material-ui/icons/Warning';
import NoChangeDialog from '../../components/NoChangeDialog/NoChangeDialog';
import BottomBar from '../../components/BottomBar/BottomBar';
import swal from 'sweetalert';
import patientFile from '../../Test Data/patient.json';

<<<<<<< HEAD:frontend/src/Steps/Patient Info/PatientInfo.js
const useStyles = makeStyles((theme) => ({
<<<<<<< HEAD
=======
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
    },
    loadingModal: {
        width: '100%',
    },
>>>>>>> origin/aws-backend-auth
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const PatientInfo = (props) => {
    const classes = useStyles();
=======
const MedicalInfo = (props) => {
>>>>>>> origin/master:frontend/src/Steps/MedicalInfo/MedicalInfo.js

    const intialInfo = {
        name: "",
        dob: "",
        ssn: "",
        address: "",
        phone: "",
        emName: "",
        relationship: "",
        emPhone: "",
        delivery: "",
        notes: "",
    }

    const [trigger, reset] = useState(true);
    const [info, setInfo] = useState(props.info);
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState("");
    const [dob, setDOB] = useState("");
    const [ssn, setSSN] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [emName, setEmName] = useState("");
    const [emRelationship, setEmRelationship] = useState("");
    const [emPhone, setEmPhone] = useState("");
    const [delivery, setDelivery] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(intialInfo.name.length === 0);
    const formFields = {
        name: name,
        dob: dob,
        ssn: ssn,
        address: address,
        phone: phone,
        emName: emName,
        relationship: emRelationship,
        emPhone: emPhone,
        delivery: delivery,
        notes: notes,
    }
    const lang = props.lang.data;
    const key = props.lang.key;

    useEffect(() => {
        setName(info.name);
        setDOB(info.dob);
        setSSN(info.snn);
        setAddress(info.address);
        setPhone(info.phone);
        setEmName(info.emName);
        setEmRelationship(info.relationship);
        setEmPhone(info.emPhone);
        setDelivery(info.delivery);
        setNotes(info.notes);
        setLoading(false);
    }, [trigger]);
<<<<<<< HEAD

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
        setAddress(e.target.value);
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

=======

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
        setAddress(e.target.value);
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

>>>>>>> origin/aws-backend-auth
    const saveData = (e) => {
        setEdit(false);
        swal(lang[key].components.bottombar.savedMessage.patientInfo, "", "success");
    }

    const discardData = (e) => {
        swal({
            title: lang[key].components.button.discard.question,
            text: lang[key].components.button.discard.warningMessage,
            icon: "warning",
            buttons: true,
            dangerMode: true,
            buttons: [lang[key].components.button.discard.cancelButton, lang[key].components.button.discard.confirmButton]
          })
          .then((willDelete) => {
            if (willDelete) {
              swal({
                title: lang[key].components.button.discard.success,
                icon: "success",
                buttons: lang[key].components.button.discard.confirmButton
            });
            reset(!trigger);
            setEdit(false)
            } 
          });
    }

    return (

        <form className="medical-info">
            <Backdrop className="backdrop" open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <h1>{lang[key].patientView.patientInfo.title}</h1>
            <p>Created by Evan Eckels on 10/05/2020 9:58PM</p>
            <p>Last edited by Anisha Rao on 10/08/2020 11:58PM</p>
            <div className="patient-divider-wrapper">
                <h2>{lang[key].patientView.patientInfo.patientSection}</h2>
<<<<<<< HEAD:frontend/src/Steps/Patient Info/PatientInfo.js
<<<<<<< HEAD
                <Divider className="patient-divider" />
            </div>
            <h3>{lang[key].patientView.patientInfo.name}</h3>
            <TextField disabled={!edit} className={edit ? "active-input" : "input-field"} variant="outlined" onChange={handleName} value={name} />
            <h3>{lang[key].patientView.patientInfo.dob}</h3>
            <TextField disabled={!edit} className={edit ? "active-input" : "input-field"} variant="outlined" onChange={handleDOB} value={dob} />
            <h3>{lang[key].patientView.patientInfo.ssn}</h3>
            <TextField disabled={!edit} className={edit ? "active-input" : "input-field"} variant="outlined" onChange={handleSSN} value={ssn} />
            <h3>{lang[key].patientView.patientInfo.address}</h3>
            <TextField disabled={!edit} className={edit ? "active-input" : "input-field"} variant="outlined" onChange={handleAddress} value={address} />
            <h3>{lang[key].patientView.patientInfo.phone}</h3>
            <TextField disabled={!edit} className={edit ? "active-input" : "input-field"} variant="outlined" onChange={handlePhone} value={phone} />
            <h2>{lang[key].patientView.patientInfo.emergencySection}</h2>
            <h3>{lang[key].patientView.patientInfo.name}</h3>
            <TextField disabled={!edit} className={edit ? "active-input" : "input-field"} variant="outlined" onChange={handleEmName} value={emName} />
            <h3>{lang[key].patientView.patientInfo.relationship}</h3>
            <TextField disabled={!edit} className={edit ? "active-input" : "input-field"} variant="outlined" onChange={handleEmRelationship} value={emRelationship} />
            <h3>{lang[key].patientView.patientInfo.phone}</h3>
            <TextField disabled={!edit} className={edit ? "active-input" : "input-field"} variant="outlined" onChange={handleEmPhone} value={emPhone} />
=======
                <Divider className={classes.patientDivider} />
=======
                <Divider className="patient-divider" />
>>>>>>> origin/master:frontend/src/Steps/MedicalInfo/MedicalInfo.js
            </div>
            <h3>{lang[key].patientView.patientInfo.name}</h3>
            <TextField disabled={!edit} className={edit ? "active-input" : "input-field"} variant="outlined" onChange={handleName} value={name} />
            <h3>{lang[key].patientView.patientInfo.dob}</h3>
            <TextField disabled={!edit} className={edit ? "active-input" : "input-field"} variant="outlined" onChange={handleDOB} value={dob} />
            <h3>{lang[key].patientView.patientInfo.ssn}</h3>
            <TextField disabled={!edit} className={edit ? "active-input" : "input-field"} variant="outlined" onChange={handleSSN} value={ssn} />
            <h3>{lang[key].patientView.patientInfo.address}</h3>
            <TextField disabled={!edit} className={edit ? "active-input" : "input-field"} variant="outlined" onChange={handleAddress} value={address} />
            <h3>{lang[key].patientView.patientInfo.phone}</h3>
            <TextField disabled={!edit} className={edit ? "active-input" : "input-field"} variant="outlined" onChange={handlePhone} value={phone} />
            <h2>{lang[key].patientView.patientInfo.emergencySection}</h2>
            <h3>{lang[key].patientView.patientInfo.name}</h3>
            <TextField disabled={!edit} className={edit ? "active-input" : "input-field"} variant="outlined" onChange={handleEmName} value={emName} />
            <h3>{lang[key].patientView.patientInfo.relationship}</h3>
            <TextField disabled={!edit} className={edit ? "active-input" : "input-field"} variant="outlined" onChange={handleEmRelationship} value={emRelationship} />
            <h3>{lang[key].patientView.patientInfo.phone}</h3>
<<<<<<< HEAD:frontend/src/Steps/Patient Info/PatientInfo.js
            <TextField disabled={!edit} className={edit ? classes.activeInput : classes.inputField} variant="outlined" onChange={handleEmPhone} value={emPhone} />
>>>>>>> origin/aws-backend-auth
            <div style={{ marginTop: 15 }}>
                <Button style={edit ? { backgroundColor: colors.button, color: 'white' } : {}} disabled={!edit} variant="contained">
=======
            <TextField disabled={!edit} className={edit ? "active-input" : "input-field"} variant="outlined" onChange={handleEmPhone} value={emPhone} />
            <div className="upload-button-wrapper">
                <Button className={edit ? "button-edit" : ""} disabled={!edit} variant="contained">
>>>>>>> origin/master:frontend/src/Steps/MedicalInfo/MedicalInfo.js
                    <input type="file" style={{ display: "none" }} />
                    {lang[key].components.button.upload}
                </Button>
            </div>
            <div className="patient-divider-wrapper">
                <h2>{lang[key].patientView.patientInfo.informationSection}</h2>
<<<<<<< HEAD:frontend/src/Steps/Patient Info/PatientInfo.js
<<<<<<< HEAD
                <Divider className="patient-divider" />
=======
                <Divider className={classes.patientDivider} />
>>>>>>> origin/aws-backend-auth
=======
                <Divider className="patient-divider" />
>>>>>>> origin/master:frontend/src/Steps/MedicalInfo/MedicalInfo.js
            </div>
            <h3>{lang[key].patientView.patientInfo.deliverySection}</h3>
            <RadioGroup
                style={{ maxWidth: 'fit-content' }}
                value={delivery}
                onChange={handleDelivery}
            >
                <FormControlLabel disabled={!edit} value={lang[key].patientView.patientInfo.handDelivery}
                    control={<Radio value="delivery" color="primary" />}
                    label={lang[key].patientView.patientInfo.handDelivery} />
                <FormControlLabel disabled={!edit} value={lang[key].patientView.patientInfo.pickup}
                    control={<Radio value="pickup" color="primary" />}
                    label={lang[key].patientView.patientInfo.pickup}
                />
            </RadioGroup>
            <Notes name="notes" disabled={!edit} state={setNotes} title={lang[key].components.notes.title} value={notes} />
            <BottomBar discard={{state: trigger, setState: discardData}} save={saveData} status={props.status} edit={edit} setEdit={setEdit} lang={props.lang} />
        </form>
    );
}

export default MedicalInfo;