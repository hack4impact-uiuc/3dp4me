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


    }
}));

const Controller = (props) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [patient, setPatient] = useState([]);
    const [step, setStep] = useState("info");

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
                    <div style={{backgroundColor: '#9ebdeb'}} className={classes.drawerItem}>
                        <Accordion expanded={expanded === 'info'} onChange={handleNotePanel('info')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>Patient Info</AccordionSummary>
                            <AccordionDetails>
                                This is where the notes will go
                        </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'scan'} onChange={handleNotePanel('scan')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>Ear Scan</AccordionSummary>
                            <AccordionDetails>
                                This is where the notes will go
                        </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'cad'} onChange={handleNotePanel('cad')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>CAD Model</AccordionSummary>
                            <AccordionDetails>
                                This is where the notes will go
                        </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'processing'} onChange={handleNotePanel('processing')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>3D Printing</AccordionSummary>
                            <AccordionDetails>
                                This is where the notes will go
                        </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'delivery'} onChange={handleNotePanel('delivery')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>Delivery</AccordionSummary>
                            <AccordionDetails>
                                This is where the notes will go
                        </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'feedback'} onChange={handleNotePanel('feedback')}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>Feedback</AccordionSummary>
                            <AccordionDetails>
                                This is where the notes will go
                        </AccordionDetails>
                        </Accordion>
                    </div>

                </div>
            </Drawer>

            <div className="controller-content">
                <ToggleButtonGroup style={{ width: '100%' }} size="large" exclusive value={step} onChange={handleStep}>
                    <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black', borderTop: 'solid green 4px' }} value="info">Patient Info</ToggleButton>
                    <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black', borderTop: 'solid #F7B610 4px' }} value="scan">Ear scan upload</ToggleButton>
                    <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black', borderTop: 'solid red 4px' }} value="cad">CAD Modleing</ToggleButton>
                    <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black', borderTop: 'solid red 4px' }} value="printing">3D Printing</ToggleButton>
                    <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black', borderTop: 'solid green 4px' }} value="processing">Post Processing</ToggleButton>
                    <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black', borderTop: 'solid green 4px' }} value="delivery">Delivery</ToggleButton>
                    <ToggleButton disableRipple style={{ flexGrow: 1, color: 'black', borderTop: 'solid #F7B610 4px' }} value="feedback">Feedback</ToggleButton>
                </ToggleButtonGroup>
                <div className="steps">
                    {step === "info" ? (
                        <PatientInfo />
                    ) : (
                            <></>
                        )}
                    {step === "scan" ? (
                        <EarScan />
                    ) : (
                            <></>
                        )}
                    {step === "cad" ? (
                        <CADModel />
                    ) : (
                            <></>
                        )}
                    {step === "printing" ? (
                        <Printing />
                    ) : (
                            <></>
                        )}
                    {step === "processing" ? (
                        <PostProcessing />
                    ) : (
                            <></>
                        )}
                    {step === "delivery" ? (
                        <Delivery />
                    ) : (
                            <></>
                        )}
                    {step === "feedback" ? (
                        <Feedback />
                    ) : (
                            <></>
                        )}
                </div>
            </div>

        </div>
    );
}

export default Controller;