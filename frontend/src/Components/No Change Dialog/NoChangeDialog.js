import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
<<<<<<< HEAD
import './NoChangeDialog.scss';
=======
>>>>>>> origin/aws-backend-auth

const NoChangeDialog = (props) => {

    return (
        <Dialog
            open={props.open}
            onClose={() => props.noChange(false)}
<<<<<<< HEAD
            className="no-change-dialog-wrapper"
        >
            <DialogTitle className="dialog-title">
                <WarningIcon className="warning-icon" />
            </DialogTitle>
            <DialogContent>
                <DialogContentText className="dialog-text">
                    Woah there! It looks like you didn't change anything, are you sure you would like to proceed?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    className="dialog-button"
=======
        >
            <DialogTitle style={{ textAlign: 'center' }}><WarningIcon style={{ color: 'red', fontSize: "80px" }} /></DialogTitle>
            <DialogContent>
                <DialogContentText style={{ fontWeight: 'bolder', color: 'red', textAlign: 'center', fontFamily: 'Ubuntu' }}>
                    Woah there! It looks like you didn't change anything, are you sure you would like to proceed?
          </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
>>>>>>> origin/aws-backend-auth
                    onClick={() => {
                        props.noChange(false);
                    }}
                    autoFocus
                    variant="outlined"
<<<<<<< HEAD
=======
                    style={{
                        background: '#6295e0',
                        color: 'white',
                        '&:hover': {
                            background: '#6295e0'
                        }
                    }}
>>>>>>> origin/aws-backend-auth
                >
                    Cancel
                    </Button>
                <Button
<<<<<<< HEAD
                    className="dialog-button"
=======
>>>>>>> origin/aws-backend-auth
                    onClick={() => {
                        props.save("override");
                    }}
                    autoFocus
                    variant="outlined"
<<<<<<< HEAD
=======
                    style={{
                        background: '#6295e0',
                        color: 'white',
                        '&:hover': {
                            background: '#6295e0'
                        }
                    }}
>>>>>>> origin/aws-backend-auth
                >
                    Save
                    </Button>
            </DialogActions>
        </Dialog>
    );
}

export default NoChangeDialog;