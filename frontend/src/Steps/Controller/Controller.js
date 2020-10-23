import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


import './Controller.css'

import PatientInfo from '../Patient Info/PatientInfo'
import { Accordion, AccordionDetails, AccordionSummary, TextField } from '@material-ui/core';

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
    },
    drawerContainer: {
        overflow: 'auto',
        padding: 15,
    },
    drawerItem: {
        marginTop: 40,
    }
}));

const Controller = (props) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);

    const handleNotePanel = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
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
                        variant="outlined"
                        defaultValue="Test Name"
                        className={classes.drawerItem}
                    />
                    <TextField
                        label="Order ID"
                        defaultValue={`# Test Order ID`}
                        className={classes.drawerItem}
                    />
                    <TextField
                        label="DOB"
                        className={classes.drawerItem}
                    />
                    <div className={classes.drawerItem}>
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
                <PatientInfo />
            </div>

        </div>
    );
}

export default Controller;