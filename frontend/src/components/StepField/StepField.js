import React, { useState } from 'react';
import TextField from '../../components/Fields/TextField';
import { Divider } from '@material-ui/core';
import Notes from '../../components/Notes/Notes';
import Files from '../../components/Files/Files';

const StepField = ({
    fieldType,
    displayName,
    value,
    fieldId,
    isDisabled,
    handleSimpleUpdate,
    handleFileDownload,
    handleFileUpload,
    handleFileDelete,
    languageData,
}) => {
    const generateField = () => {
        switch (fieldType) {
            case 'String':
                return (
                    <TextField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        onChange={handleSimpleUpdate}
                        fieldId={fieldId}
                        value={value}
                    />
                );
            case 'MultilineString':
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
            case 'Date':
                return (
                    <TextField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        onChange={handleSimpleUpdate}
                        fieldId={fieldId}
                        value={value}
                    />
                );
            case 'Phone':
                return (
                    <TextField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        onChange={handleSimpleUpdate}
                        fieldId={fieldId}
                        value={value}
                    />
                );
            case 'File':
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
            case 'Divider':
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

export default StepField;
