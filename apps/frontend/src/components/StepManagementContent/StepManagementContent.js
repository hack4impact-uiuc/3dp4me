import './StepManagementContent.scss';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import PropTypes from 'prop-types';

import RadioButtonField from '../Fields/RadioButtonField';
import { FIELD_TYPES, LANGUAGES } from '../../utils/constants';
import { useTranslations } from '../../hooks/useTranslations';
import { getJSONReferenceByStringPath } from '../../utils/utils';

const StepManagementContent = ({
    onDownPressed,
    onUpPressed,
    onEditField,
    onAddSubfield,
    stepMetadata,
    isEditing,
    allRoles,
}) => {
    const selectedLang = useTranslations()[1];
    const formatRoles = (roles) => {
        if (!roles?.length) return 'Admin';

        // Filters out all roles that aren't in roles
        const filteredRoles = allRoles.filter(
            (role) => roles.indexOf(role._id) >= 0,
        );

        // Concatenates roles into string separated by comma
        const roleString = filteredRoles.reduce(
            (prev, curr) => `${prev}, ${curr.Question?.[selectedLang]}`,
            '',
        );

        // Removes unnecessary comma at the beginning of roleString
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

    const renderEditButtons = (field, fieldRoot, fieldNumber, isSubField) => {
        if (!isEditing) return null;

        // Since subfields are rendered from left to right, their buttons will have to change.
        if (isSubField) {
            return (
                <div className="subfield-buttons">
                    <div className="reorder-subfield-buttons">
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
                            <i className="chevron left icon" />
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
                            <i className="chevron right icon" />
                        </div>
                    </div>
                    <div
                        className="edit-field-button"
                        onClick={() => onEditField(fieldRoot, fieldNumber)}
                    >
                        <i className="pencil alternate icon" />
                    </div>
                </div>
            );
        }

        return (
            <div className="field-buttons">
                <div
                    className="edit-field-button"
                    onClick={() => onEditField(fieldRoot, fieldNumber)}
                >
                    <i className="pencil alternate icon" />
                </div>

                <div className="reorder-field-buttons">
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

    function generateAddSubFieldButton(stepKey, root) {
        if (!isEditing) return null;
        return (
            <div
                onClick={() => onAddSubfield(stepKey, root)}
                className="add-subfield-button"
            >
                <i className="chevron add icon" />
            </div>
        );
    }

    function generateSubfieldInfo(field, fieldRoot, fieldNumber) {
        if (field.fieldType !== FIELD_TYPES.FIELD_GROUP) return null;

        const root = `${fieldRoot}[${getFieldIndexGivenFieldNumber(
            fieldRoot,
            fieldNumber,
        )}].subFields`;
        return (
            <div className="subfield-container">
                {generateButtonInfo(field.subFields, root, true)}
                {generateAddSubFieldButton(stepMetadata.key, root)}
            </div>
        );
    }

    function getFieldIndexGivenFieldNumber(fieldRoot, fieldNumber) {
        return getJSONReferenceByStringPath(stepMetadata, fieldRoot).findIndex(
            (field) => field.fieldNumber === fieldNumber,
        );
    }

    function getFieldClassName(field) {
        let fieldClassName = field.isHidden
            ? 'hidden-step-field-container'
            : 'step-field-container';

        // Handles case when the user has the language set to Arabic
        if (selectedLang === LANGUAGES.AR) {
            fieldClassName += ' ';
            if (isEditing) {
                fieldClassName += 'expanded-arabic-field-container';
            } else {
                fieldClassName += 'retracted-arabic-field-container';
            }
        }

        return fieldClassName;
    }

    function generateButtonInfo(fields, fieldRoot, isSubField) {
        if (!fields) return null;

        return fields.map((field) => {
            if (field.isDeleted) return null; // don't render fields when they are marked as deleted

            return (
                <div className={getFieldClassName(field)}>
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

                        {renderEditButtons(
                            field,
                            fieldRoot,
                            field.fieldNumber,
                            isSubField,
                        )}
                    </div>

                    {renderBottomSection(field)}
                </div>
            );
        });
    }

    return (
        <div className="content-container">
            {generateButtonInfo(stepMetadata?.fields, 'fields', false)}
        </div>
    );
};

StepManagementContent.propTypes = {
    isEditing: PropTypes.bool.isRequired,
    onDownPressed: PropTypes.func.isRequired,
    onEditField: PropTypes.func.isRequired,
    onAddSubfield: PropTypes.func.isRequired,
    stepMetadata: PropTypes.object,
    onUpPressed: PropTypes.func.isRequired,
    allRoles: PropTypes.array.isRequired,
};

export default StepManagementContent;