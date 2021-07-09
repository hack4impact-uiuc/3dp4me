import './SignatureField.scss';
import React, { useState, useRef, useEffect } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Modal, Button, TextField as Text } from '@material-ui/core';
import PropTypes from 'prop-types';

const SignatureField = ({
    displayName,
    isDisabled,
    documentURL,
    fieldId = '',
    value = '',
    onChange = () => {},
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDocumentVisible, setIsDocumentVisible] = useState(false);

    const sigCanvas = useRef({});

    /* a function that uses the canvas ref to clear the canvas 
    via a method given by react-signature-canvas */
    const clear = () => sigCanvas.current.clear();

    /* a function that uses the canvas ref to trim the canvas 
    from white spaces via a method given by react-signature-canvas
    then saves it in our state */
    const save = () => {
        // TODO: Copy image to S3
        onChange(
            `${fieldId}.signatureURL`,
            sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'),
        );
        onChange(`${fieldId}.documentURL`, documentURL);
        setIsModalOpen(false);
    };

    const onToggleDocument = () => {
        setIsDocumentVisible((visible) => !visible);
    };

    return (
        <div className="signature-container">
            <h3>{displayName}</h3>
            {isDocumentVisible ? (
                <img
                    className="sig-document"
                    src={value?.documentURL || documentURL}
                />
            ) : null}
            <Modal open={isModalOpen} className="signature-modal">
                <div>
                    <SignaturePad
                        ref={sigCanvas}
                        canvasProps={{
                            className: 'signature-canvas',
                        }}
                    />
                    {/* Button to trigger save canvas image */}
                    <Button
                        className="signature-button save-signature"
                        onClick={save}
                    >
                        Save
                    </Button>
                    <Button
                        className="signature-button clear-signature"
                        onClick={clear}
                    >
                        Clear
                    </Button>
                    <Button
                        className="signature-button close-signature"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Close
                    </Button>
                </div>
            </Modal>
            {/* if our we have a non-null image url we should 
            show an image and pass our imageURL state to it*/}
            {value?.signatureURL ? (
                <img
                    className="signature"
                    src={value?.signatureURL}
                    alt="my signature"
                />
            ) : null}
            <div className="sig-ctl-container">
                <Button
                    className="sig-ctl-button doc-btn"
                    disabled={isDisabled}
                    onClick={onToggleDocument}
                >
                    {isDocumentVisible ? 'Hide Document' : 'View Document'}
                </Button>
                <Button
                    className="sig-ctl-button sign-btn"
                    disabled={isDisabled}
                    onClick={() => setIsModalOpen(true)}
                >
                    Sign
                </Button>
            </div>
        </div>
    );
};

SignatureField.propTypes = {
    displayName: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    fieldId: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
};

export default SignatureField;
