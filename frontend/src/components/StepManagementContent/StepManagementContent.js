import './StepManagementContent.css';
import React from 'react';
import 'semantic-ui-css/semantic.min.css';

import { LanguageDataType, FieldsType } from '../../utils/custom-proptypes';

const StepManagementContent = ({
    languageData,
    fields,
    onDownPressed,
    onUpPressed,
}) => {
    const key = languageData.selectedLanguage;

    function generateButtonInfo() {
        return fields.map((field, index) => {
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
                        <button onClick={() => onDownPressed(field.key)}>
                            <i className="chevron down icon"></i>
                        </button>
                        <button onClick={() => onUpPressed(field.key)}>
                            <i className="chevron up icon"></i>
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
