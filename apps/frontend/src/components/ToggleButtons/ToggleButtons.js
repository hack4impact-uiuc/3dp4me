import React from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';

import {
    LANGUAGES,
    STEP_STATUS,
    RESIZE_TOGGLE_BUTTON_ESTIMATED_WIDTH,
} from '../../utils/constants';
import CheckIcon from '../../assets/check.svg';
import ExclamationIcon from '../../assets/exclamation.svg';
import HalfCircleIcon from '../../assets/half-circle.svg';
import './ToggleButtons.scss';
import { useTranslations } from '../../hooks/useTranslations';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';

const ToggleButtons = ({ handleStep, metaData, patientData, step }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const selectedLang = useTranslations()[1];
    const { width } = useWindowDimensions();

    const statusIcons = {
        [STEP_STATUS.UNFINISHED]: (
            <img
                alt="incomplete"
                src={ExclamationIcon}
                className={`${
                    selectedLang === LANGUAGES.AR
                        ? 'status-icon-ar'
                        : 'status-icon'
                }`}
            />
        ),
        [STEP_STATUS.PARTIALLY_FINISHED]: (
            <img
                alt="partial"
                src={HalfCircleIcon}
                className={`${
                    selectedLang === LANGUAGES.AR
                        ? 'status-icon-ar'
                        : 'status-icon'
                }`}
            />
        ),
        [STEP_STATUS.FINISHED]: (
            <img
                alt="complete"
                src={CheckIcon}
                className={`${
                    selectedLang === LANGUAGES.AR
                        ? 'status-icon-ar'
                        : 'status-icon'
                }`}
            />
        ),
    };

    const handleClickSelector = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleCloseSelector = (e, newStep) => {
        setAnchorEl(null);
        if (newStep !== 'close') {
            handleStep(newStep);
        }
    };

    function generateToggleButtons() {
        if (metaData == null) return null;

        return metaData.map((element) => {
            let status = null;
            if (patientData)
                status =
                    patientData[element.key]?.status ?? STEP_STATUS.UNFINISHED;

            return (
                <ToggleButton
                    disableRipple
                    key={`${element.key}-tb`}
                    className={`toggle-button ${
                        step === element.key ? 'active' : ''
                    }`}
                    value={element.key}
                >
                    {patientData ? statusIcons[status] : null}{' '}
                    <b>{element.displayName[selectedLang]}</b>
                </ToggleButton>
            );
        });
    }

    function generateSelectedStepLabel() {
        if (metaData == null) return null;

        const selectedStepIndex = metaData.findIndex(
            (element) => element.key === step,
        );

        if (selectedStepIndex === -1) return null;

        const element = metaData[selectedStepIndex];

        return (
            <div className="current-step-label">
                {patientData && patientData[step]?.status
                    ? statusIcons[patientData[step].status]
                    : null}{' '}
                <b>{element.displayName[selectedLang]}</b>
            </div>
        );
    }

    function generateMenuItems() {
        if (metaData == null) return null;

        return metaData.map((element) => {
            return (
                <MenuItem
                    key={`${element.key}-mi`}
                    onClick={(e) => handleCloseSelector(e, element.key)}
                >
                    {patientData && patientData[element.key]?.status
                        ? statusIcons[patientData[element.key].status]
                        : null}{' '}
                    <b className="selector-text">
                        {element.displayName[selectedLang]}
                    </b>
                </MenuItem>
            );
        });
    }

    /*  To determine whether to show the dropdown or tabs,
        we must check if the tabs would run off the screen.
        We use an overestimated value of 170px width per tab,
        and check if that exceeds the width of the screen.
        If so, we must show a dropdown.
    */
    if (
        metaData &&
        width < RESIZE_TOGGLE_BUTTON_ESTIMATED_WIDTH * metaData.length
    ) {
        return (
            <div className="toggle-buttons-wrapper-dropdown">
                <div className="toggle-button-selector-dropdown">
                    {generateSelectedStepLabel()}
                    <IconButton
                        aria-controls="customized-menu"
                        aria-haspopup="true"
                        onClick={handleClickSelector}
                        className="dropdown-icon"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                    <Menu
                        className="stage-selector-menu-dropdown"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={(e) => handleCloseSelector(e, 'close')}
                    >
                        {generateMenuItems()}
                    </Menu>
                </div>
            </div>
        );
    }

    return (
        <div className="toggle-buttons-wrapper">
            <ToggleButtonGroup
                className="toggle-button-group"
                size="large"
                exclusive
                value={step}
                onChange={(e, newStep) => handleStep(newStep)}
            >
                {generateToggleButtons()}
            </ToggleButtonGroup>
        </div>
    );
};

ToggleButtons.propTypes = {
    handleStep: PropTypes.func.isRequired,
    step: PropTypes.string.isRequired,
    metaData: PropTypes.arrayOf(PropTypes.object),
    patientData: PropTypes.object,
};

export default ToggleButtons;