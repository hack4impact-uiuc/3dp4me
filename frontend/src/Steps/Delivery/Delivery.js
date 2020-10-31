import React, { useState } from 'react'
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import BottomBar from '../../Components/BottomBar/BottomBar';
import colors from '../../colors.json'

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

const Delivery = (props) => {
    const classes = useStyles();
    const [edit, setEdit] = useState(false);
    const [deliveryStatus, setDeliveryStatus] = useState("ready")

    const lang = props.lang.data;
    const key = props.lang.key;

    return (
        <div>
            <h1>{lang[key].patientView.delivery.title}</h1>
            <p>Clinic XYZ on 10/05/2020 9:58PM</p>
            <h3>{lang[key].patientView.delivery.address}</h3>
            <TextField
                disabled={!edit}
                className={edit ? classes.activeInput : classes.inputField}
                variant="outlined"
            />
            <div style={{padding: 0}}>{lang[key].patientView.delivery.addressLabel}</div>
            <h3>{lang[key].patientView.delivery.status}</h3>
            <FormControl disabled={!edit} component="fieldset">
                <RadioGroup name="status" value={deliveryStatus} onChange={(e) => setDeliveryStatus(e.target.value)}>
                    <FormControlLabel value="ready" control={<Radio />} label={lang[key].patientView.delivery.ready} />
                    <FormControlLabel value="out" control={<Radio />} label={lang[key].patientView.delivery.out} />
                    <FormControlLabel value="handDelivered" control={<Radio />} label={lang[key].patientView.delivery.handDelivered} />
                    <FormControlLabel value="pickup" control={<Radio />} label={lang[key].patientView.delivery.pickup} />
                </RadioGroup>
            </FormControl>
            <BottomBar status={props.status} edit={edit} setEdit={setEdit} lang={props.lang} />
        </div>
    )
}

export default Delivery;