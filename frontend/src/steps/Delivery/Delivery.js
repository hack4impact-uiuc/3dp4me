import React, { useEffect, useState } from 'react'
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
import BottomBar from '../../components/BottomBar/BottomBar';
import swal from 'sweetalert';
import './Delivery.scss';
import { updateStage } from '../../utils/api';


const Delivery = (props) => {

    const [info, setInfo] = useState(props.info);
    const stageName = "deliveryInfo";
    const [trigger, reset] = useState(true);
    const [edit, setEdit] = useState(false);
    // const [address, setAddress] = useState("");
    const [deliveryStatus, setDeliveryStatus] = useState("");
    const formFields = {
        // address: address,
        deliveryStatus: deliveryStatus
    }

    const lang = props.lang.data;
    const key = props.lang.key;

    useEffect(() => {
        // setAddress(info.address);
        setDeliveryStatus(info.deliveryStatus)
    }, [trigger]);

    const saveData = (e) => {
        let info_copy = info;
        info_copy.deliveryStatus = deliveryStatus;
        setInfo(info_copy);
        updateStage(props.id, stageName, info_copy);
        props.updatePatientFile(stageName, info_copy);
        setEdit(false);
        swal(lang[key].components.bottombar.savedMessage.delivery, "", "success");
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
        <div className="delivery-wrapper">
            <h1>{lang[key].patientView.delivery.title}</h1>
            <p>Clinic XYZ on 10/05/2020 9:58PM</p>
            <h3>{lang[key].patientView.delivery.address}</h3>
            {/* <TextField
                disabled={!edit}
                className={edit ? "active-input" : "input-field"}
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            /> */}
            <p>{props.address}</p>
            <div className="delivery-address-label">{lang[key].patientView.delivery.addressLabel + props.deliveryType}</div>
            <h3>{lang[key].patientView.delivery.status}</h3>
            <FormControl disabled={!edit} component="fieldset">
                <RadioGroup name="status" value={deliveryStatus} onChange={(e) => setDeliveryStatus(e.target.value)}>
                    <FormControlLabel value="notReady" control={<Radio />} label={lang[key].patientView.delivery.notReady} />
                    <FormControlLabel value="ready" control={<Radio />} label={lang[key].patientView.delivery.ready} />
                    <FormControlLabel value="out" control={<Radio />} label={lang[key].patientView.delivery.out} />
                    <FormControlLabel value="handDelivered" control={<Radio />} label={lang[key].patientView.delivery.handDelivered} />
                    <FormControlLabel value="pickup" control={<Radio />} label={lang[key].patientView.delivery.pickup} />
                </RadioGroup>
            </FormControl>
            <BottomBar lastEditedBy={info.lastEditedBy} lastEdited={info.lastEdited} discard={{state: trigger, setState: discardData}} save={saveData} status={props.status} edit={edit} setEdit={setEdit} lang={props.lang} />
        </div>
    )
}

export default Delivery;