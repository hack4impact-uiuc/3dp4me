import './Sidebar.scss';
import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { LanguageDataType } from '../../utils/custom-proptypes';
import { Button } from '@material-ui/core';

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

    const generateButtons = () => {
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

    return (
        <Drawer className="sidebar" variant="permanent">
            <div className="sidebar-container">
                {generateButtons()}
                <Button className="edit-steps-button">Edit Steps</Button>
            </div>
        </Drawer>
    );
};

Sidebar.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default Sidebar;
