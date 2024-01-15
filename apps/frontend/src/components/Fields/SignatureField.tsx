/* eslint-disable no-use-before-define */

import { Button, Modal } from '@material-ui/core';
import _ from 'lodash';
import { LegacyRef, useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import './SignatureField.scss';
import { useTranslations } from '../../hooks/useTranslations';
import { Nullish, Signature, SignaturePoint, Path, PathValue, TranslatedString } from '@3dp4me/types';
import type ReactSignatureCanvas from 'react-signature-canvas';
import { NewSiganatureModal, SignatureData } from '../NewSignatureModal/NewSignatureModal';

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
        if (!value?.signatureData || isModalOpen || !sigCanvas.current) return;

        const canvas = sigCanvas.current.getCanvas()
        if (!canvas) return

        const data = transformSignatureData(
            canvas,
            value.signatureData,
            value.signatureCanvasWidth,
            value.signatureCanvasHeight,
        );

        console.log("DATA IS ", data)
        console.log("CANVAS ID ", sigCanvas.current)
        sigCanvas.current?.fromData(data as any)
    }, [value, isModalOpen, sigCanvas.current]);

    /**
     * Transforms the signature data so that it is able to be displayed on the canvas.
     * This includes doing some slight manipulation of the structure and scaling
     */
    const transformSignatureData = (
        canvas: HTMLCanvasElement,
        data: SignaturePoint[][],
        originalCanvasWidth: number,
        originalCanvasHeight: number,
    ) => {
        const formattedData = data.map((points) => {
            const withoutColor = points.map((point) => _.omit(point, 'color'));
            const firstTimestamp = withoutColor.length > 0 ? withoutColor[0].time : 0;

            const padPoints = withoutColor.map((point) => {
                const scaleFactor = canvas.width / originalCanvasWidth;
                const deltaT = point.time - firstTimestamp;

                // Scale the data points so that they fit this canvas
                const x = (point.x / originalCanvasWidth) * canvas.width
                const y = (point.y / originalCanvasHeight) * canvas.height

                // Scales the time of each touch point.... doens't work great
                const time = firstTimestamp + deltaT * scaleFactor

                return { x, y, time }
            });

            return padPoints
        });

        return formattedData;
    };

    /**
     * Saves signature data points along with the canvas width and height so that
     * we can display it across different device sizes. Also save the document URL
     * that was shown at the time of signing (in case it's updated in the future)
     */
    const onNewSignature = (data: SignatureData) => {
        onChange(`${fieldId}.signatureData`, data.points);
        onChange(`${fieldId}.signatureCanvasWidth`, data.width);
        onChange(`${fieldId}.signatureCanvasHeight`, data.height);
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

        return <SignatureCanvas ref={sigCanvas}/>;
    };

    return (
        <div className="signature-container">
            <h3>{displayName}</h3>
            {renderDocuments()}
            <NewSiganatureModal 
                onClose={() => setIsModalOpen(false)}
                onSave={onNewSignature}
                isOpen={isModalOpen}/>
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

export default SignatureField;
