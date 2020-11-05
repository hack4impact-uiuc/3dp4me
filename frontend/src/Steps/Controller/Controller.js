import React, { useEffect, useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './Controller.scss';
import MedicalInfo from '../MedicalInfo/MedicalInfo';
import EarScan from '../EarScan/EarScan';
import CADModel from '../CADModel/CADModel';
import Printing from '../3DPrinting/Printing';
import PostProcessing from '../PostProcessing/PostProcessing'
import Delivery from '../Delivery/Delivery';
import Feedback from '../Feedback/Feedback';
import { Accordion, AccordionDetails, AccordionSummary, TextField } from '@material-ui/core';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import patientFile from '../../Test Data/patient.json'

const theme = createMuiTheme({
    direction: 'rtl',
});

const Controller = (props) => {
    const [expanded, setExpanded] = useState(false);
    const [patient, setPatient] = useState();
    const [step, setStep] = useState("info");
    const [medStatus, setMedStatus] = useState("unfinished");
    const [earScanStatus, setEarScanStatus] = useState("unfinished");
    const [modelStatus, setModelStatus] = useState("unfinished");
    const [printStatus, setPrintStatus] = useState("unfinished");
    const [processingStatus, setProcessingStatus] = useState("unfinished");
    const [deliveryStatus, setDeliveryStatus] = useState("unfinished");
    const [feedbackStatus, setFeedbackStatus] = useState("unfinished");

    const lang = props.lang.data;
    const key = props.lang.key;

    const handleNotePanel = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleStep = (event, newStep) => {
        if (newStep !== null) {
            setStep(newStep);
            if (newStep === "info") {
                setPatient([])
                console.log("here")
            } else if (newStep === "scan") {
                setPatient([])
            } else if (newStep === "cad") {
                setPatient([])
            } else if (newStep === "printing") {
                setPatient([])
            } else if (newStep === "processing") {
                setPatient([])
            } else if (newStep === "delivery") {
                setPatient([])
            } else if (newStep === "feedback") {
                setPatient([])
            }
        }
    };

    const handleMedStatus = (e) => {
       if (e.target.value === "unfinished" || e.target.value  === "partial" || e.target.value  === "finished") setMedStatus(e.target.value);
    }
    const handleEarScanStatus = (e) => {
       if (e.target.value  === "unfinished" || e.target.value  === "partial" || e.target.value  === "finished") setEarScanStatus(e.target.value);
    }
    const handleModelStatus = (e) => {
        if (e.target.value  === "unfinished" || e.target.value  === "partial" || e.target.value  == "finished") setModelStatus(e.target.value);
    }
    const handlePrintStatus = (e) => {
        if (e.target.value  === "unfinished" || e.target.value  === "partial" || e.target.value  == "finished") setPrintStatus(e.target.value);
    }
    const handleProcessingStatus = (e) => {
        if (e.target.value  === "unfinished" || e.target.value  === "partial" || e.target.value  == "finished") setProcessingStatus(e.target.value);
    }
    const handleDeliveryStatus = (e) => {
        if (e.target.value  === "unfinished" || e.target.value  === "partial" || e.target.value  == "finished") setDeliveryStatus(e.target.value);
    }
    const handleFeedbackStatus = (e) => {
        if (e.target.value  === "unfinished" || e.target.value  === "partial" || e.target.value  == "finished") setFeedbackStatus(e.target.value);
    }

    const statusIcons = {
        unfinished: <PriorityHighIcon className="unfinished-icon" />,
        partial: <RadioButtonUncheckedIcon className="partial-icon" />,
        finished: <CheckIcon />
    }

    return (
        <div className="root">
            <ThemeProvider theme={key === "AR" ? theme : null}>
                <Drawer
                    className={key == "EN" ? "drawer" : "drawer-rtl"}
                    variant="permanent"
                    classes={{
                        paper: "drawer-paper",
                    }}
                >
                    <Toolbar />
                    <div className="drawer-container">
                        <div className="drawer-text-section">
                            <span className="drawer-text-label">{lang[key].components.sidebar.name}</span> <br />
                            <span className="drawer-text">{patientFile.patientInfo.name}</span>
                        </div>
                        <div className="drawer-text-section">
                            <span className="drawer-text-label">{lang[key].components.sidebar.orderID}</span> <br />
                            <span className="drawer-text">{patientFile.patientInfo.orderId}</span>
                        </div>
                        <div className="drawer-text-section">
                            <span className="drawer-text-label">{lang[key].components.sidebar.dob}</span> <br />
                            <span className="drawer-text">{patientFile.patientInfo.dob}</span>
                        </div>
                        <span className="drawer-text-label">{lang[key].components.notes.title}</span>
                        <div className="drawer-notes-wrapper">
                            <Accordion expanded={expanded === 'info'} onChange={handleNotePanel('info')}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon className="expand-icon" />}>{lang[key].components.stepTabs.patientInfo}</AccordionSummary>
                                <AccordionDetails>
                                    This is where the notes will go
                                </AccordionDetails>
                            </Accordion>
                            <Accordion expanded={expanded === 'scan'} onChange={handleNotePanel('scan')}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon className="expand-icon" />}>{lang[key].components.stepTabs.earScan}</AccordionSummary>
                                <AccordionDetails>
                                    This is where the notes will go
                                    </AccordionDetails>
                            </Accordion>
                            <Accordion expanded={expanded === 'cad'} onChange={handleNotePanel('cad')}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon className="expand-icon" />}>{lang[key].components.stepTabs.CADModeling}</AccordionSummary>
                                <AccordionDetails>
                                    This is where the notes will go
                                    </AccordionDetails>
                            </Accordion>
                            <Accordion expanded={expanded === 'processing'} onChange={handleNotePanel('processing')}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon className="expand-icon" />}>{lang[key].components.stepTabs.print}</AccordionSummary>
                                <AccordionDetails>
                                    This is where the notes will go
                                    </AccordionDetails>
                            </Accordion>
                            <Accordion expanded={expanded === 'delivery'} onChange={handleNotePanel('delivery')}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon className="expand-icon" />}>{lang[key].components.stepTabs.delivery}</AccordionSummary>
                                <AccordionDetails>
                                    This is where the notes will go
                                    </AccordionDetails>
                            </Accordion>
                            <Accordion expanded={expanded === 'feedback'} onChange={handleNotePanel('feedback')}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon className="expand-icon" />}>{lang[key].components.stepTabs.feedback}</AccordionSummary>
                                <AccordionDetails>
                                    This is where the notes will go
                                    </AccordionDetails>
                            </Accordion>
                        </div>

                    </div>
                </Drawer>
            </ThemeProvider>

            <div className={`controller-content ${key === "AR" ? "controller-content-ar" : ""}`}>
                <ToggleButtonGroup className="controller-content-header" size="large" exclusive value={step} onChange={handleStep}>
                    <ToggleButton
                        disableRipple
                        className={`controller-button default-button
                            ${medStatus !== undefined ? `${medStatus}` : ""}
                            ${step === "info" ? "active" : ""}`
                        }
                        value="info"
                    >
                        {medStatus !== undefined ? statusIcons[medStatus] : null} <b>{lang[key].components.stepTabs.patientInfo}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        className={`controller-button default-button
                            ${earScanStatus !== undefined ? `${earScanStatus}` : ""}
                            ${step === "scan" ? "active" : ""}`
                        }
                        value="scan"
                    >
                        {earScanStatus !== undefined ? statusIcons[earScanStatus] : null} <b>{lang[key].components.stepTabs.earScan}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        className={`controller-button default-button
                            ${modelStatus !== undefined ? `${modelStatus}` : ""}
                            ${step === "cad" ? "active" : ""}`
                        }
                        value="cad"
                    >
                        {modelStatus !== undefined ? statusIcons[modelStatus] : null} <b>{lang[key].components.stepTabs.CADModeling}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        className={`controller-button default-button
                            ${printStatus !== undefined ? `${printStatus}` : ""}
                            ${step === "printing" ? "active" : ""}`
                        }
                        value="printing"
                    >
                        {printStatus !== undefined ? statusIcons[printStatus] : null} <b>{lang[key].components.stepTabs.print}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        className={`controller-button default-button
                            ${processingStatus !== undefined ? `${processingStatus}` : ""}
                            ${step === "processing" ? "active" : ""}`
                        }
                        value="processing"
                    >
                        {processingStatus !== undefined ? statusIcons[processingStatus] : null} <b>{lang[key].components.stepTabs.processing}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        className={`controller-button default-button
                            ${deliveryStatus !== undefined ? `${deliveryStatus}` : ""}
                            ${step === "delivery" ? "active" : ""}`
                        }
                        value="delivery"
                    >
                        {deliveryStatus !== undefined ? statusIcons[deliveryStatus] : null} <b>{lang[key].components.stepTabs.delivery}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        className={`controller-button default-button
                            ${feedbackStatus !== undefined ? `${feedbackStatus}` : ""}
                            ${step === "feedback" ? "active" : ""}`
                        }
                        value="feedback"
                    >
                        {feedbackStatus !== undefined ? statusIcons[feedbackStatus] : null} <b>{lang[key].components.stepTabs.feedback}</b>
                    </ToggleButton>
                </ToggleButtonGroup>
                <div className={`steps ${key === "AR" ? "steps-ar" : ""}`}>
                    {step === "info" ? (
                        <MedicalInfo info={patientFile.patientInfo} status={{value: medStatus, setStatus: handleMedStatus}} lang={props.lang} />
                    ) : (<></>)}
                    {step === "scan" ? (
                        <EarScan info={patientFile.earScanInfo} status={{value: earScanStatus, setStatus: handleEarScanStatus}}  lang={props.lang} />
                    ) : (<></>)}
                    {step === "cad" ? (
                        <CADModel info={patientFile.modelInfo} status={{value: modelStatus, setStatus: handleModelStatus}} lang={props.lang} />
                    ) : (<></>)}
                    {step === "printing" ? (
                        <Printing info={patientFile.printingInfo} status={{value: printStatus, setStatus: handlePrintStatus}} lang={props.lang} />
                    ) : (<></>)}
                    {step === "processing" ? (
                        <PostProcessing info={patientFile.processingInfo} status={{value: processingStatus, setStatus: handleProcessingStatus}} lang={props.lang} />
                    ) : (<></>)}
                    {step === "delivery" ? (
                        <Delivery info={patientFile.deliveryInfo} status={{value: deliveryStatus, setStatus: handleDeliveryStatus}} lang={props.lang} />
                    ) : (<></>)}
                    {step === "feedback" ? (
                        <Feedback info={patientFile.feedbackInfo} status={{value: feedbackStatus, setStatus: handleFeedbackStatus}} lang={props.lang} />
                    ) : (<></>)}
                </div>
            </div>

        </div >
    );
}

export default Controller;