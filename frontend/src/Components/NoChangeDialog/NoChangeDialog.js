import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import './NoChangeDialog.scss';

const NoChangeDialog = (props) => {

    return (
        <Dialog
            open={props.open}
            onClose={() => props.noChange(false)}
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
                    onClick={() => {
                        props.noChange(false);
                    }}
                    autoFocus
                    variant="outlined"
                >
                    Cancel
                    </Button>
                <Button
                    className="dialog-button"
                    onClick={() => {
                        props.save("override");
                    }}
                    autoFocus
                    variant="outlined"
                >
                    Save
                    </Button>
            </DialogActions>
        </Dialog>
    );
}

export default NoChangeDialog;