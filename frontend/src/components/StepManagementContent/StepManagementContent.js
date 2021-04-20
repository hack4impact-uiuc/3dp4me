import './StepManagementContent.css';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import PropTypes from 'prop-types';

import { LanguageDataType, FieldsType } from '../../utils/custom-proptypes';

const StepManagementContent = ({
    languageData,
    fields,
    onDownPressed,
    onUpPressed,
    stepMetadata,
}) => {
    const key = languageData.selectedLanguage;

    function generateButtonInfo() {
        return stepMetadata.map((element) =>
            fields.map((field) => {
                return (
                    <div className="ui card">
                        <div className="content">
                            <div className="header">
                                {field.displayName[key]}
                            </div>
                            <div className="description">
                                Field Type: {field.fieldType}
                            </div>
                            <button type="button">
                                <i className="pencil alternate icon" />
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    onDownPressed(element.key, field.key)
                                }
                            >
                                <i className="chevron down icon" />
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    onUpPressed(element.key, field.key)
                                }
                            >
                                <i className="chevron up icon" />
                            </button>
                        </div>
                    </div>
                );
            }),
        );
    }

    return <div>{generateButtonInfo()}</div>;
};

StepManagementContent.propTypes = {
    languageData: LanguageDataType.isRequired,
    fields: FieldsType.isRequired,
    onDownPressed: PropTypes.any.isRequired,
    stepMetadata: PropTypes.any,
    onUpPressed: PropTypes.any.isRequired,
};

export default StepManagementContent;
