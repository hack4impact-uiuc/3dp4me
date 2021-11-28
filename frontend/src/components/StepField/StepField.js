/* eslint import/no-cycle: "off" */

import { Divider } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

import { useTranslations } from '../../hooks/useTranslations';
import { FIELD_TYPES } from '../../utils/constants';
import AudioRecorder from '../AudioRecorder/AudioRecorder';
import DateField from '../Fields/DateField';
import FieldGroup from '../Fields/FieldGroup';
import MapField from '../Fields/MapField';
import PhoneField from '../Fields/PhoneField';
import PhotoField from '../Fields/PhotoField';
import RadioButtonField from '../Fields/RadioButtonField';
import SignatureField from '../Fields/SignatureField';
import TextArea from '../Fields/TextArea';
import TextField from '../Fields/TextField';
import Files from '../Files/Files';

const StepField = ({
    metadata,
    value,
    initValue,
    patientId = '',
    displayName,
    stepKey,
    isDisabled = true,
    handleSimpleUpdate = () => { },
    handleFileDownload = () => { },
    handleFileUpload = () => { },
    handleFileDelete = () => { },
}) => {
    const selectedLang = useTranslations()[1];

    const generateField = () => {
        switch (metadata.fieldType) {
            case FIELD_TYPES.STRING:
                return (
                    <TextField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        type="text"
                        onChange={handleSimpleUpdate}
                        fieldId={metadata.key}
                        value={value}
                    />
                );
            case FIELD_TYPES.NUMBER:
                return (
                    <TextField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        type="number"
                        onChange={handleSimpleUpdate}
                        fieldId={metadata.key}
                        value={value}
                    />
                );
            case FIELD_TYPES.PHONE:
                return (
                    <PhoneField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        onChange={handleSimpleUpdate}
                        fieldId={metadata.key}
                        value={value}
                    />
                );
            case FIELD_TYPES.MULTILINE_STRING:
                return (
                    <div>
                        <TextArea
                            disabled={isDisabled}
                            onChange={handleSimpleUpdate}
                            title={displayName}
                            fieldId={metadata.key}
                            value={value}
                        />
                    </div>
                );
            case FIELD_TYPES.DATE:
                return (
                    <DateField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        onChange={handleSimpleUpdate}
                        fieldId={metadata.key}
                        value={value}
                    />
                );
            case FIELD_TYPES.FILE:
                return (
                    <Files
                        title={displayName}
                        files={value}
                        fieldKey={metadata.key}
                        handleDownload={handleFileDownload}
                        handleUpload={handleFileUpload}
                        handleDelete={handleFileDelete}
                        isDisabled={isDisabled}
                    />
                );

            case FIELD_TYPES.RADIO_BUTTON:
                return (
                    <RadioButtonField
                        fieldId={metadata.key}
                        isDisabled={isDisabled}
                        title={displayName}
                        value={value}
                        options={metadata.options}
                        onChange={handleSimpleUpdate}
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
                        files={value}
                        title={displayName}
                        isDisabled={isDisabled}
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
                        handleSimpleUpdate={handleSimpleUpdate}
                        handleFileDownload={handleFileDownload}
                        handleFileUpload={handleFileUpload}
                        handleFileDelete={handleFileDelete}
                        fieldId={metadata.key}
                        value={value}
                    />
                );
            case FIELD_TYPES.SIGNATURE:
                return (
                    <SignatureField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        onChange={handleSimpleUpdate}
                        fieldId={metadata.key}
                        value={value}
                        documentURL={
                            metadata?.additionalData?.defaultDocumentURL
                        }
                    />
                );
            case FIELD_TYPES.HEADER:
                return <h3>{displayName}</h3>;
            case FIELD_TYPES.MAP:
                return (
                    <MapField
                        value={value}
                        initValue={initValue}
                        displayName={displayName}
                        isDisabled={isDisabled}
                        onChange={handleSimpleUpdate}
                        fieldId={metadata.key}
                    />
                );
            case FIELD_TYPES.PHOTO:
                return (
                    <PhotoField
                        handleFileUpload={handleFileUpload}
                        patientId={patientId}
                        stepKey={stepKey}
                        value={value || []}
                        displayName={displayName}
                        fieldId={metadata.key}
                        isDisabled={isDisabled}
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
    initValue: PropTypes.any,
    isDisabled: PropTypes.bool,
    patientId: PropTypes.string,
    handleSimpleUpdate: PropTypes.func,
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

export default StepField;
