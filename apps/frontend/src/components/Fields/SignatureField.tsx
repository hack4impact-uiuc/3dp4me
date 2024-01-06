/* eslint-disable no-use-before-define */

import { Button, Modal } from '@material-ui/core';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LegacyRef, useEffect, useRef, useState } from 'react';
import SignaturePadWrapper from 'react-signature-canvas';
import SignaturePad, { PointGroup } from 'signature_pad';
import './SignatureField.scss';
import { useTranslations } from '../../hooks/useTranslations';
import { Nullish, Signature, SignaturePoint, Path, PathValue, TranslatedString } from '@3dp4me/types';
import ReactSignatureCanvas from 'react-signature-canvas';

export interface SignatureFieldProps<T extends string> {
    displayName: string
    isDisabled: boolean
    documentURL: TranslatedString
    fieldId: T
    value?: Nullish<Signature>
    onChange?: (key: `${T}.${Path<Signature>}`, value: PathValue<Signature>) => void
}

const SignatureField = <T extends string>({
    displayName,
    isDisabled,
    documentURL,
    fieldId,
    value = null,
    onChange = () => {},
}: SignatureFieldProps<T>) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDocumentVisible, setIsDocumentVisible] = useState(false);
    const translations = useTranslations()[0];
    const sigCanvas = useRef<ReactSignatureCanvas | null>(null);

    useEffect(() => {
        if (!value?.signatureData || isModalOpen) return;

        // Throw the existing signature data onto the canvas
        const canvas = document.querySelector('canvas');
        if (!canvas) return

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
        canvas: HTMLCanvasElement,
        data: SignaturePoint[][],
        originalCanvasWidth: number,
        originalCanvasHeight: number,
    ): PointGroup[] => {
        const formattedData = data.map((points) => {
            let formattedPoints = points.map((point) => _.omit(point, 'color'));
            const firstTimestamp =
                formattedPoints.length > 0 ? formattedPoints[0].time : 0;

            formattedPoints = formattedPoints.map((point) => {
                const scaleFactor = canvas.width / originalCanvasWidth;
                const deltaT = point.time - firstTimestamp;

                return {
                    // Scale the data points so that they fit this canvas
                    x: (point.x / originalCanvasWidth) * canvas.width,
                    y: (point.y / originalCanvasHeight) * canvas.height,

                    // Scales the time of each touch point.... doens't work great
                    time: firstTimestamp + deltaT * scaleFactor,
                };
            });

            return {
                color: "black",
                points: formattedPoints,
            }
        });

        return formattedData;
    };

    /**
     * Clear the canvas
     */
    const clear = () => sigCanvas.current?.clear();

    /**
     * Saves signature data points along with the canvas width and height so that
     * we can display it across different device sizes. Also save the document URL
     * that was shown at the time of signing (in case it's updated in the future)
     */
    const save = () => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return
        if (sigCanvas.current)
            onChange(`${fieldId}.signatureData`, sigCanvas.current.toData());

        onChange(`${fieldId}.signatureCanvasWidth`, canvas.width);
        onChange(`${fieldId}.signatureCanvasHeight`, canvas.height);
        onChange(`${fieldId}.documentURL.EN`, documentURL.EN);
        onChange(`${fieldId}.documentURL.AR`, documentURL.AR);
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
                {/* For now we are only showing the arabic document */}
                {/* <img
                    alt="document"
                    className="sig-document"
                    src={value?.documentURL?.EN || documentURL?.EN}
                /> */}
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
};

SignatureField.propTypes = {
    displayName: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    documentURL: PropTypes.shape({
        EN: PropTypes.string,
        AR: PropTypes.string,
    }).isRequired,
    fieldId: PropTypes.string,
    value: PropTypes.shape({
        signatureData: PropTypes.array,
        signatureCanvasWidth: PropTypes.number,
        signatureCanvasHeight: PropTypes.number,
        documentURL: PropTypes.shape({
            EN: PropTypes.string,
            AR: PropTypes.string,
        }),
    }),
    onChange: PropTypes.func,
};

export default SignatureField;
