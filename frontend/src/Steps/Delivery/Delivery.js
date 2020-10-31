import React, { useState } from 'react'
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    inputRoot: {
        fontSize: 14    ,
        backgroundColor: 'white',
        border: 'solid black 1px',
        "&$labelFocused": {
            backgroundColor: 'white'
        },
        '&:hover': {
            backgroundColor: 'white',
        }
    },
    labelRoot: {
        fontSize: 20,
    }
}));

const Delivery = (props) => {
    const classes = useStyles();

    const [deliveryStatus, setDeliveryStatus] = useState("ready")

    const lang = props.lang.data;
    const key = props.lang.key;

    return (
        <div>
            <h1>{lang[key].patientView.delivery.title}</h1>
            <h3>Clinic XYZ on 10/05/2020 9:58PM</h3>
            <TextField
                label={lang[key].patientView.delivery.address}
                variant="filled"
                InputProps={{ classes: { root: classes.inputRoot } }}
                InputLabelProps={{
                    classes: {
                        root: classes.labelRoot,
                        focused: classes.labelFocused
                    }
                }}
                helperText={lang[key].patientView.delivery.addressLabel}
            />
            <h3>{lang[key].patientView.delivery.status}</h3>
            <FormControl component="fieldset">
                <RadioGroup name="status" value={deliveryStatus} onChange={(e) => setDeliveryStatus(e.target.value)}>
                    <FormControlLabel value="ready" control={<Radio />} label={lang[key].patientView.delivery.ready} />
                    <FormControlLabel value="out" control={<Radio />} label={lang[key].patientView.delivery.out} />
                    <FormControlLabel value="handDelivered" control={<Radio />} label={lang[key].patientView.delivery.handDelivered} />
                    <FormControlLabel value="pickup" control={<Radio />} label={lang[key].patientView.delivery.pickup} />
                </RadioGroup>
            </FormControl>
        </div>
    )
}

export default Delivery;