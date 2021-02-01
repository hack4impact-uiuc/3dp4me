import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import './MedicalInfo.scss';
import swal from 'sweetalert';
import {
    CircularProgress,
    Divider,
    Button,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Backdrop,
} from '@material-ui/core';

import Notes from '../../components/Notes/Notes';
import BottomBar from '../../components/BottomBar/BottomBar';
import { updateStage } from '../../utils/api';
import {
    LanguageDataType,
    StringGetterSetterType,
} from '../../utils/custom-proptypes';

const MedicalInfo = ({
    information,
    status,
    languageData,
    id,
    updatePatientFile,
}) => {
    const intialInfo = {
        name: '',
        dob: '',
        ssn: '',
        address: '',
        phone: '',
        emName: '',
        relationship: '',
        emPhone: '',
        delivery: '',
        notes: '',
    };
    const stageName = 'patientInfo';

    const [trigger, reset] = useState(true);
    const [info, setInfo] = useState(information);
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState('');
    const [dob, setDOB] = useState('');
    const [ssn, setSSN] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [emName, setEmName] = useState('');
    const [emRelationship, setEmRelationship] = useState('');
    const [emPhone, setEmPhone] = useState('');
    const [delivery, setDelivery] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(intialInfo.name.length === 0);

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    useEffect(() => {
        setName(info.name);
        setDOB(info.dob);
        setSSN(info.ssn);
        setAddress(info.address);
        setPhone(info.phone);
        setEmName(info.emName);
        setEmRelationship(info.relationship);
        setEmPhone(info.emPhone);
        setDelivery(info.delivery);
        setNotes(info.notes);
        setLoading(false);
    }, [trigger, info]);

    const handleDelivery = (event) => {
        setDelivery(event.target.value);
    };
    const handleName = (e) => {
        setName(e.target.value);
    };
    const handleDOB = (e) => {
        setDOB(e.target.value);
    };
    const handleSSN = (e) => {
        setSSN(e.target.value);
    };
    const handleAddress = (e) => {
        setAddress(e.target.value);
    };
    const handlePhone = (e) => {
        setPhone(e.target.value);
    };
    const handleEmName = (e) => {
        setEmName(e.target.value);
    };
    const handleEmRelationship = (e) => {
        setEmRelationship(e.target.value);
    };
    const handleEmPhone = (e) => {
        setEmPhone(e.target.value);
    };

    const saveData = () => {
        const infoCopy = _.cloneDeep(info);
        infoCopy.name = name;
        infoCopy.dob = dob;
        infoCopy.ssn = ssn;
        infoCopy.address = address;
        infoCopy.phone = phone;
        infoCopy.emName = emName;
        infoCopy.relationship = emRelationship;
        infoCopy.emPhone = emPhone;
        infoCopy.delivery = delivery;
        infoCopy.notes = notes;
        setInfo(infoCopy);
        updateStage(id, stageName, infoCopy);
        updatePatientFile(stageName, infoCopy);
        setEdit(false);
        swal(lang.components.bottombar.savedMessage.patientInfo, '', 'success');
    };

    const discardData = () => {
        swal({
            title: lang.components.button.discard.question,
            text: lang.components.button.discard.warningMessage,
            icon: 'warning',
            dangerMode: true,
            buttons: [
                lang.components.button.discard.cancelButton,
                lang.components.button.discard.confirmButton,
            ],
        }).then((willDelete) => {
            if (willDelete) {
                swal({
                    title: lang.components.button.discard.success,
                    icon: 'success',
                    buttons: lang.components.button.discard.confirmButton,
                });
                reset(!trigger);
                setEdit(false);
            }
        });
    };

    return (
        <form className="medical-info">
            <Backdrop className="backdrop" open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <h1>{lang.patientView.patientInfo.title}</h1>
            <p>Created by Evan Eckels on 10/05/2020 9:58PM</p>
            <p>Last edited by Anisha Rao on 10/08/2020 11:58PM</p>
            <div className="patient-divider-wrapper">
                <h2>{lang.patientView.patientInfo.patientSection}</h2>
                <Divider className="patient-divider" />
            </div>
            <h3>{lang.patientView.patientInfo.name}</h3>
            <TextField
                disabled={!edit}
                className={edit ? 'active-input' : 'input-field'}
                variant="outlined"
                onChange={handleName}
                value={name}
            />
            <h3>{lang.patientView.patientInfo.dob}</h3>
            <TextField
                disabled={!edit}
                className={edit ? 'active-input' : 'input-field'}
                variant="outlined"
                onChange={handleDOB}
                value={dob}
            />
            <h3>{lang.patientView.patientInfo.ssn}</h3>
            <TextField
                disabled={!edit}
                className={edit ? 'active-input' : 'input-field'}
                variant="outlined"
                onChange={handleSSN}
                value={ssn}
            />
            <h3>{lang.patientView.patientInfo.address}</h3>
            <TextField
                disabled={!edit}
                className={edit ? 'active-input' : 'input-field'}
                variant="outlined"
                onChange={handleAddress}
                value={address}
            />
            <h3>{lang.patientView.patientInfo.phone}</h3>
            <TextField
                disabled={!edit}
                className={edit ? 'active-input' : 'input-field'}
                variant="outlined"
                onChange={handlePhone}
                value={phone}
            />
            <h2>{lang.patientView.patientInfo.emergencySection}</h2>
            <h3>{lang.patientView.patientInfo.name}</h3>
            <TextField
                disabled={!edit}
                className={edit ? 'active-input' : 'input-field'}
                variant="outlined"
                onChange={handleEmName}
                value={emName}
            />
            <h3>{lang.patientView.patientInfo.relationship}</h3>
            <TextField
                disabled={!edit}
                className={edit ? 'active-input' : 'input-field'}
                variant="outlined"
                onChange={handleEmRelationship}
                value={emRelationship}
            />
            <h3>{lang.patientView.patientInfo.phone}</h3>
            <TextField
                disabled={!edit}
                className={edit ? 'active-input' : 'input-field'}
                variant="outlined"
                onChange={handleEmPhone}
                value={emPhone}
            />
            <div className="upload-button-wrapper">
                <Button
                    className={edit ? 'button-edit' : 'button-no-edit'}
                    disabled={!edit}
                    variant="contained"
                >
                    <input type="file" style={{ display: 'none' }} />
                    {lang.components.button.upload}
                </Button>
            </div>
            <div className="patient-divider-wrapper">
                <h2>{lang.patientView.patientInfo.informationSection}</h2>
                <Divider className="patient-divider" />
            </div>
            <h3>{lang.patientView.patientInfo.deliverySection}</h3>
            <RadioGroup
                style={{ maxWidth: 'fit-content' }}
                value={delivery}
                onChange={handleDelivery}
            >
                <FormControlLabel
                    disabled={!edit}
                    value={lang.patientView.patientInfo.handDelivery}
                    control={<Radio value="delivery" color="primary" />}
                    label={lang.patientView.patientInfo.handDelivery}
                />
                <FormControlLabel
                    disabled={!edit}
                    value={lang.patientView.patientInfo.pickup}
                    control={<Radio value="pickup" color="primary" />}
                    label={lang.patientView.patientInfo.pickup}
                />
            </RadioGroup>
            <Notes
                disabled={!edit}
                state={setNotes}
                title={lang.components.notes.title}
                value={notes}
            />
            <BottomBar
                lastEditedBy={info.lastEditedBy}
                lastEdited={info.lastEdited}
                discard={{ state: trigger, setState: discardData }}
                save={saveData}
                status={status}
                edit={edit}
                setEdit={setEdit}
                languageData={languageData}
            />
        </form>
    );
};

MedicalInfo.propTypes = {
    languageData: LanguageDataType.isRequired,
    information: PropTypes.object.isRequired,
    status: StringGetterSetterType,
    id: PropTypes.string.isRequired,
    updatePatientFile: PropTypes.func.isRequired,
};

export default MedicalInfo;
