import React, { useState } from 'react'
import { Checkbox, FormControlLabel, FormGroup, Hidden, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import './Delivery.css'

const useStyles = makeStyles((theme) => ({
    inputRoot: {
        fontSize: 20,
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
    const [shippingChecked, setShippingChecked] = useState();
    const [outDelivery, setOutDelivery] = useState();
    const [handDelivered, setHandDeliverd] = useState();
    const [pickedUp, setPickedUp] = useState();

    return (
        <div>
            <h1>Delivery</h1>
            <h3>Clinic XYZ on 10/05/2020 9:58PM</h3>
            <TextField
                label="Address"
                variant="filled"
                InputProps={{ classes: { root: classes.inputRoot } }}
                InputLabelProps={{
                    classes: {
                        root: classes.labelRoot,
                        focused: classes.labelFocused
                    }
                }}
                helperText="To be Hand Delivered"
            />
            <h3>Status</h3>
            <FormGroup>

                <FormControlLabel
                    control={<Checkbox checked={shippingChecked} onChange={(e) => setShippingChecked(e.target.checked)} />}
                    label="Ready for Shipping"
                />
                {shippingChecked ? (
                    <FormControlLabel
                        control={<Checkbox checked={outDelivery} onChange={(e) => setOutDelivery(e.target.checked)} />}
                        label="Out for Delivery"
                    />
                ) : (<></>)}

                {outDelivery ? (
                    <FormControlLabel
                        control={<Checkbox checked={handDelivered} onChange={(e) => setHandDeliverd(e.target.checked)} />}
                        label="Hand Delivered"
                        hidden={!outDelivery}
                    />
                ) : (<></>)}
                {outDelivery ? (
                    <FormControlLabel
                        control={<Checkbox checked={pickedUp} onChange={(e) => setPickedUp(e.target.checked)} />}
                        hidden={!outDelivery}
                        label="Picked up"
                    />
                ) : (<></>)}
            </FormGroup>
        </div>
    )
}

export default Delivery;