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

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,

    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#9ebdeb',
        // background: '#9ebdeb',
    },
    drawerContainer: {
        overflow: 'auto',
        padding: 15,
    },
    drawerItem: {
        marginTop: 20,
        backgroundColor: 'white',
        // padding: 10,
    },
    inputRoot: {
        fontSize: 20,
        backgroundColor: 'white',
        "&$labelFocused": {
            backgroundColor: 'white',
        },
        '&:hover': {
            backgroundColor: 'white',
        }
    },
    labelRoot: {
        fontSize: 20,
    },
    toggleButton: {

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
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <TextField
                        disabled
                        label="Name"
                        variant="filled"
                        className={classes.drawerItem}
                        InputProps={{ classes: { root: classes.inputRoot } }}
                        InputLabelProps={{
                            classes: {
                                root: classes.labelRoot,
                                focused: classes.labelFocused
                            }
                        }}
                    />
                    <TextField
                        disabled
                        label="Order ID"
                        variant="filled"
                        className={classes.drawerItem}
                        InputProps={{ classes: { root: classes.inputRoot } }}
                        InputLabelProps={{
                            classes: {
                                root: classes.labelRoot,
                                focused: classes.labelFocused
                            }
                        }}
                    />
                    <TextField
                        disabled
                        label="DOB"
                        variant="filled"
                        className={classes.drawerItem}
                        InputProps={{ classes: { root: classes.inputRoot } }}
                        InputLabelProps={{
                            classes: {
                                root: classes.labelRoot,
                                focused: classes.labelFocused
                            }
                        }}
                    />
                    <div style={{ backgroundColor: '#9ebdeb' }} className={classes.drawerItem}>
                        <Accordion expanded={expanded === 'info'} onChange={handleNotePanel('info')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>{lang[key].components.stepTabs.patientInfo}</AccordionSummary>
                            <AccordionDetails>
                                This is where the notes will go
                        </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'scan'} onChange={handleNotePanel('scan')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>{lang[key].components.stepTabs.earScan}</AccordionSummary>
                            <AccordionDetails>
                                This is where the notes will go
                        </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'cad'} onChange={handleNotePanel('cad')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>{lang[key].components.stepTabs.CADModeling}</AccordionSummary>
                            <AccordionDetails>
                                This is where the notes will go
                        </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'processing'} onChange={handleNotePanel('processing')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>{lang[key].components.stepTabs.print}</AccordionSummary>
                            <AccordionDetails>
                                This is where the notes will go
                        </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'delivery'} onChange={handleNotePanel('delivery')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>{lang[key].components.stepTabs.delivery}</AccordionSummary>
                            <AccordionDetails>
                                This is where the notes will go
                        </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'feedback'} onChange={handleNotePanel('feedback')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>{lang[key].components.stepTabs.feedback}</AccordionSummary>
                            <AccordionDetails>
                                This is where the notes will go
                        </AccordionDetails>
                        </Accordion>
                    </div>

                </div>
            </Drawer>

            <div className={`controller-content`} style={{marginRight: 15}}>
                <ToggleButtonGroup style={{ width: '100%', background: "#e1edff", padding: "8px 0px 15px" }} size="large" exclusive value={step} onChange={handleStep}>
                    <ToggleButton
                        disableRipple
                        style={{ marginLeft: '5px', flexGrow: 1, borderTop: 'solid green 8px', marginRight: '5px', color: "white", background: '#5657a6' }}
                        value="info"
                    >
                        {lang[key].components.stepTabs.patientInfo}
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={{ flexGrow: 1, borderTop: 'solid #F7B610 8px', marginRight: '5px', color: "white", background: '#5657a6' }}
                        value="scan"
                    >
                        {lang[key].components.stepTabs.earScan}
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={{ flexGrow: 1, borderTop: 'solid red 8px', marginRight: '5px', color: "white", background: '#5657a6' }}
                        value="cad"
                    >
                        {lang[key].components.stepTabs.CADModeling}
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={{ flexGrow: 1, borderTop: 'solid red 8px', marginRight: '5px', color: "white", background: '#5657a6' }}
                        value="printing"
                    >
                        {lang[key].components.stepTabs.print}
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={{ flexGrow: 1, borderTop: 'solid green 8px', marginRight: '5px', color: "white", background: '#5657a6' }}
                        value="processing"
                    >
                        {lang[key].components.stepTabs.processing}
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={{ flexGrow: 1, borderTop: 'solid green 8px', marginRight: '5px', color: "white", background: '#5657a6' }}
                        value="delivery"
                    >
                        {lang[key].components.stepTabs.delivery}
                    </ToggleButton>
                    <ToggleButton
                        disableRipple
                        style={{ flexGrow: 1, borderTop: 'solid #F7B610 8px', marginRight: '5px', color: "white", background: '#5657a6' }}
                        value="feedback"
                    >
                        {lang[key].components.stepTabs.feedback}
                    </ToggleButton>
                </ToggleButtonGroup>
                <div className="steps">
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

        </div>
    );
}

export default Controller;