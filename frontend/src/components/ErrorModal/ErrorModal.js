/* eslint jsx-a11y/click-events-have-key-events: "warn" */
/* eslint jsx-a11y/no-static-element-interactions: "warn" */
import PropTypes from 'prop-types';
import React from 'react';
import { Modal, RootRef } from '@material-ui/core';

import './ErrorModal.scss';
import WarningIcon from '../../assets/warning.svg';

const ErrorModal = ({ message = 'An error occured', isOpen, onClose }) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            container={() => RootRef.current}
        >
            <div className="error-modal-wrap" onClick={onClose}>
                <div className="error-modal-inner">
                    <div className="inner">
                        <img src={WarningIcon} alt="error icon" />
                        <h1>{message}</h1>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

ErrorModal.propTypes = {
    message: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ErrorModal;
