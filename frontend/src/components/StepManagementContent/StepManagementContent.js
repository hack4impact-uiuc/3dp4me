import './StepManagementContent.css';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';

import { LanguageDataType, FieldsType } from '../../utils/custom-proptypes';

const StepManagementContent = ({ languageData, fields }) => {
    const key = languageData.selectedLanguage;

    function generateButtonInfo() {
        return fields.map((field) => {
            return (
                <div className="ui card">
                    <div className="content">
                        <div className="header">{field.displayName[key]}</div>
                        <div className="description">
                            Field Type: {field.fieldType}
                        </div>
                        <button type="button">
                            <i className="pencil alternate icon" />
                        </button>
                    </div>
                </div>
            );
        });
    }

    return <div>{generateButtonInfo()}</div>;
};

StepManagementContent.propTypes = {
    languageData: LanguageDataType.isRequired,
    fields: FieldsType.isRequired,
};

export default StepManagementContent;
