import './Sidebar.scss';
import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';

import { LanguageDataType } from '../../utils/custom-proptypes';

const Sidebar = ({
    languageData,
    onClick,
    onAddField,
    onAddStep,
    stepMetadata,
    onDownPressed,
    onUpPressed,
    isEditing,
    selectedStep,
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
                className={`button order-button ${
                    stepKey === selectedStep ? 'selected' : 'unselected'
                }`}
                onClick={() => onAddField(stepKey)}
            >
                <i className="plus icon" />
            </div>,
            <div
                className={`button order-button ${
                    stepKey === selectedStep ? 'selected' : 'unselected'
                }`}
                onClick={() => onDownPressed(stepKey)}
            >
                <i className="chevron down icon" />
            </div>,
            <div
                className={`button order-button ${
                    stepKey === selectedStep ? 'selected' : 'unselected'
                }`}
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
                        className={`button main-button ${
                            element.key === selectedStep
                                ? 'selected'
                                : 'unselected'
                        }`}
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
    onClick: PropTypes.func.isRequired,
    onAddField: PropTypes.func.isRequired,
    onUpPressed: PropTypes.func.isRequired,
    onDownPressed: PropTypes.func.isRequired,
    onAddStep: PropTypes.func.isRequired,
    stepMetadata: PropTypes.object,
    isEditing: PropTypes.bool.isRequired,
    selectedStep: PropTypes.string.isRequired,
};

export default Sidebar;
