/* eslint-disable no-use-before-define */

import { Button, Modal } from '@material-ui/core';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import SignaturePadWrapper from 'react-signature-canvas';
import SignaturePad from 'signature_pad';

import { useTranslations } from '../../hooks/useTranslations';
import './SignatureField.scss';


const SignatureField = forwardRef(({
    displayName,
    isDisabled,
    documentURL,
    initValue,
}, ref) => {
    const [value, setValue] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDocumentVisible, setIsDocumentVisible] = useState(false);
    const translations = useTranslations()[0];
    const sigCanvas = useRef({});

    useEffect(() => {
        setValue(initValue)
    }, [initValue])

    useImperativeHandle(ref,
        () => ({
            value
        }),
    )

    useEffect(() => {
        if (!value?.signatureData || isModalOpen) return;

        // Throw the existing signature data onto the canvas
        const canvas = document.querySelector('canvas');
        const signaturePad = new SignaturePad(canvas);
        const data = transformSignatureData(
            canvas,
            value.signatureData,
            value.signatureCanvasWidth,
            value.signatureCanvasHeight,
        );

        signaturePad.fromData(data);
    }, [value, isModalOpen]);

    /**
     * Transforms the signature data so that it is able to be displayed on the canvas.
     * This includes doing some slight manipulation of the structure and scaling
     */
    const transformSignatureData = (
        canvas,
        data,
        originalCanvasWidth,
        originalCanvasHeight,
    ) => {
        const formattedData = data.map((points) => {
            const pointGroup = { color: 'black' };
            let formattedPoints = points.map((point) => _.omit(point, 'color'));
            const firstTimestamp =
                formattedPoints.length > 0 ? formattedPoints[0].time : 0;

            formattedPoints = formattedPoints.map((point) => {
                const newPoint = {};

                // Scale the data points so that they fit this canvas
                newPoint.x = (point.x / originalCanvasWidth) * canvas.width;
                newPoint.y = (point.y / originalCanvasHeight) * canvas.height;

                // Scales the time of each touch point.... doens't work great
                const scaleFactor = canvas.width / originalCanvasWidth;
                const deltaT = point.time - firstTimestamp;
                newPoint.time = firstTimestamp + deltaT * scaleFactor;

                return newPoint;
            });

            pointGroup.points = formattedPoints;
            return pointGroup;
        });

        return formattedData;
    };

    /**
     * Clear the canvas
     */
    const clear = () => sigCanvas.current.clear();

    /**
     * Saves signature data points along with the canvas width and height so that
     * we can display it across different device sizes. Also save the document URL
     * that was shown at the time of signing (in case it's updated in the future)
     */
    const save = () => {
        const canvas = document.querySelector('canvas');
        setValue({
            signatureData: sigCanvas.current.toData(),
            signatureCanvasWidth: canvas.width,
            signatureCanvasHeight: canvas.height,
            documentURL: {
                EN: documentURL.EN,
                AR: documentURL.AR,
            }
        })
        setIsModalOpen(false);
    };

    /**
     * Toggles whether the signing docs are visible
     */
    const onToggleDocument = () => {
        setIsDocumentVisible((visible) => !visible);
    };

    /**
     * Shows the documents that the user is signing
     */
    const renderDocuments = () => {
        if (!isDocumentVisible) return null;

        return (
            <div>
                <img
                    alt="document"
                    className="sig-document"
                    src={value?.documentURL?.EN || documentURL?.EN}
                />
                <img
                    alt="document"
                    className="sig-document"
                    src={value?.documentURL?.AR || documentURL?.AR}
                />
            </div>
        );
    };

    /**
     * Renders the canvas for displaying saved signatures (not for creating new ones).
     * The library we're using is kind of bad... we can't ever have more than one canvas
     * elements on screen
     */
    const renderCanvas = () => {
        // We can't render the canvas while the other canvas is visible
        if (!value?.signatureData || isModalOpen) return null;

        return <canvas />;
    };

    return (
        <div className="signature-container">
            <h3>{displayName}</h3>
            {renderDocuments()}
            <Modal open={isModalOpen} className="signature-modal">
                <div>
                    <SignaturePadWrapper
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
                        {translations.components.signature.save}
                    </Button>
                    <Button
                        className="signature-button clear-signature"
                        onClick={clear}
                    >
                        {translations.components.signature.clear}
                    </Button>
                    <Button
                        className="signature-button close-signature"
                        onClick={() => setIsModalOpen(false)}
                    >
                        {translations.components.signature.close}
                    </Button>
                </div>
            </Modal>
            <div className="sig-container">
                {renderCanvas()}
                <div className="sig-ctl-container">
                    <Button
                        className="sig-ctl-button doc-btn"
                        disabled={isDisabled}
                        onClick={onToggleDocument}
                    >
                        {isDocumentVisible
                            ? translations.components.signature.hideDoc
                            : translations.components.signature.viewDoc}
                    </Button>
                    <Button
                        className="sig-ctl-button sign-btn"
                        disabled={isDisabled}
                        onClick={() => setIsModalOpen(true)}
                    >
                        {translations.components.signature.sign}
                    </Button>
                </div>
            </div>
        </div>
    );
});

SignatureField.propTypes = {
    displayName: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    documentURL: PropTypes.shape({
        EN: PropTypes.string,
        AR: PropTypes.string,
    }).isRequired,
    initValue: PropTypes.shape({
        signatureData: PropTypes.array,
        signatureCanvasWidth: PropTypes.number,
        signatureCanvasHeight: PropTypes.number,
        documentURL: PropTypes.shape({
            EN: PropTypes.string,
            AR: PropTypes.string,
        }),
    }).isRequired,
};

export default SignatureField;
