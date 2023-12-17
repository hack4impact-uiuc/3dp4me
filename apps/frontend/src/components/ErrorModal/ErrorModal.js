import PropTypes from 'prop-types';
import React from 'react';
import { Modal, RootRef } from '@material-ui/core';

import './ErrorModal.scss';
import WarningIcon from '../../assets/warning.svg';

const KEYCODE_SPACE = 32;
const DEFAULT_ERROR_MSG = 'An error occurred';

const ErrorModal = ({ message = DEFAULT_ERROR_MSG, isOpen, onClose }) => {
    // Have this for accessibility
    const onKeyDown = (e) => {
        // Space bar pressed
        if (e.keyCode === KEYCODE_SPACE) onClose();
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            container={() => RootRef.current}
        >
            <div
                className="error-modal-wrap"
                onClick={onClose}
                onKeyDown={onKeyDown}
                role="button"
                tabIndex={0}
            >
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
