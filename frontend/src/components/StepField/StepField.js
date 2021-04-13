import React from 'react';
import PropTypes from 'prop-types';
import { Divider } from '@material-ui/core';

import AudioRecorder from '../AudioRecorder/AudioRecorder';
import TextField from '../Fields/TextField';
import Notes from '../Notes/Notes';
import Files from '../Files/Files';
import { FIELD_TYPES } from '../../utils/constants';
import RadioButtonField from '../Fields/RadioButtonField';
import DateField from '../Fields/DateField';
import PhoneField from '../Fields/PhoneField';

const StepField = ({
    metadata,
    value,
    langKey,
    languageData,
    patientId = '',
    displayName,
    stepKey,
    isDisabled = true,
    handleSimpleUpdate = () => {},
    handleFileDownload = () => {},
    handleFileUpload = () => {},
    handleFileDelete = () => {},
}) => {
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
                        <Notes
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
                        langKey={langKey}
                        onChange={handleSimpleUpdate}
                        fieldId={metadata.key}
                        value={value}
                    />
                );
            case FIELD_TYPES.PHONE:
                return (
                    <TextField
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
                        languageData={languageData}
                        title={displayName}
                        files={value}
                        fieldKey={metadata.key}
                        handleDownload={handleFileDownload}
                        handleUpload={handleFileUpload}
                        handleDelete={handleFileDelete}
                    />
                );

            case FIELD_TYPES.RADIO_BUTTON:
                return (
                    <RadioButtonField
                        fieldId={metadata.key}
                        isDisabled={isDisabled}
                        title={displayName}
                        langKey={langKey}
                        value={value}
                        options={metadata.options}
                        onChange={handleSimpleUpdate}
                    />
                );

            case FIELD_TYPES.AUDIO:
                return (
                    <AudioRecorder
                        languageData={languageData}
                        handleUpload={handleFileUpload}
                        handleDelete={handleFileDelete}
                        patientId={patientId}
                        fieldKey={metadata.key}
                        stepKey={stepKey}
                        files={value}
                        title={displayName}
                    />
                );
            case FIELD_TYPES.DIVIDER:
                return (
                    <div className="patient-divider-wrapper">
                        <h2>{displayName}</h2>
                        <Divider className="patient-divider" />
                    </div>
                );
            case 'Header':
                return <h3>{displayName}</h3>;
            default:
                return null;
        }
    };

    return <div>{generateField()}</div>;
};

StepField.propTypes = {
    value: PropTypes.any.isRequired,
    languageData: PropTypes.object.isRequired,
    isDisabled: PropTypes.bool,
    patientId: PropTypes.string,
    handleSimpleUpdate: PropTypes.func,
    handleFileDownload: PropTypes.func,
    handleFileUpload: PropTypes.func,
    handleFileDelete: PropTypes.func,
    displayName: PropTypes.string,
    stepKey: PropTypes.string,
    langKey: PropTypes.string,
    metadata: PropTypes.shape({
        key: PropTypes.string.isRequired,
        fieldType: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.string),
    }),
};

export default StepField;
