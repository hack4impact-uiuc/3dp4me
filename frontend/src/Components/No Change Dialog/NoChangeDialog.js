import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';

const NoChangeDialog = (props) => {

    return (
        <Dialog
            open={props.open}
            onClose={() => props.noChange(false)}
        >
            <DialogTitle style={{ textAlign: 'center' }}><WarningIcon style={{ color: 'red', fontSize: "80px" }} /></DialogTitle>
            <DialogContent>
                <DialogContentText style={{ fontWeight: 'bolder', color: 'red', textAlign: 'center', fontFamily: 'Ubuntu' }}>
                    Woah there! It looks like you didn't change anything, are you sure you would like to proceed?
          </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        props.noChange(false);
                    }}
                    autoFocus
                    variant="outlined"
                    style={{
                        background: '#6295e0',
                        color: 'white',
                        '&:hover': {
                            background: '#6295e0'
                        }
                    }}
                >
                    Cancel
                    </Button>
                <Button
                    onClick={() => {
                        props.save("override");
                    }}
                    autoFocus
                    variant="outlined"
                    style={{
                        background: '#6295e0',
                        color: 'white',
                        '&:hover': {
                            background: '#6295e0'
                        }
                    }}
                >
                    Save
                    </Button>
            </DialogActions>
        </Dialog>
    );
}

export default NoChangeDialog;