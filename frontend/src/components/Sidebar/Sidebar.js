import './Sidebar.scss';
import React from 'react';

import { LanguageDataType } from '../../utils/custom-proptypes';

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
            <div className="sidebar-button-container">
                <div
                    className="button main-button"
                    onClick={() => onButtonClick(element.key)}
                >
                    {element.displayName[key]}
                </div>
                <div
                    className="button order-button"
                    onClick={() => onDownPressed(element.key)}
                >
                    <i className="chevron down icon" />
                </div>
                <div
                    className="button order-button"
                    onClick={() => onUpPressed(element.key)}
                >
                    <i className="chevron up icon" />
                </div>
            </div>
        );
    });
};

Sidebar.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default Sidebar;
