import React, { useEffect, useState } from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import CheckIcon from '@material-ui/icons/Check';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import './ToggleButtons.scss';

const ToggleButtons = (props) => {
    const lang = props.lang.data;
    const key = props.lang.key;

    const statusIcons = {
        unfinished: <PriorityHighIcon className="unfinished-icon" />,
        partial: <RadioButtonUncheckedIcon className="partial-icon" />,
        finished: <CheckIcon />
    }

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
        </div>
    );
}

export default ToggleButtons;