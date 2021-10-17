/* eslint import/no-cycle: "off" */

import { Divider } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { FIELD_TYPES } from '../../utils/constants';
import AudioRecorder from '../AudioRecorder/AudioRecorder';
import DateField from '../Fields/DateField';
import FieldGroup from '../Fields/FieldGroup';
import PhoneField from '../Fields/PhoneField';
import PhotoField from '../Fields/PhotoField';
import RadioButtonField from '../Fields/RadioButtonField';
import SignatureField from '../Fields/SignatureField';
import TextArea from '../Fields/TextArea';
import TextField from '../Fields/TextField';
import Files from '../Files/Files';


const StepField = ({
    metadata,
    patientId = '',
    displayName,
    stepKey,
    isDisabled = true,
    initValue,
    handleFileDownload = () => {},
    handleFileUpload = () => {},
    handleFileDelete = () => {},
}, ref) => {
    const selectedLang = useTranslations()[1];

    const generateField = () => {
        switch (metadata.fieldType) {
            case FIELD_TYPES.STRING:
                return (
                    <TextField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        type="text"
                        initValue={initValue}
                        ref={ref}
                    />
                );
            case FIELD_TYPES.NUMBER:
                return (
                    <TextField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        type="number"
                        initValue={initValue}
                        ref={ref}
                    />
                );
            case FIELD_TYPES.PHONE:
                return (
                    <PhoneField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        initValue={initValue}
                        ref={ref}
                    />
                );
            case FIELD_TYPES.MULTILINE_STRING:
                return (
                    <div>
                        <TextArea
                            disabled={isDisabled}
                            title={displayName}
                            initValue={initValue}
                            ref={ref}
                        />
                    </div>
                );
            case FIELD_TYPES.DATE:
                return (
                    <DateField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        initValue={initValue}
                        ref={ref}
                    />
                );
            case FIELD_TYPES.FILE:
                return (
                    <Files
                        title={displayName}
                        fieldKey={metadata.key}
                        files={initValue}
                        handleDownload={handleFileDownload}
                        handleUpload={handleFileUpload}
                        handleDelete={handleFileDelete}
                        // ref={ref}
                    />
                );

            case FIELD_TYPES.RADIO_BUTTON:
                return (
                    <RadioButtonField
                        fieldId={metadata.key}
                        isDisabled={isDisabled}
                        title={displayName}
                        initValue={initValue}
                        options={metadata.options}
                        ref={ref}
                    />
                );

            case FIELD_TYPES.AUDIO:
                return (
                    <AudioRecorder
                        handleUpload={handleFileUpload}
                        handleDelete={handleFileDelete}
                        selectedLanguage={selectedLang}
                        patientId={patientId}
                        fieldKey={metadata.key}
                        stepKey={stepKey}
                        files={initValue}
                        title={displayName}
                        // ref={ref}
                    />
                );
            case FIELD_TYPES.DIVIDER:
                return (
                    <div className="patient-divider-wrapper">
                        <h2>{displayName}</h2>
                        <Divider className="patient-divider" />
                    </div>
                );
            case FIELD_TYPES.FIELD_GROUP:
                return (
                    <FieldGroup
                        metadata={metadata}
                        patientId={patientId}
                        displayName={displayName}
                        stepKey={stepKey}
                        isDisabled={isDisabled}
                        initValue={initValue}
                        handleFileDownload={handleFileDownload}
                        handleFileUpload={handleFileUpload}
                        handleFileDelete={handleFileDelete}
                        ref={ref}
                    />
                );
            case FIELD_TYPES.SIGNATURE:
                return (
                    <SignatureField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        initValue={initValue}
                        fieldId={metadata.key}
                        ref={ref}
                        documentURL={
                            metadata?.additionalData?.defaultDocumentURL
                        }
                    />
                );
            case FIELD_TYPES.HEADER:
                return <h3>{displayName}</h3>;
            case FIELD_TYPES.PHOTO:
                return (
                    <PhotoField
                        patientId={patientId}
                        stepKey={stepKey}
                        value={value}
                        displayName={displayName}
                        fieldId={metadata.key}
                        handleFileUpload={handleFileUpload}
                        handleSimpleUpdate={handleSimpleUpdate}
                    />
                );
            default:
                return null;
        }
    };

    return <div>{generateField()}</div>;
};

StepField.propTypes = {
    value: PropTypes.any,
    isDisabled: PropTypes.bool,
    patientId: PropTypes.string,
    handleFileDownload: PropTypes.func,
    handleFileUpload: PropTypes.func,
    handleFileDelete: PropTypes.func,
    displayName: PropTypes.string,
    stepKey: PropTypes.string,
    metadata: PropTypes.shape({
        key: PropTypes.string.isRequired,
        fieldType: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                Index: PropTypes.number,
                IsHidden: PropTypes.bool,
                Question: PropTypes.shape({
                    _id: PropTypes.string,
                    EN: PropTypes.string,
                    AR: PropTypes.string,
                }),
            }),
        ),
        additionalData: PropTypes.shape({
            defaultDocumentURL: PropTypes.shape({
                AR: PropTypes.string,
                EN: PropTypes.string,
            }),
        }),
    }),
};

export default forwardRef(StepField);
