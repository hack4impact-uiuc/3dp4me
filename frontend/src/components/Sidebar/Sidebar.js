import './Sidebar.css';
import React from 'react';

import { LanguageDataType } from '../../utils/custom-proptypes';

const Sidebar = ({ languageData, onClick, stepMetadata }) => {
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
            </div>
        );
    });
};

Sidebar.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default Sidebar;
