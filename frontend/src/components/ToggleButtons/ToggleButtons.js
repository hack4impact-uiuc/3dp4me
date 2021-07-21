import React from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';

import { LANGUAGES, STEP_STATUS } from '../../utils/constants';
import CheckIcon from '../../assets/check.svg';
import ExclamationIcon from '../../assets/exclamation.svg';
import HalfCircleIcon from '../../assets/half-circle.svg';
import './ToggleButtons.scss';
import { useTranslations } from '../../hooks/useTranslations';

const ToggleButtons = ({ handleStep, metaData, patientData, step }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const selectedLang = useTranslations()[1];

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

    function generateLabels() {
        if (metaData == null) return null;

        return metaData.map((element) => {
            return (
                <div
                    className="toggle-button-selector"
                    key={`${element.key}-label`}
                >
                    {step === element.key ? (
                        <div className="current-step-label">
                            {patientData && patientData[element.key]?.status
                                ? statusIcons[patientData[element.key].status]
                                : null}{' '}
                            <b>{element.displayName[selectedLang]}</b>
                        </div>
                    ) : null}
                </div>
            );
        });
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

            <div className="toggle-button-selector">
                {generateLabels()}
                <IconButton
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    onClick={handleClickSelector}
                >
                    <ExpandMoreIcon />
                </IconButton>
                <Menu
                    className="stage-selector-menu"
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
};

ToggleButtons.propTypes = {
    handleStep: PropTypes.func.isRequired,
    step: PropTypes.string.isRequired,
    metaData: PropTypes.arrayOf(PropTypes.object),
    patientData: PropTypes.object,
};

export default ToggleButtons;
