import React from 'react';
import PropTypes from 'prop-types';
import { Divider } from '@material-ui/core';
import AudioRecorder from '../../components/AudioRecorder/AudioRecorder';
import TextField from '../Fields/TextField';
import Notes from '../Notes/Notes';
import Files from '../Files/Files';
import { FIELD_TYPES } from '../../utils/constants';

const StepField = ({
    fieldType,
    displayName,
    value,
    fieldId,
    patientId,
    stepKey,
    languageData,
    isDisabled = true,
    handleSimpleUpdate = () => {},
    handleFileDownload = () => {},
    handleFileUpload = () => {},
    handleFileDelete = () => {},
}) => {
    const generateField = () => {
        switch (fieldType) {
            case FIELD_TYPES.STRING:
                return (
                    <TextField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        onChange={handleSimpleUpdate}
                        fieldId={fieldId}
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
                            fieldId={fieldId}
                            value={value}
                        />
                    </div>
                );
            case FIELD_TYPES.DATE:
                return (
                    <TextField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        onChange={handleSimpleUpdate}
                        fieldId={fieldId}
                        value={value}
                    />
                );
            case FIELD_TYPES.PHONE:
                return (
                    <TextField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        onChange={handleSimpleUpdate}
                        fieldId={fieldId}
                        value={value}
                    />
                );
            case FIELD_TYPES.FILE:
                return (
                    <Files
                        languageData={languageData}
                        title={displayName}
                        files={value}
                        fieldKey={fieldId}
                        handleDownload={handleFileDownload}
                        handleUpload={handleFileUpload}
                        handleDelete={handleFileDelete}
                    />
                );
            case FIELD_TYPES.AUDIO:
                return (
                    <AudioRecorder
                        languageData={languageData}
                        handleUpload={handleFileUpload}
                        handleDelete={handleFileDelete}
                        patientId={patientId}
                        stepKey={stepKey}
                        files={value}
                        title={displayName}
                        fieldKey={fieldId}
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
    fieldType: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    languageData: PropTypes.object.isRequired,
    fieldId: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    handleSimpleUpdate: PropTypes.func,
    handleFileDownload: PropTypes.func,
    handleFileUpload: PropTypes.func,
    handleFileDelete: PropTypes.func,
    displayName: PropTypes.shape({
        EN: PropTypes.string,
        AR: PropTypes.string,
    }).isRequired,
};

export default StepField;
