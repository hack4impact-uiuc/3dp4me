import './Sidebar.scss';
import React from 'react';
import { Button, Drawer, AppBar, Toolbar } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { useTranslations } from '../../hooks/useTranslations';

const useStyles = makeStyles({
    paper: {
        background: '#dddef2',
    }
});

const Sidebar = ({
    onClick,
    onAddStep,
    onEditStep,
    stepMetadata,
    onDownPressed,
    onUpPressed,
    isEditing,
    selectedStep,
}) => {
    const selectedLang = useTranslations()[1];
    const styles = useStyles();

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
            <div className={`button order-button ${className}`} onClick={() => onEditStep(stepKey)}>
                <i className="pencil alternate icon" />
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
            // Don't render deleted steps
            if (element.isDeleted) {
                return null;
            }

            const buttonClassName = getButtonClassname(element.key, element.isHidden || false);

            return (
                <div className="sidebar-button-container">
                    <div
                        className={`button main-button ${buttonClassName}`}
                        onClick={() => onButtonClick(element.key)}
                    >
                        {element.displayName[selectedLang]}
                    </div>
                    {generateReorderButtons(element.key, buttonClassName)}
                </div>
            );
        });
    };

    return (
        <Drawer
            className={`sidebar ${isEditing ? 'sidebar-expanded' : 'sidebar-retracted'
                }`}
            variant="permanent"
            classes={{ paper: styles.paper }}
        >
            <div className="sidebar-container">
                {generateButtons()}
            </div>
            <AppBar
                className={`side-bottom-bar-wrapper ${isEditing ? 'side-bottom-bar-expanded' : 'side-bottom-bar-retracted'
                    }`}
                color="inherit"
                style={{
                    top: 'auto',
                    bottom: '0',
                    boxShadow: '0 0px 4px 2px rgba(0, 0, 0, 0.15)',
                    zIndex: '100',
                }}
            >
                <Toolbar className="side-bottom-bar-toolbar">
                    {generateBottomButton()}
                </Toolbar>
            </AppBar>
        </Drawer>
    );
};

Sidebar.propTypes = {
    onClick: PropTypes.func.isRequired,
    onUpPressed: PropTypes.func.isRequired,
    onDownPressed: PropTypes.func.isRequired,
    onAddStep: PropTypes.func.isRequired,
    onEditStep: PropTypes.func.isRequired,
    stepMetadata: PropTypes.array,
    isEditing: PropTypes.bool.isRequired,
    selectedStep: PropTypes.string.isRequired,
};

export default Sidebar;
