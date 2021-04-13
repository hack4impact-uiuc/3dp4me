import './StepManagementContent.css';
import React, { useState, useEffect, Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Form, Checkbox } from 'semantic-ui-react';

import { LanguageDataType } from '../../utils/custom-proptypes';

const StepManagementContent = ({ languageData, fields }) => {
    const key = languageData.selectedLanguage;

    function generateButtonInfo() {
        return fields.map((field) => {
            console.log(fields);
            return (
                <div className="ui card">
                    <div className="content">
                        <div className="header">{field.displayName[key]}</div>
                        <div className="description">
                            Field Type: {field.fieldType}
                        </div>
                        <button class="ui button">
                            <i class="pencil alternate icon"></i>
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
};

export default StepManagementContent;
