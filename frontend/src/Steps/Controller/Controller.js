import React, { useState } from 'react';
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
        paddingBottom: '50px'
    }
}));

const Controller = (props) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [patient, setPatient] = useState([]);
    const [step, setStep] = useState("info");
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
                                <span className={classes.drawerText}>First Last</span>
                            </div>
                            <div className={classes.drawerTextSection}>
                                <span className={classes.drawerTextLabel}>{lang[key].components.sidebar.orderID}</span> <br />
                                <span className={classes.drawerText}>#1271837</span>
                            </div>
                            <div className={classes.drawerTextSection}>
                                <span className={classes.drawerTextLabel}>{lang[key].components.sidebar.dob}</span> <br />
                                <span className={classes.drawerText}>10/24/2004</span>
                            </div>
                            <span className={classes.drawerTextLabel}>{lang[key].components.notes.title}</span>
                            <div style={{ backgroundColor: '#323366', marginTop: 3 }} className={classes.drawerItem}>
                                <Accordion expanded={expanded === 'info'} onChange={handleNotePanel('info')}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon style={{color: colors.button}} />}>{lang[key].components.stepTabs.patientInfo}</AccordionSummary>
                                    <AccordionDetails>
                                        This is where the notes will go
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion expanded={expanded === 'scan'} onChange={handleNotePanel('scan')}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon style={{color: colors.button}} />}>{lang[key].components.stepTabs.earScan}</AccordionSummary>
                                    <AccordionDetails>
                                        This is where the notes will go
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion expanded={expanded === 'cad'} onChange={handleNotePanel('cad')}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon style={{color: colors.button}} />}>{lang[key].components.stepTabs.CADModeling}</AccordionSummary>
                                    <AccordionDetails>
                                        This is where the notes will go
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion expanded={expanded === 'processing'} onChange={handleNotePanel('processing')}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon style={{color: colors.button}} />}>{lang[key].components.stepTabs.print}</AccordionSummary>
                                    <AccordionDetails>
                                        This is where the notes will go
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion expanded={expanded === 'delivery'} onChange={handleNotePanel('delivery')}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon style={{color: colors.button}} />}>{lang[key].components.stepTabs.delivery}</AccordionSummary>
                                    <AccordionDetails>
                                        This is where the notes will go
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion expanded={expanded === 'feedback'} onChange={handleNotePanel('feedback')}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon style={{color: colors.button}} />}>{lang[key].components.stepTabs.feedback}</AccordionSummary>
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
                        style={{ marginRight: '15px', background: 'white', color: 'black', borderRadius: '10px 10px 0px 0px'  }}
                        value="info"
                    >
                        <CheckIcon /> <b>{lang[key].components.stepTabs.patientInfo}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={{ marginRight: '15px', background: '#ffe1e1', color: 'red', borderRadius: '10px 10px 0px 0px' }}
                        value="scan"
                    >
                        <PriorityHighIcon style={{color: 'red'}} /> <b>{lang[key].components.stepTabs.earScan}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={{ marginRight: '15px', background: 'white', color: 'black', borderRadius: '10px 10px 0px 0px'}}
                        value="cad"
                    >
                        <CheckIcon /> <b>{lang[key].components.stepTabs.CADModeling}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={{ marginRight: '15px', background: 'white', color: 'black', borderRadius: '10px 10px 0px 0px' }}
                        value="printing"
                    >
                         <CheckIcon /> <b>{lang[key].components.stepTabs.print}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={{ marginRight: '15px', background: 'white', color: '#ddc66a', borderRadius: '10px 10px 0px 0px'}}
                        value="processing"
                    >
                        <RadioButtonUncheckedIcon style={{color: "#ddc66a", fontSize: 22, marginRight: '5px' }} /> <b>{lang[key].components.stepTabs.processing}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={{ marginRight: '15px', background: 'white', color: 'black', borderRadius: '10px 10px 0px 0px' }}
                        value="delivery"
                    >
                        <CheckIcon /> <b>{lang[key].components.stepTabs.delivery}</b>
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={{ marginRight: '15px', background: 'white', color: 'black', borderRadius: '10px 10px 0px 0px'}}
                        value="feedback"
                    >
                        <CheckIcon /> <b>{lang[key].components.stepTabs.feedback}</b>
                    </ToggleButton>
                </ToggleButtonGroup>
                <div className={classes.steps} style={key === "AR" ? { marginRight: '50px', background: 'white' } : {}}>
                    {step === "info" ? (
                        <PatientInfo lang={props.lang} />
                    ) : (<></>)}
                    {step === "scan" ? (
                        <EarScan lang={props.lang} />
                    ) : (<></>)}
                    {step === "cad" ? (
                        <CADModel lang={props.lang} />
                    ) : (<></>)}
                    {step === "printing" ? (
                        <Printing lang={props.lang} />
                    ) : (<></>)}
                    {step === "processing" ? (
                        <PostProcessing lang={props.lang} />
                    ) : (<></>)}
                    {step === "delivery" ? (
                        <Delivery lang={props.lang} />
                    ) : (<></>)}
                    {step === "feedback" ? (
                        <Feedback lang={props.lang} />
                    ) : (<></>)}
                </div>
            </div>

        </div >
    );
}

export default Controller;