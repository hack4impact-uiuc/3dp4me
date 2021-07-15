import './Sidebar.css';
import React from 'react';

import { LanguageDataType } from '../../utils/custom-proptypes';
import { useTranslations } from '../../hooks/useTranslations';

const Sidebar = ({ onClick, stepMetadata, onDownPressed, onUpPressed }) => {
    const selectedLang = useTranslations()[1];

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
                    {element.displayName[selectedLang]}
                </button>
                <button
                    type="button"
                    onClick={() => onDownPressed(element.key)}
                >
                    <i className="chevron down icon" />
                </button>
                <button type="button" onClick={() => onUpPressed(element.key)}>
                    <i className="chevron up icon" />
                </button>
            </div>
        );
    });
};

Sidebar.propTypes = {};

export default Sidebar;
