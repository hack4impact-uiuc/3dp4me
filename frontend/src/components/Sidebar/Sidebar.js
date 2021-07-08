import './Sidebar.scss';
import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { LanguageDataType } from '../../utils/custom-proptypes';
import { Button } from '@material-ui/core';

const Sidebar = ({
    languageData,
    onClick,
    onAddField,
    onAddStep,
    stepMetadata,
    onDownPressed,
    onUpPressed,
    isEditing,
}) => {
    const key = languageData.selectedLanguage;

    function onButtonClick(stepKey) {
        onClick(stepKey);
    }

    const generateBottomButton = () => {
        if (!isEditing) return null;

        return (
            <Button className="edit-steps-button" onClick={onAddStep}>
                Add Step
            </Button>
        );
    };

    const generateReorderButtons = (stepKey) => {
        if (!isEditing) return null;

        return [
            <div
                className="button order-button"
                onClick={() => onAddField(stepKey)}
            >
                <i className="plus icon" />
            </div>,
            <div
                className="button order-button"
                onClick={() => onDownPressed(stepKey)}
            >
                <i className="chevron down icon" />
            </div>,
            <div
                className="button order-button"
                onClick={() => onUpPressed(stepKey)}
            >
                <i className="chevron up icon" />
            </div>,
        ];
    };

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
                    {generateReorderButtons(element.key)}
                </div>
            );
        });
    };

    return (
        <Drawer
            className={`sidebar ${
                isEditing ? 'sidebar-expanded' : 'sidebar-retracted'
            }`}
            variant="permanent"
        >
            <div className="sidebar-container">
                {generateButtons()}
                {generateBottomButton()}
            </div>
        </Drawer>
    );
};

Sidebar.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default Sidebar;
