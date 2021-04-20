import './Sidebar.css';
import React from 'react';

import { LanguageDataType } from '../../utils/custom-proptypes';
import StepManagementContent from '../StepManagementContent/StepManagementContent';
import _ from 'lodash';

const Sidebar = ({
    languageData,
    onClick,
    stepMetadata,
    onDownPressed,
    onUpPressed,
}) => {
    const key = languageData.selectedLanguage;

    function onButtonClick(stepKey) {
        onClick(stepKey);
    }

    return stepMetadata.map((element) => {
        return (
            <div>
                <button
                    type="button"
                    onClick={() => onButtonClick(element.key)}
                >
                    {element.displayName[key]}
                </button>
                <button onClick={() => onDownPressed(element.key)}>
                    <i className="chevron down icon"></i>
                </button>
                <button onClick={() => onUpPressed(element.key)}>
                    <i className="chevron up icon"></i>
                </button>
            </div>
        );
    });
};

Sidebar.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default Sidebar;
