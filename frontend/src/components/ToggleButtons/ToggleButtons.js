import React, { useEffect } from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import CheckIcon from '../../assets/check.svg';
import ExclamationIcon from '../../assets/exclamation.svg';
import HalfCircleIcon from '../../assets/half-circle.svg';
import { LanguageDataType } from '../../utils/custom-proptypes';
import './ToggleButtons.scss';

const ToggleButtons = ({
    languageData,
    handleStep,
    metaData,
    patientData,
    step,
}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const key = languageData.selectedLanguage;

    const statusIcons = {
        unfinished: (
            <img
                alt="incomplete"
                src={ExclamationIcon}
                className={`${key === 'AR' ? 'status-icon-ar' : 'status-icon'}`}
            />
        ),
        partial: (
            <img
                alt="partial"
                src={HalfCircleIcon}
                className={`${key === 'AR' ? 'status-icon-ar' : 'status-icon'}`}
            />
        ),
        finished: (
            <img
                alt="complete"
                src={CheckIcon}
                className={`${key === 'AR' ? 'status-icon-ar' : 'status-icon'}`}
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
            return (
                <ToggleButton
                    disableRipple
                    className={`toggle-button ${
                        step === element.key ? 'active' : ''
                    }`}
                    value={element.key}
                >
                    {patientData != null
                        ? statusIcons[patientData[element.key].status]
                        : null}{' '}
                    <b>{element.displayName[key]}</b>
                </ToggleButton>
            );
        });
    }

    function generateLabels() {
        if (metaData == null) return null;

        return metaData.map((element) => {
            return (
                <div className="toggle-button-selector">
                    {step === element.key ? (
                        <div className="current-step-label">
                            {patientData != null
                                ? statusIcons[patientData[element.key].status]
                                : null}{' '}
                            <b>{element.displayName[key]}</b>
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
                <MenuItem onClick={(e) => handleCloseSelector(e, element.key)}>
                    {patientData != null
                        ? statusIcons[patientData[element.key].status]
                        : null}{' '}
                    <b className="selector-text">{element.displayName[key]}</b>
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
    languageData: LanguageDataType.isRequired,
    handleStep: PropTypes.func.isRequired,
    step: PropTypes.string.isRequired,
    // TODO: Enfoce status enum options
    medStatus: PropTypes.string,
    processingStatus: PropTypes.string,
    modelStatus: PropTypes.string,
    printStatus: PropTypes.string,
    earScanStatus: PropTypes.string,
    deliveryStatus: PropTypes.string,
    feedbackStatus: PropTypes.string,
};

export default ToggleButtons;
