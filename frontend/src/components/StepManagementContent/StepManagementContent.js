import './StepManagementContent.scss';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import PropTypes from 'prop-types';

import RadioButtonField from '../Fields/RadioButtonField';
import { FIELD_TYPES } from '../../utils/constants';
import { useTranslations } from '../../hooks/useTranslations';

const StepManagementContent = ({
    onDownPressed,
    onUpPressed,
    onEditField,
    stepMetadata,
    isEditing,
    allRoles,
}) => {
    const selectedLang = useTranslations()[1];
    const formatRoles = (array) => {
        if (!array?.length) return 'Admin';

        const filteredRoles = allRoles.filter(
            (role) => array.indexOf(role._id) >= 0,
        );

        const roleString = filteredRoles.reduce(
            (prev, curr) => `${prev  }, ${  curr.Question?.[selectedLang]}`,
            '',
        );

        return roleString.substring(2, roleString.length);
    };

    const renderBottomSection = (field) => {
        switch (field?.fieldType) {
            case FIELD_TYPES.RADIO_BUTTON:
                return (
                    <div className="bottom-container">
                        <RadioButtonField
                            fieldId={field?.key}
                            langKey={selectedLang}
                            options={field?.options}
                            isDisabled
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const renderEditButtons = (field, fieldRoot, fieldNumber) => {
        if (!isEditing) return null;

        return (
            <div className="buttons">
                <div
                    className="edit-field-button"
                    onClick={() => onEditField(stepMetadata.key, selectedLang)}
                >
                    <i className="pencil alternate icon" />
                </div>

                <div className="reorder-buttons">
                    <div
                        onClick={() =>
                            onUpPressed(
                                stepMetadata.key,
                                fieldRoot,
                                fieldNumber,
                            )
                        }
                        className="up-button"
                    >
                        <i className="chevron up icon" />
                    </div>
                    <div
                        onClick={() =>
                            onDownPressed(
                                stepMetadata.key,
                                fieldRoot,
                                fieldNumber,
                            )
                        }
                        className="down-button"
                    >
                        <i className="chevron down icon" />
                    </div>
                </div>
            </div>
        );
    };

    function generateSubfieldInfo(field, fieldRoot, fieldNumber) {
        if (!field?.subFields?.length) return null;

        const root = `${fieldRoot}[fieldNumber===${fieldNumber}].subFields`;
        return (
            <div className="subfield-container">
                {generateButtonInfo(field.subFields, root)}
            </div>
        );
    }

    function generateButtonInfo(fields, fieldRoot) {
        if (!fields) return null;

        return fields.map((field) => {
            return (
                <div className="step-field-container">
                    <div className="content">
                        <div className="info">
                            <div className="header">
                                {field.displayName[selectedLang]}
                            </div>
                            <div className="description">
                                Field Type: {field.fieldType}
                            </div>
                            <div className="description">
                                Readable Roles:{' '}
                                {formatRoles(field.readableGroups)}
                            </div>
                            <div className="description">
                                Writable Roles:{' '}
                                {formatRoles(field.writableGroups)}
                            </div>

                            {generateSubfieldInfo(
                                field,
                                fieldRoot,
                                field.fieldNumber,
                            )}
                        </div>

                        {renderEditButtons(field, fieldRoot, field.fieldNumber)}
                    </div>

                    {renderBottomSection(field)}
                </div>
            );
        });
    }

    return (
        <div className="content-container">
            {generateButtonInfo(stepMetadata?.fields, 'fields')}
        </div>
    );
};

StepManagementContent.propTypes = {
    isEditing: PropTypes.bool.isRequired,
    onDownPressed: PropTypes.func.isRequired,
    onEditField: PropTypes.func.isRequired,
    stepMetadata: PropTypes.object,
    onUpPressed: PropTypes.func.isRequired,
    allRoles: PropTypes.array.isRequired,
};

export default StepManagementContent;
