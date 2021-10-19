/* eslint import/no-cycle: "off" */
// Unfortunately, there has to be an import cycle, because this is by nature, recursive
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { useTranslations } from '../../hooks/useTranslations';
import StepField from '../StepField/StepField';
import './Fields.scss';









const FieldGroup = forwardRef(({
    isDisabled,
    handleFileDownload,
    handleFileUpload,
    handleFileDelete,
    initValue,
    stepKey = '',
    patientId = '',
    metadata = {},
}, ref) => {
    const [translations, selectedLang] = useTranslations();
    const [value, setValue] = useState([]);
    const [refs, setRefs] = useState([]);

    useEffect(() => {
        setValue(initValue)
    }, [initValue])

    useImperativeHandle(ref,
        () => {
            const data = {};
            data.value = []

            /* eslint no-restricted-syntax: "off" */
            for (const r of Object.values(refs)) {
                const item = {}

                for (const [k, v] of Object.entries(r)) {
                   item[k]  = v?.value
                }

                data.value.push(item)
            }
            /* eslint no-restricted-syntax: "error" */

            return data;
        },
    )

    const addFieldRef = (fieldKey, i, newRef) => {
        /* eslint no-param-reassign: "off" */
        setRefs(oldRefs => {
            if (!oldRefs[i])
                oldRefs.push({})

            oldRefs[i][fieldKey] = newRef
            return oldRefs;
        })
        /* eslint no-param-reassign: "error" */
    }

    const getKeyBase = (index) => {
        return `${metadata.key}.${index}`;
    };

    const getCompleteSubFieldKey = (index, subfieldKey) => {
        return `${getKeyBase(index)}.${subfieldKey}`;
    };

    const getNumFields = () => {
        return value?.length ?? 0;
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
        setValue(val => {
            return val.concat({})
        });
    };

    const generateSingleGroup = (index) => {
        return metadata?.subFields?.map((field) => {
            return (
                <div key={`${getCompleteSubFieldKey(field.key)}.${index}`}>
                    <div className="step-field">
                        <StepField
                            displayName={field.displayName[selectedLang]}
                            metadata={field}
                            initValue={value ? value[index][field.key] : null}
                            key={field.key}
                            isDisabled={isDisabled}
                            patientId={patientId}
                            stepKey={stepKey}
                            handleFileDownload={(k, v) =>
                                onFileDownload(k, v, index)
                            }
                            handleFileUpload={(k, v) =>
                                onFileUpload(k, v, index)
                            }
                            handleFileDelete={(k, v) =>
                                onFileDelete(k, v, index)
                            }
                            ref={(r) => addFieldRef(field.key, index, r)}
                        />
                    </div>
                </div>
            );
        });
    };

    const generateAllGroups = () => {
        const numFieldGroups = getNumFields();
        const groups = [];

        for (let i = 0; i < numFieldGroups; i++) {
            const displayName = `${metadata?.displayName[selectedLang]} ${
                i + 1
            }`;
            groups.push(<h3 key={displayName}>{displayName}</h3>);
            groups.push(generateSingleGroup(i));
        }

        return groups;
    };

    return (
        <div className="field-container">
            {generateAllGroups()}
            <Button className="field-group-button" onClick={onAddGroup}>
                {`${translations.components.fieldGroup.add} ${metadata?.displayName[selectedLang]}`}
            </Button>
        </div>
    );
});

FieldGroup.propTypes = {
    handleFileUpload: PropTypes.func.isRequired,
    handleFileDownload: PropTypes.func.isRequired,
    handleFileDelete: PropTypes.func.isRequired,
    stepKey: PropTypes.string,
    initValue: PropTypes.array.isRequired,
    patientId: PropTypes.string,
    metadata: PropTypes.object,
    isDisabled: PropTypes.bool.isRequired,
};

export default FieldGroup;
