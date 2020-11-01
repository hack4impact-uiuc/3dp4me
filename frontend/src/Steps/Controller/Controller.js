import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './Controller.css';
import PatientInfo from '../Patient Info/PatientInfo';
import EarScan from '../Ear Scan/EarScan';
import CADModel from '../CAD Model/CADModel';
import Printing from '../3D Printing/Printing';
import PostProcessing from '../Post Processing/PostProcessing'
import Delivery from '../Delivery/Delivery';
import Feedback from '../Feedback/Feedback';
import { Accordion, AccordionDetails, AccordionSummary, TextField } from '@material-ui/core';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import colors from '../../colors.json';
import CheckIcon from '@material-ui/icons/Check';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import patientFile from '../../Test Data/patient.json'


const drawerWidth = 240;

const theme = createMuiTheme({
    direction: 'rtl',
});

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerRtl: {
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#323366',
        color: 'white'
    },
    drawerContainer: {
        overflow: 'auto',
        padding: 20,
    },
    drawerText: {
        fontSize: 16
    },
    drawerTextLabel: {
        fontSize: 14,
        color: '#babcfe',
    },
    drawerTextSection: {
        marginBottom: 30
    },
    steps: {
        paddingLeft: '50px',
        paddingBottom: '100px'
    }
}));

const Controller = (props) => {
    const classes = useStyles();
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

    const styles = {
        unfinished: {
            default: { marginRight: '15px', background: '#ffe1e1', color: 'red', borderRadius: '10px 10px 0px 0px' },
            active: { marginRight: '15px', background: '#ffe1e1', color: 'red', borderRadius: '10px 10px 0px 0px', borderTop: `solid ${colors.sidebar} 5px` },
            icon: <PriorityHighIcon style={{ color: 'red' }} />
        },
        partial: {
            default: { marginRight: '15px', background: 'white', color: '#ddc66a', borderRadius: '10px 10px 0px 0px' },
            active: { marginRight: '15px', background: 'white', color: '#ddc66a', borderRadius: '10px 10px 0px 0px', borderTop: `solid ${colors.sidebar} 5px` },
            icon: <RadioButtonUncheckedIcon style={{ color: "#ddc66a", fontSize: 22, marginRight: '5px' }} />
        },
        finished: {
            default: { marginRight: '15px', background: 'white', color: 'black', borderRadius: '10px 10px 0px 0px' },
            active: { marginRight: '15px', background: 'white', color: 'black', borderRadius: '10px 10px 0px 0px', borderTop: `solid ${colors.sidebar} 5px` },
            icon: <CheckIcon />
        }
    }

    return (
        <div className={classes.root}>
            <ThemeProvider theme={key === "AR" ? theme : null}>
                <Drawer
                    className={key == "EN" ? classes.drawer : classes.drawerRtl}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <Toolbar />
                    <div className={classes.drawerContainer}>
                        <div className={classes.drawerTextSection}>
                            <span className={classes.drawerTextLabel}>{lang[key].components.sidebar.name}</span> <br />
                            <span className={classes.drawerText}>{patientFile.patientInfo.name}</span>
                        </div>
                        <div className={classes.drawerTextSection}>
                            <span className={classes.drawerTextLabel}>{lang[key].components.sidebar.orderID}</span> <br />
                            <span className={classes.drawerText}>{patientFile.patientInfo.orderId}</span>
                        </div>
                        <div className={classes.drawerTextSection}>
                            <span className={classes.drawerTextLabel}>{lang[key].components.sidebar.dob}</span> <br />
                            <span className={classes.drawerText}>{patientFile.patientInfo.dob}</span>
                        </div>
                        <span className={classes.drawerTextLabel}>{lang[key].components.notes.title}</span>
                        <div style={{ backgroundColor: '#323366', marginTop: 3 }} className={classes.drawerItem}>
                            <Accordion expanded={expanded === 'info'} onChange={handleNotePanel('info')}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: colors.button }} />}>{lang[key].components.stepTabs.patientInfo}</AccordionSummary>
                                <AccordionDetails>
                                    This is where the notes will go
                                    </AccordionDetails>
                            </Accordion>
                            <Accordion expanded={expanded === 'scan'} onChange={handleNotePanel('scan')}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: colors.button }} />}>{lang[key].components.stepTabs.earScan}</AccordionSummary>
                                <AccordionDetails>
                                    This is where the notes will go
                                    </AccordionDetails>
                            </Accordion>
                            <Accordion expanded={expanded === 'cad'} onChange={handleNotePanel('cad')}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: colors.button }} />}>{lang[key].components.stepTabs.CADModeling}</AccordionSummary>
                                <AccordionDetails>
                                    This is where the notes will go
                                    </AccordionDetails>
                            </Accordion>
                            <Accordion expanded={expanded === 'processing'} onChange={handleNotePanel('processing')}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: colors.button }} />}>{lang[key].components.stepTabs.print}</AccordionSummary>
                                <AccordionDetails>
                                    This is where the notes will go
                                    </AccordionDetails>
                            </Accordion>
                            <Accordion expanded={expanded === 'delivery'} onChange={handleNotePanel('delivery')}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: colors.button }} />}>{lang[key].components.stepTabs.delivery}</AccordionSummary>
                                <AccordionDetails>
                                    This is where the notes will go
                                    </AccordionDetails>
                            </Accordion>
                            <Accordion expanded={expanded === 'feedback'} onChange={handleNotePanel('feedback')}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: colors.button }} />}>{lang[key].components.stepTabs.feedback}</AccordionSummary>
                                <AccordionDetails>
                                    This is where the notes will go
                                    </AccordionDetails>
                            </Accordion>
                        </div>

                    </div>
                </Drawer>
            </ThemeProvider>

            <div className={`controller-content`} style={key === "AR" ? { marginRight: drawerWidth } : {}}>
                <ToggleButtonGroup style={{ width: '100%', background: "#e1edff", padding: "50px 0px 0px" }} size="large" exclusive value={step} onChange={handleStep}>
                    <ToggleButton
                        disableRipple
                        style={
                            medStatus !== undefined ? (
                                step === "info" ? (
                                    styles[medStatus].active
                                ) : (
                                    styles[medStatus].default
                                )
                            ) : (null)
                        }
                        value="info"
                    >
                        {medStatus !== undefined ? styles[medStatus].icon : null} <b>{lang[key].components.stepTabs.patientInfo}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={
                            earScanStatus !== undefined ? (
                                step === "scan" ? (
                                    styles[earScanStatus].active
                                ) : (
                                    styles[earScanStatus].default
                                )
                            ) : (null)
                        }
                        value="scan"
                    >
                        {earScanStatus !== undefined ? styles[earScanStatus].icon : null} <b>{lang[key].components.stepTabs.earScan}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={
                            modelStatus !== undefined ? (
                                step === "cad" ? (
                                    styles[modelStatus].active
                                ) : (
                                    styles[modelStatus].default
                                )
                            ) : (null)
                        }
                        value="cad"
                    >
                        {modelStatus !== undefined ? styles[modelStatus].icon : null} <b>{lang[key].components.stepTabs.CADModeling}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={
                            printStatus !== undefined ? (
                                step === "printing" && printStatus !== undefined ? (
                                    styles[printStatus].active
                                ) : (
                                    styles[printStatus].default
                                )
                            ) : (null)
                        }
                        value="printing"
                    >
                        {printStatus !== undefined ? styles[printStatus].icon: null} <b>{lang[key].components.stepTabs.print}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={
                            processingStatus !== undefined ? (
                                step === "processing" ? (
                                    styles[processingStatus].active
                                ) : (
                                    styles[processingStatus].default
                                )
                            ) : (null)
                        }
                        value="processing"
                    >
                        {processingStatus !== undefined ? styles[processingStatus].icon : null} <b>{lang[key].components.stepTabs.processing}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={
                            deliveryStatus !== undefined ? (
                                step === "delivery" ? (
                                    styles[deliveryStatus].active
                                ) : (
                                    styles[deliveryStatus].default
                                )
                            ) : (null)
                        }
                        value="delivery"
                    >
                        {deliveryStatus !== undefined && styles[deliveryStatus].icon} <b>{lang[key].components.stepTabs.delivery}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={
                            feedbackStatus !== undefined ? (
                                step === "feedback" ? (
                                    styles[feedbackStatus].active
                                ) : (
                                    styles[feedbackStatus].default
                                )
                            ) : (null)
                        }
                        value="feedback"
                    >
                        {feedbackStatus !== undefined ? styles[feedbackStatus].icon : null} <b>{lang[key].components.stepTabs.feedback}</b>
                    </ToggleButton>
                </ToggleButtonGroup>
                <div className={classes.steps} style={key === "AR" ? { marginRight: '50px', background: 'white' } : {}}>
                    {step === "info" ? (
                        <PatientInfo info={patientFile.patientInfo} status={{value: medStatus, setStatus: handleMedStatus}} lang={props.lang} />
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