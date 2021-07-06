/* eslint import/no-cycle: "off" */
// Unfortunately, there has to be an import cycle, because this is by nature, recursive
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

import StepField from '../StepField/StepField';
import './Fields.scss';

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
    const getKeyBase = (index) => {
        return `${metadata.key}.${index}`;
    };

    const getCompleteSubFieldKey = (index, subfieldKey) => {
        return `${getKeyBase(index)}.${subfieldKey}`;
    };

    const getNumFields = () => {
        return value?.length ?? 0;
    };

    const onSimpleUpdate = (k, v, i) => {
        handleSimpleUpdate(getCompleteSubFieldKey(i, k), v);
    };

    const onFileUpload = (k, v, i) => {
        handleFileUpload(getCompleteSubFieldKey(i, k), v);
    };

    const onFileDownload = (k, v, i) => {
        handleFileDownload(getCompleteSubFieldKey(i, k), v);
    };

    const onFileDelete = (k, v, i) => {
        handleFileDelete(getCompleteSubFieldKey(i, k), v);
    };

    const onAddGroup = () => {
        handleSimpleUpdate(getKeyBase(getNumFields()), {});
    };

    const generateSingleGroup = (index) => {
        return metadata?.subFields?.map((field) => {
            return (
                <div key={`${getCompleteSubFieldKey(field.key)}.${index}`}>
                    <div className="step-field">
                        <StepField
                            displayName={field.displayName[langKey]}
                            metadata={field}
                            value={value ? value[index][field.key] : null}
                            key={field.key}
                            langKey={langKey}
                            isDisabled={isDisabled}
                            patientId={patientId}
                            stepKey={stepKey}
                            handleSimpleUpdate={(k, v) =>
                                onSimpleUpdate(k, v, index)
                            }
                            handleFileDownload={(k, v) =>
                                onFileDownload(k, v, index)
                            }
                            handleFileUpload={(k, v) =>
                                onFileUpload(k, v, index)
                            }
                            handleFileDelete={(k, v) =>
                                onFileDelete(k, v, index)
                            }
                            languageData={languageData}
                        />
                    </div>
                </div>
            );
        });
    };

    const generateAllGroups = () => {
        const numFieldGroups = getNumFields();
        const groups = [];

        for (let i = 0; i < numFieldGroups; i += 1) {
            groups.push(
                <h3>{`${metadata?.displayName[langKey]} ${i + 1}`}</h3>,
            );
            groups.push(generateSingleGroup(i));
        }

        return groups;
    };

    return (
        <div className="field-container">
            {generateAllGroups()}
            <Button className="field-group-button" onClick={onAddGroup}>
                {`${languageData.translations[langKey].components.fieldGroup.add} ${metadata?.displayName[langKey]}`}
            </Button>
        </div>
    );
};

FieldGroup.propTypes = {
    handleSimpleUpdate: PropTypes.func.isRequired,
    handleFileUpload: PropTypes.func.isRequired,
    handleFileDownload: PropTypes.func.isRequired,
    handleFileDelete: PropTypes.func.isRequired,
    stepKey: PropTypes.string,
    langKey: PropTypes.string,
    value: PropTypes.object,
    patientId: PropTypes.string,
    metadata: PropTypes.object,
    isDisabled: PropTypes.bool.isRequired,
};

export default FieldGroup;
