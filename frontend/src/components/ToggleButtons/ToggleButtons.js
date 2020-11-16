import React, { useEffect, useState } from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import CheckIcon from '@material-ui/icons/Check';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './ToggleButtons.scss';

const ToggleButtons = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const lang = props.lang.data;
    const key = props.lang.key;

    const statusIcons = {
        unfinished: <PriorityHighIcon className="unfinished-icon" />,
        partial: <RadioButtonUncheckedIcon className="partial-icon" />,
        finished: <CheckIcon />
    }

    const handleClickSelector = (e) => {
        setAnchorEl(e.currentTarget);
    };
    
    const handleCloseSelector = (e, newStep) => {
        setAnchorEl(null);
        if (newStep !== "close") {
            props.handleStep(e, newStep);
        }
    };

    return (
        <div className="toggle-buttons-wrapper">
            <ToggleButtonGroup className="toggle-button-group" size="large" exclusive value={props.step} onChange={props.handleStep}>
                <ToggleButton
                    disableRipple
                    className={`toggle-button
                        ${props.step === "info" ? "active" : ""}`
                    }
                    value="info"
                >
                    {props.medStatus !== undefined ? statusIcons[props.medStatus] : null} <b>{lang[key].components.stepTabs.patientInfo}</b>
                </ToggleButton>
                <ToggleButton
                    disableRipple
                    className={`toggle-button
                        ${props.step === "scan" ? "active" : ""}`
                    }
                    value="scan"
                >
                    {props.earScanStatus !== undefined ? statusIcons[props.earScanStatus] : null} <b>{lang[key].components.stepTabs.earScan}</b>
                </ToggleButton>
                <ToggleButton
                    disableRipple
                    className={`toggle-button
                        ${props.step === "cad" ? "active" : ""}`
                    }
                    value="cad"
                >
                    {props.modelStatus !== undefined ? statusIcons[props.modelStatus] : null} <b>{lang[key].components.stepTabs.CADModeling}</b>
                </ToggleButton>
                <ToggleButton
                    disableRipple
                    className={`toggle-button
                        ${props.step === "printing" ? "active" : ""}`
                    }
                    value="printing"
                >
                    {props.printStatus !== undefined ? statusIcons[props.printStatus] : null} <b>{lang[key].components.stepTabs.print}</b>
                </ToggleButton>
                <ToggleButton
                    disableRipple
                    className={`toggle-button
                        ${props.step === "processing" ? "active" : ""}`
                    }
                    value="processing"
                >
                    {props.processingStatus !== undefined ? statusIcons[props.processingStatus] : null} <b>{lang[key].components.stepTabs.processing}</b>
                </ToggleButton>
                <ToggleButton
                    disableRipple
                    className={`toggle-button
                        ${props.step === "delivery" ? "active" : ""}`
                    }
                    value="delivery"
                >
                    {props.deliveryStatus !== undefined ? statusIcons[props.deliveryStatus] : null} <b>{lang[key].components.stepTabs.delivery}</b>
                </ToggleButton>
                <ToggleButton
                    disableRipple
                    className={`toggle-button
                        ${props.step === "feedback" ? "active" : ""}`
                    }
                    value="feedback"
                >
                    {props.feedbackStatus !== undefined ? statusIcons[props.feedbackStatus] : null} <b>{lang[key].components.stepTabs.feedback}</b>
                </ToggleButton>
            </ToggleButtonGroup>
            
            <div className="toggle-button-selector">
                {props.step === "info" ? 
                    <div className="current-step-label">
                        {props.medStatus !== undefined ? statusIcons[props.medStatus] : null}
                        <b>{lang[key].components.stepTabs.patientInfo}</b>
                    </div> :
                    null
                }
                {props.step === "scan" ? 
                    <div className="current-step-label">
                        {props.earScanStatus !== undefined ? statusIcons[props.earScanStatus] : null}
                        <b>{lang[key].components.stepTabs.earScan}</b>
                    </div> :
                    null
                }
                {props.step === "cad" ? 
                    <div className="current-step-label">
                        {props.modelStatus !== undefined ? statusIcons[props.modelStatus] : null}
                        <b>{lang[key].components.stepTabs.CADModeling}</b>
                    </div> :
                    null
                }
                {props.step === "printing" ? 
                    <div className="current-step-label">
                        {props.printStatus !== undefined ? statusIcons[props.printStatus] : null}
                        <b>{lang[key].components.stepTabs.print}</b>
                    </div> :
                    null
                }
                {props.step === "processing" ? 
                    <div className="current-step-label">
                        {props.processingStatus !== undefined ? statusIcons[props.processingStatus] : null}
                        <b>{lang[key].components.stepTabs.processing}</b>
                    </div> :
                    null
                }
                {props.step === "delivery" ? 
                    <div className="current-step-label">
                        {props.deliveryStatus !== undefined ? statusIcons[props.deliveryStatus] : null}
                        <b>{lang[key].components.stepTabs.delivery}</b>
                    </div> :
                    null
                }
                {props.step === "feedback" ? 
                    <div className="current-step-label">
                        {props.feedbackStatus !== undefined ? statusIcons[props.feedbackStatus] : null}
                        <b>{lang[key].components.stepTabs.feedback}</b>
                    </div> :
                    null
                }

                <IconButton aria-controls="customized-menu" aria-haspopup="true" onClick={handleClickSelector}>
                    <ExpandMoreIcon />
                </IconButton>
                <Menu className="stage-selector-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={e => handleCloseSelector(e, "close")}>
                    <MenuItem onClick={e => handleCloseSelector(e, "info")}>
                        {props.medStatus !== undefined ? statusIcons[props.medStatus] : null}
                        <b>{lang[key].components.stepTabs.patientInfo}</b>
                    </MenuItem>
                    <MenuItem onClick={e => handleCloseSelector(e, "scan")}>
                        {props.earScanStatus !== undefined ? statusIcons[props.earScanStatus] : null}
                        <b>{lang[key].components.stepTabs.earScan}</b>
                    </MenuItem>
                    <MenuItem onClick={e => handleCloseSelector(e, "cad")}>
                        {props.modelStatus !== undefined ? statusIcons[props.modelStatus] : null}
                        <b>{lang[key].components.stepTabs.CADModeling}</b>
                    </MenuItem>
                    <MenuItem onClick={e => handleCloseSelector(e, "printing")}>
                        {props.printStatus !== undefined ? statusIcons[props.printStatus] : null}
                        <b>{lang[key].components.stepTabs.print}</b>
                    </MenuItem>
                    <MenuItem onClick={e => handleCloseSelector(e, "processing")}>
                        {props.processingStatus !== undefined ? statusIcons[props.processingStatus] : null}
                        <b>{lang[key].components.stepTabs.processing}</b>
                    </MenuItem>
                    <MenuItem onClick={e => handleCloseSelector(e, "delivery")}>
                        {props.deliveryStatus !== undefined ? statusIcons[props.deliveryStatus] : null}
                        <b>{lang[key].components.stepTabs.delivery}</b>
                    </MenuItem>
                    <MenuItem onClick={e => handleCloseSelector(e, "feedback")}>
                        {props.feedbackStatus !== undefined ? statusIcons[props.feedbackStatus] : null}
                        <b>{lang[key].components.stepTabs.feedback}</b>
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
}

export default ToggleButtons;