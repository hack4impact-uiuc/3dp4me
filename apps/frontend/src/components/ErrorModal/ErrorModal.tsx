import PropTypes from 'prop-types';
import React, { KeyboardEventHandler } from 'react';
import { Modal, RootRef } from '@material-ui/core';

import './ErrorModal.scss';
import WarningIcon from '../../assets/warning.svg';
import { Nullish } from '@3dp4me/types';

const KEYCODE_SPACE = 32;
const DEFAULT_ERROR_MSG = 'An error occurred';

export interface ErrorModalProps {
    message?: Nullish<string>
    isOpen: boolean
    onClose: () => void
}

const ErrorModal = ({ message = DEFAULT_ERROR_MSG, isOpen, onClose }: ErrorModalProps) => {
    // Have this for accessibility
    const onKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
        // Space bar pressed
        if (e.keyCode === KEYCODE_SPACE) onClose();
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            // TODO: Is this an issue
            // @ts-ignore
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

export default ErrorModal;