import './Sidebar.css';
import React, { useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';

import { LanguageDataType } from '../../utils/custom-proptypes';
import { getAllStepsMetadata } from '../../utils/api';

const Sidebar = ({ languageData, onClick, stepMetadata }) => {
    const key = languageData.selectedLanguage;

    function onButtonClick(stepKey) {
        onClick(stepKey);
    }

    return stepMetadata.map((element) => {
        return (
            <div>
                <button
                    className="sidebar"
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
