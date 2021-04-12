import './StepManagementContent.css';
import React, { useState, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';

import { LanguageDataType } from '../../utils/custom-proptypes';

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
                        <i className="pencil alternate icon"></i>
                    </div>
                </div>
            );
        });
    }

    return <div>{generateButtonInfo()}</div>;
};

StepManagementContent.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default StepManagementContent;
