import React, { useEffect, useState } from 'react';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
} from '@material-ui/core';
import swal from 'sweetalert';

import BottomBar from '../../components/BottomBar/BottomBar';
import './Delivery.scss';
import { updateStage } from '../../utils/api';

const Delivery = (props) => {
    const [info, setInfo] = useState(props.info);
    const stageName = 'deliveryInfo';
    const [trigger, reset] = useState(true);
    const [edit, setEdit] = useState(false);
    // const [address, setAddress] = useState("");
    const [deliveryStatus, setDeliveryStatus] = useState('');
    const formFields = {
        // address: address,
        deliveryStatus,
    };

    const key = props.languageData.selectedLanguage;
    const lang = props.languageData.translations[key];

    useEffect(() => {
        // setAddress(info.address);
        setDeliveryStatus(info.deliveryStatus);
    }, [trigger]);

    const saveData = (e) => {
        const info_copy = info;
        info_copy.deliveryStatus = deliveryStatus;
        setInfo(info_copy);
        updateStage(props.id, stageName, info_copy);
        props.updatePatientFile(stageName, info_copy);
        setEdit(false);
        swal(lang.components.bottombar.savedMessage.delivery, '', 'success');
    };

    const discardData = (e) => {
        swal({
            title: lang.components.button.discard.question,
            text: lang.components.button.discard.warningMessage,
            icon: 'warning',
            buttons: true,
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
        <div className="delivery-wrapper">
            <h1>{lang.patientView.delivery.title}</h1>
            <p>Clinic XYZ on 10/05/2020 9:58PM</p>
            <h3>{lang.patientView.delivery.address}</h3>
            {/* <TextField
                disabled={!edit}
                className={edit ? "active-input" : "input-field"}
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            /> */}
            <p>{props.address}</p>
            <div className="delivery-address-label">
                {lang.patientView.delivery.addressLabel + props.deliveryType}
            </div>
            <h3>{lang.patientView.delivery.status}</h3>
            <FormControl disabled={!edit} component="fieldset">
                <RadioGroup
                    name="status"
                    value={deliveryStatus}
                    onChange={(e) => setDeliveryStatus(e.target.value)}
                >
                    <FormControlLabel
                        value="notReady"
                        control={<Radio />}
                        label={lang.patientView.delivery.notReady}
                    />
                    <FormControlLabel
                        value="ready"
                        control={<Radio />}
                        label={lang.patientView.delivery.ready}
                    />
                    <FormControlLabel
                        value="out"
                        control={<Radio />}
                        label={lang.patientView.delivery.out}
                    />
                    <FormControlLabel
                        value="handDelivered"
                        control={<Radio />}
                        label={lang.patientView.delivery.handDelivered}
                    />
                    <FormControlLabel
                        value="pickup"
                        control={<Radio />}
                        label={lang.patientView.delivery.pickup}
                    />
                </RadioGroup>
            </FormControl>
            <BottomBar
                lastEditedBy={info.lastEditedBy}
                lastEdited={info.lastEdited}
                discard={{ state: trigger, setState: discardData }}
                save={saveData}
                status={props.status}
                edit={edit}
                setEdit={setEdit}
                languageData={props.languageData}
            />
        </div>
    );
};

export default Delivery;
