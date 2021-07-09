import './SignatureField.scss';
import React, { useState, useRef, useEffect } from 'react';
import SignaturePadWrapper from 'react-signature-canvas';
import SignaturePad from 'signature_pad';
import { Modal, Button, TextField as Text } from '@material-ui/core';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { LanguageDataType } from '../../utils/custom-proptypes';

const SignatureField = ({
    displayName,
    isDisabled,
    documentURL,
    languageData,
    fieldId = '',
    value = '',
    onChange = () => {},
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDocumentVisible, setIsDocumentVisible] = useState(false);
    const sigCanvas = useRef({});

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    useEffect(() => {
        if (!value?.signatureData || isModalOpen) return;

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
                newPoint.x = (point.x / originalCanvasWidth) * canvas.width;
                newPoint.y = (point.y / originalCanvasHeight) * canvas.height;

                const scaleFactor = canvas.width / originalCanvasWidth;
                const deltaT = point.time - firstTimestamp;
                newPoint.time = firstTimestamp + deltaT * scaleFactor;

                return newPoint;
            });

            pointGroup.points = formattedPoints;
            return pointGroup;
        });

        // canvas.width, canvas.height

        return formattedData;
    };

    /* a function that uses the canvas ref to clear the canvas 
    via a method given by react-signature-canvas */
    const clear = () => sigCanvas.current.clear();

    /* a function that uses the canvas ref to trim the canvas 
    from white spaces via a method given by react-signature-canvas
    then saves it in our state */
    const save = () => {
        const canvas = document.querySelector('canvas');
        onChange(`${fieldId}.signatureData`, sigCanvas.current.toData());
        onChange(`${fieldId}.signatureCanvasWidth`, canvas.width);
        onChange(`${fieldId}.signatureCanvasHeight`, canvas.height);
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
                        {lang.components.signature.save}
                    </Button>
                    <Button
                        className="signature-button clear-signature"
                        onClick={clear}
                    >
                        {lang.components.signature.clear}
                    </Button>
                    <Button
                        className="signature-button close-signature"
                        onClick={() => setIsModalOpen(false)}
                    >
                        {lang.components.signature.close}
                    </Button>
                </div>
            </Modal>
            {/* if our we have a non-null image url we should 
            show an image and pass our imageURL state to it */}
            <div className="sig-container">
                {value?.signatureData && !isModalOpen ? <canvas /> : null}
                <view className="sig-ctl-container">
                    <Button
                        className="sig-ctl-button doc-btn"
                        disabled={isDisabled}
                        onClick={onToggleDocument}
                    >
                        {isDocumentVisible
                            ? lang.components.signature.hideDoc
                            : lang.components.signature.viewDoc}
                    </Button>
                    <Button
                        className="sig-ctl-button sign-btn"
                        disabled={isDisabled}
                        onClick={() => setIsModalOpen(true)}
                    >
                        {lang.components.signature.sign}
                    </Button>
                </view>
            </div>
        </div>
    );
};

SignatureField.propTypes = {
    displayName: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    fieldId: PropTypes.string,
    value: PropTypes.string,
    languageData: LanguageDataType.isRequired,
    type: PropTypes.string,
    onChange: PropTypes.func,
};

export default SignatureField;
