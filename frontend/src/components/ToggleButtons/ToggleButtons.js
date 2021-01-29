import React from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import CheckIcon from '../../assets/check.svg';
import ExclamationIcon from '../../assets/exclamation.svg';
import HalfCircleIcon from '../../assets/half-circle.svg';
import { LanguageDataType } from '../../utils/custom-proptypes';
import './ToggleButtons.scss';

const ToggleButtons = ({
    languageData,
    handleStep,
    step,
    medStatus,
    processingStatus,
    id,
    modelStatus,
    printStatus,
    earScanStatus,
    deliveryStatus,
    feedbackStatus,
}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

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
            handleStep(e, newStep);
        }
    };

    return (
        <div className="toggle-buttons-wrapper">
            <ToggleButtonGroup
                className="toggle-button-group"
                size="large"
                exclusive
                value={step}
                onChange={handleStep}
            >
                <ToggleButton
                    disableRipple
                    className={`toggle-button ${
                        step === 'info' ? 'active' : ''
                    }`}
                    value="info"
                >
                    {medStatus !== undefined ? statusIcons[medStatus] : null}{' '}
                    <b>{lang.components.stepTabs.patientInfo}</b>
                </ToggleButton>
                <ToggleButton
                    disableRipple
                    className={`toggle-button ${
                        step === 'scan' ? 'active' : ''
                    }`}
                    value="scan"
                >
                    {earScanStatus !== undefined
                        ? statusIcons[earScanStatus]
                        : null}{' '}
                    <b>{lang.components.stepTabs.earScan}</b>
                </ToggleButton>
                <ToggleButton
                    disableRipple
                    className={`toggle-button ${
                        step === 'cad' ? 'active' : ''
                    }`}
                    value="cad"
                >
                    {modelStatus !== undefined
                        ? statusIcons[modelStatus]
                        : null}{' '}
                    <b>{lang.components.stepTabs.CADModeling}</b>
                </ToggleButton>
                <ToggleButton
                    disableRipple
                    className={`toggle-button ${
                        step === 'printing' ? 'active' : ''
                    }`}
                    value="printing"
                >
                    {printStatus !== undefined
                        ? statusIcons[printStatus]
                        : null}{' '}
                    <b>{lang.components.stepTabs.print}</b>
                </ToggleButton>
                <ToggleButton
                    disableRipple
                    className={`toggle-button ${
                        step === 'processing' ? 'active' : ''
                    }`}
                    value="processing"
                >
                    {processingStatus !== undefined
                        ? statusIcons[processingStatus]
                        : null}{' '}
                    <b>{lang.components.stepTabs.processing}</b>
                </ToggleButton>
                <ToggleButton
                    disableRipple
                    className={`toggle-button ${
                        step === 'delivery' ? 'active' : ''
                    }`}
                    value="delivery"
                >
                    {deliveryStatus !== undefined
                        ? statusIcons[deliveryStatus]
                        : null}{' '}
                    <b>{lang.components.stepTabs.delivery}</b>
                </ToggleButton>
                <ToggleButton
                    disableRipple
                    className={`toggle-button ${
                        step === 'feedback' ? 'active' : ''
                    }`}
                    value="feedback"
                >
                    {feedbackStatus !== undefined
                        ? statusIcons[feedbackStatus]
                        : null}{' '}
                    <b>{lang.components.stepTabs.feedback}</b>
                </ToggleButton>
            </ToggleButtonGroup>

            <div className="toggle-button-selector">
                {step === 'info' ? (
                    <div className="current-step-label">
                        {medStatus !== undefined
                            ? statusIcons[medStatus]
                            : null}
                        <b>{lang.components.stepTabs.patientInfo}</b>
                    </div>
                ) : null}
                {step === 'scan' ? (
                    <div className="current-step-label">
                        {earScanStatus !== undefined
                            ? statusIcons[earScanStatus]
                            : null}
                        <b>{lang.components.stepTabs.earScan}</b>
                    </div>
                ) : null}
                {step === 'cad' ? (
                    <div className="current-step-label">
                        {modelStatus !== undefined
                            ? statusIcons[modelStatus]
                            : null}
                        <b>{lang.components.stepTabs.CADModeling}</b>
                    </div>
                ) : null}
                {step === 'printing' ? (
                    <div className="current-step-label">
                        {printStatus !== undefined
                            ? statusIcons[printStatus]
                            : null}
                        <b>{lang.components.stepTabs.print}</b>
                    </div>
                ) : null}
                {step === 'processing' ? (
                    <div className="current-step-label">
                        {processingStatus !== undefined
                            ? statusIcons[processingStatus]
                            : null}
                        <b>{lang.components.stepTabs.processing}</b>
                    </div>
                ) : null}
                {step === 'delivery' ? (
                    <div className="current-step-label">
                        {deliveryStatus !== undefined
                            ? statusIcons[deliveryStatus]
                            : null}
                        <b>{lang.components.stepTabs.delivery}</b>
                    </div>
                ) : null}
                {step === 'feedback' ? (
                    <div className="current-step-label">
                        {feedbackStatus !== undefined
                            ? statusIcons[feedbackStatus]
                            : null}
                        <b>{lang.components.stepTabs.feedback}</b>
                    </div>
                ) : null}

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
                    <MenuItem onClick={(e) => handleCloseSelector(e, 'info')}>
                        {medStatus !== undefined
                            ? statusIcons[medStatus]
                            : null}
                        <b className="selector-text">
                            {lang.components.stepTabs.patientInfo}
                        </b>
                    </MenuItem>
                    <MenuItem onClick={(e) => handleCloseSelector(e, 'scan')}>
                        {earScanStatus !== undefined
                            ? statusIcons[earScanStatus]
                            : null}
                        <b className="selector-text">
                            {lang.components.stepTabs.earScan}
                        </b>
                    </MenuItem>
                    <MenuItem onClick={(e) => handleCloseSelector(e, 'cad')}>
                        {modelStatus !== undefined
                            ? statusIcons[modelStatus]
                            : null}
                        <b className="selector-text">
                            {lang.components.stepTabs.CADModeling}
                        </b>
                    </MenuItem>
                    <MenuItem
                        onClick={(e) => handleCloseSelector(e, 'printing')}
                    >
                        {printStatus !== undefined
                            ? statusIcons[printStatus]
                            : null}
                        <b className="selector-text">
                            {lang.components.stepTabs.print}
                        </b>
                    </MenuItem>
                    <MenuItem
                        onClick={(e) => handleCloseSelector(e, 'processing')}
                    >
                        {processingStatus !== undefined
                            ? statusIcons[processingStatus]
                            : null}
                        <b className="selector-text">
                            {lang.components.stepTabs.processing}
                        </b>
                    </MenuItem>
                    <MenuItem
                        onClick={(e) => handleCloseSelector(e, 'delivery')}
                    >
                        {deliveryStatus !== undefined
                            ? statusIcons[deliveryStatus]
                            : null}
                        <b className="selector-text">
                            {lang.components.stepTabs.delivery}
                        </b>
                    </MenuItem>
                    <MenuItem
                        onClick={(e) => handleCloseSelector(e, 'feedback')}
                    >
                        {feedbackStatus !== undefined
                            ? statusIcons[feedbackStatus]
                            : null}
                        <b className="selector-text">
                            {lang.components.stepTabs.feedback}
                        </b>
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
};

ToggleButton.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default ToggleButtons;
