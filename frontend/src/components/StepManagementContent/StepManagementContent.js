import './StepManagementContent.scss';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import PropTypes from 'prop-types';
import RadioButtonField from '../Fields/RadioButtonField';
import { LanguageDataType, FieldsType } from '../../utils/custom-proptypes';
import { FIELD_TYPES } from '../../utils/constants';

const StepManagementContent = ({
    languageData,
    onDownPressed,
    onUpPressed,
    onEditField,
    onAddField,
    stepMetadata,
    isEditing,
}) => {
    const key = languageData.selectedLanguage;

    const formatRoles = (array) => {
        if (!array?.length) return 'Admin';

        // TODO: Display role names
        return array;
    };

    const renderBottomSection = (field) => {
        switch (field?.fieldType) {
            case FIELD_TYPES.RADIO_BUTTON:
                return (
                    <div className="bottom-container">
                        <RadioButtonField
                            fieldId={field?.key}
                            langKey={key}
                            options={field?.options}
                            isDisabled={true}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const renderEditButtons = (field, fieldRoot, fieldNumber) => {
        if (!isEditing) return null;

        // This is just some notation we defined to allow us to specify array fields... see resolveMixedObjPath
        //const key = `${fieldPath}[x['key']==='${field.key}']`;
        //const root = `${fieldRoot}[x['fieldNumber']===${fieldNumber}].subFields`;

        return (
            <div className="buttons">
                <div
                    className="edit-field-button"
                    onClick={() => onEditField(stepMetadata.key, key)}
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

        const root = `${fieldRoot}[x['fieldNumber']===${fieldNumber}].subFields`;
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
                                {field.displayName[key]}
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
    languageData: LanguageDataType.isRequired,
    fields: FieldsType.isRequired,
    onDownPressed: PropTypes.func.isRequired,
    stepMetadata: PropTypes.object,
    onUpPressed: PropTypes.func.isRequired,
};

export default StepManagementContent;
