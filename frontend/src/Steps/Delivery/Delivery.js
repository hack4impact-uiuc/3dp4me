import React, { useEffect, useState } from 'react'
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
<<<<<<< HEAD
import BottomBar from '../../Components/BottomBar/BottomBar';
import swal from 'sweetalert';
import './Delivery.scss';
=======
import { makeStyles } from '@material-ui/core/styles'
import BottomBar from '../../Components/BottomBar/BottomBar';
import colors from '../../colors.json'
import swal from 'sweetalert';

const useStyles = makeStyles((theme) => ({
    inputRoot: {
        fontSize: 14    ,
        backgroundColor: 'white',
        "&$labelFocused": {
            backgroundColor: 'white'
        },
        '&:hover': {
            backgroundColor: 'white',
        }
    },
    labelRoot: {
        fontSize: 20,
    },
    inputField: {
        background: colors.secondary,
    },
    activeInput: {
        background: 'white'
    },
}));
>>>>>>> origin/aws-backend-auth

const Delivery = (props) => {
    const classes = useStyles();

    const info = props.info
    const [trigger, reset] = useState(true);
    const [edit, setEdit] = useState(false);
    const [address, setAddress] = useState("");
    const [deliveryStatus, setDeliveryStatus] = useState("");
    const formFields = {
        address: address,
        status: deliveryStatus
    }

    const lang = props.lang.data;
    const key = props.lang.key;

    useEffect(() => {
        setAddress(info.address);
        setDeliveryStatus(info.status)
    }, [trigger]);

    const saveData = (e) => {
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

    const info = props.info
    const [trigger, reset] = useState(true);
    const [edit, setEdit] = useState(false);
    const [address, setAddress] = useState("");
    const [deliveryStatus, setDeliveryStatus] = useState("");
    const formFields = {
        address: address,
        status: deliveryStatus
    }

    const lang = props.lang.data;
    const key = props.lang.key;

    useEffect(() => {
        setAddress(info.address);
        setDeliveryStatus(info.status)
    }, [trigger]);

    const saveData = (e) => {
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
<<<<<<< HEAD
        <div className="delivery-wrapper">
=======
        <div>
>>>>>>> origin/aws-backend-auth
            <h1>{lang[key].patientView.delivery.title}</h1>
            <p>Clinic XYZ on 10/05/2020 9:58PM</p>
            <h3>{lang[key].patientView.delivery.address}</h3>
            <TextField
                disabled={!edit}
<<<<<<< HEAD
                className={edit ? "active-input" : "input-field"}
=======
                className={edit ? classes.activeInput : classes.inputField}
>>>>>>> origin/aws-backend-auth
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
<<<<<<< HEAD
            <div className="delivery-address-label">{lang[key].patientView.delivery.addressLabel}</div>
=======
            <div style={{padding: 0}}>{lang[key].patientView.delivery.addressLabel}</div>
>>>>>>> origin/aws-backend-auth
            <h3>{lang[key].patientView.delivery.status}</h3>
            <FormControl disabled={!edit} component="fieldset">
                <RadioGroup name="status" value={deliveryStatus} onChange={(e) => setDeliveryStatus(e.target.value)}>
                    <FormControlLabel value="ready" control={<Radio />} label={lang[key].patientView.delivery.ready} />
                    <FormControlLabel value="out" control={<Radio />} label={lang[key].patientView.delivery.out} />
                    <FormControlLabel value="handDelivered" control={<Radio />} label={lang[key].patientView.delivery.handDelivered} />
                    <FormControlLabel value="pickup" control={<Radio />} label={lang[key].patientView.delivery.pickup} />
                </RadioGroup>
            </FormControl>
            <BottomBar discard={{state: trigger, setState: discardData}} save={saveData} status={props.status} edit={edit} setEdit={setEdit} lang={props.lang} />
        </div>
    )
}

export default Delivery;