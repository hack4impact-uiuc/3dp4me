import PropTypes from 'prop-types';
import React from 'react';
import { Modal, RootRef } from '@material-ui/core';

const ErrorModal = ({ message = 'An error occured', isOpen, onClose }) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            container={() => RootRef.current}
        >
            <div>
                <h1>{message}</h1>
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
