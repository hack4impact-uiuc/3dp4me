import './Sidebar.scss';
import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';

import { useTranslations } from '../../hooks/useTranslations';

const Sidebar = ({
    onClick,
    onAddField,
    onAddStep,
    stepMetadata,
    onDownPressed,
    onUpPressed,
    isEditing,
    selectedStep,
}) => {
    const selectedLang = useTranslations()[1];

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

    const generateReorderButtons = (stepKey, className) => {
        if (!isEditing) return null;

        return [
            <div
                className={`button order-button ${className}`}
                onClick={() => onAddField(stepKey)}
            >
                <i className="plus icon" />
            </div>,
            <div
                className={`button order-button ${className}`}
                onClick={() => onDownPressed(stepKey)}
            >
                <i className="chevron down icon" />
            </div>,
            <div
                className={`button order-button ${className}`}
                onClick={() => onUpPressed(stepKey)}
            >
                <i className="chevron up icon" />
            </div>,
        ];
    };

    const getButtonClassname = (stepKey, isHidden) => {
        if (selectedStep == stepKey)
            return 'selected'
        return isHidden ? 'hidden' : 'unselected';
    }

    const generateButtons = () => {


        return stepMetadata.map((element) => {
            return (
                <div className="sidebar-button-container">
                    <div
                        className={`button main-button ${getButtonClassname(element.key, element.isHidden || false)}`}
                        onClick={() => onButtonClick(element.key)}
                    >
                        {element.displayName[selectedLang]}
                    </div>
                    {generateReorderButtons(element.key, getButtonClassname(element.key, element.isHidden || false))}
                </div>
            );
        });
    };

    return (
        <Drawer
            className={`sidebar ${isEditing ? 'sidebar-expanded' : 'sidebar-retracted'
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
