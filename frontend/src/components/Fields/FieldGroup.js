import React from 'react';
import StepField from '../StepField/StepField';
import PropTypes from 'prop-types';

const FieldGroup = ({
    isDisabled,
    handleSimpleUpdate,
    handleFileDownload,
    handleFileUpload,
    handleFileDelete,
    languageData,
    value = {},
    langKey = 'EN',
    stepKey = '',
    patientId = '',
    metadata = {},
}) => {
    const getCompleteSubFieldKey = (subfieldKey) => {
        return `${metadata.key}.${subfieldKey}`;
    };

    const generateAllGroups = () => {
        return generateSingleGroup();
    };

    const generateSingleGroup = () => {
        return metadata?.subFields?.map((field) => {
            return (
                <div>
                    <div className="step-field">
                        <StepField
                            displayName={field.displayName[langKey]}
                            metadata={field}
                            value={value ? value[field.key] : null}
                            key={field.key}
                            langKey={langKey}
                            isDisabled={isDisabled}
                            patientId={patientId}
                            stepKey={stepKey}
                            handleSimpleUpdate={(k, v) =>
                                handleSimpleUpdate(getCompleteSubFieldKey(k), v)
                            }
                            handleFileDownload={handleFileDownload}
                            handleFileUpload={handleFileUpload}
                            handleFileDelete={handleFileDelete}
                            languageData={languageData}
                        />
                    </div>
                </div>
            );
        });
    };

    return <div>{generateAllGroups()}</div>;
};

FieldGroup.propTypes = {
    displayName: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    fieldId: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
};

export default FieldGroup;
