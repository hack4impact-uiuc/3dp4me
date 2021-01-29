import React, { useEffect, useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './Controller.scss';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    TextField,
} from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import reactSwal from '@sweetalert/with-react';
import swal from 'sweetalert';
import { useParams } from 'react-router-dom';

import MedicalInfo from '../MedicalInfo/MedicalInfo';
import EarScan from '../EarScan/EarScan';
import CADModel from '../CADModel/CADModel';
import Printing from '../3DPrinting/Printing';
import PostProcessing from '../PostProcessing/PostProcessing';
import Delivery from '../Delivery/Delivery';
import Feedback from '../Feedback/Feedback';
import patientFiles from '../../Test Data/patient.json';
import ToggleButtons from '../../components/ToggleButtons/ToggleButtons';
import ManagePatientModal from '../../components/ManagePatientModal/ManagePatientModal';
import { getPatientById, updateStage } from '../../utils/api';
import LoadWrapper from '../../components/LoadWrapper/LoadWrapper';

const theme = createMuiTheme({
    direction: 'rtl',
});

const Controller = (props) => {
    const [expanded, setExpanded] = useState(false);
    const [patient, setPatient] = useState();
    const [loading, setLoading] = useState(true);
    const [patientFile, setPatientFile] = useState();
    const [step, setStep] = useState('info');
    const [medStatus, setMedStatus] = useState('unfinished');
    const [earScanStatus, setEarScanStatus] = useState('unfinished');
    const [modelStatus, setModelStatus] = useState('unfinished');
    const [printStatus, setPrintStatus] = useState('unfinished');
    const [processingStatus, setProcessingStatus] = useState('unfinished');
    const [deliveryStatus, setDeliveryStatus] = useState('unfinished');
    const [feedbackStatus, setFeedbackStatus] = useState('unfinished');
    const params = useParams();
    const { id } = params;

    const lang = props.lang.data;
    const { key } = props.lang;

    const managePatient = () => {
        reactSwal({
            className: 'controller-manage-patient-swal',
            buttons: {},
            content: <ManagePatientModal lang={props.lang} />,
        });
    };

    const handleNotePanel = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleStep = (event, newStep) => {
        if (newStep !== null) {
            setStep(newStep);
            if (newStep === 'info') {
                setPatient([]);
            } else if (newStep === 'scan') {
                setPatient([]);
            } else if (newStep === 'cad') {
                setPatient([]);
            } else if (newStep === 'printing') {
                setPatient([]);
            } else if (newStep === 'processing') {
                setPatient([]);
            } else if (newStep === 'delivery') {
                setPatient([]);
            } else if (newStep === 'feedback') {
                setPatient([]);
            }
        }
    };

    const handleMedStatus = (e) => {
        if (
            e.target.value === 'unfinished' ||
            e.target.value === 'partial' ||
            e.target.value === 'finished'
        ) {
            setMedStatus(e.target.value);
            const patientFileCopy = patientFile;
            patientFileCopy.patientInfo.status = e.target.value;
            updateStage(id, 'patientInfo', patientFileCopy.patientInfo);
            setPatientFile(patientFileCopy);
        }
    };
    const handleEarScanStatus = (e) => {
        if (
            e.target.value === 'unfinished' ||
            e.target.value === 'partial' ||
            e.target.value === 'finished'
        ) {
            setEarScanStatus(e.target.value);
            const patientFileCopy = patientFile;
            patientFileCopy.earScanInfo.status = e.target.value;
            updateStage(id, 'earScanInfo', patientFileCopy.earScanInfo);
            setPatientFile(patientFileCopy);
        }
    };
    const handleModelStatus = (e) => {
        if (
            e.target.value === 'unfinished' ||
            e.target.value === 'partial' ||
            e.target.value === 'finished'
        ) {
            setModelStatus(e.target.value);
            const patientFileCopy = patientFile;
            patientFileCopy.modelInfo.status = e.target.value;
            updateStage(id, 'modelInfo', patientFileCopy.modelInfo);
            setPatientFile(patientFileCopy);
        }
    };
    const handlePrintStatus = (e) => {
        if (
            e.target.value === 'unfinished' ||
            e.target.value === 'partial' ||
            e.target.value === 'finished'
        ) {
            setPrintStatus(e.target.value);
            const patientFileCopy = patientFile;
            patientFileCopy.printingInfo.status = e.target.value;
            updateStage(id, 'printingInfo', patientFileCopy.printingInfo);
            setPatientFile(patientFileCopy);
        }
    };
    const handleProcessingStatus = (e) => {
        if (
            e.target.value === 'unfinished' ||
            e.target.value === 'partial' ||
            e.target.value === 'finished'
        ) {
            setProcessingStatus(e.target.value);
            const patientFileCopy = patientFile;
            patientFileCopy.processingInfo.status = e.target.value;
            updateStage(id, 'processingInfo', patientFileCopy.processingInfo);
            setPatientFile(patientFileCopy);
        }
    };
    const handleDeliveryStatus = (e) => {
        if (
            e.target.value === 'unfinished' ||
            e.target.value === 'partial' ||
            e.target.value === 'finished'
        ) {
            setDeliveryStatus(e.target.value);
            const patientFileCopy = patientFile;
            patientFileCopy.deliveryInfo.status = e.target.value;
            updateStage(id, 'deliveryInfo', patientFileCopy.deliveryInfo);
            setPatientFile(patientFileCopy);
        }
    };
    const handleFeedbackStatus = (e) => {
        if (
            e.target.value === 'unfinished' ||
            e.target.value === 'partial' ||
            e.target.value === 'finished'
        ) {
            setFeedbackStatus(e.target.value);
            const patientFileCopy = patientFile;
            patientFileCopy.feedbackInfo.status = e.target.value;
            updateStage(id, 'feedbackInfo', patientFileCopy.feedbackInfo);
            setPatientFile(patientFileCopy);
        }
    };

    const getData = async () => {
        // TODO: api call to get all info about a patient
        const res = await getPatientById(id);
        console.log(res);
        setPatientFile(res.result);
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, [setPatientFile, setLoading]);

    const updatePatientFile = (stageName, updated) => {
        setPatientFile({ ...patientFile, stageName: updated });
    };

    return (
        <LoadWrapper loading={loading}>
            <div className="root">
                <ThemeProvider theme={key === 'AR' ? theme : null}>
                    <Drawer
                        className={key === 'EN' ? 'drawer' : 'drawer-rtl'}
                        variant="permanent"
                        classes={{
                            paper: 'drawer-paper',
                        }}
                    >
                        <Toolbar />
                        <div className="drawer-container">
                            <div>
                                <div className="drawer-text-section">
                                    <span className="drawer-text-label">
                                        {lang[key].components.sidebar.name}
                                    </span>{' '}
                                    <br />
                                    <span className="drawer-text">
                                        {patientFile?.patientInfo.name}
                                    </span>
                                </div>
                                <div className="drawer-text-section">
                                    <span className="drawer-text-label">
                                        {lang[key].components.sidebar.orderID}
                                    </span>{' '}
                                    <br />
                                    <span className="drawer-text">
                                        {patientFile?.patientInfo.orderId}
                                    </span>
                                </div>
                                <div className="drawer-text-section">
                                    <span className="drawer-text-label">
                                        {lang[key].components.sidebar.dob}
                                    </span>{' '}
                                    <br />
                                    <span className="drawer-text">
                                        {patientFile?.patientInfo.dob}
                                    </span>
                                </div>
                                <div className="drawer-text-section">
                                    <span className="drawer-text-label">
                                        {lang[key].components.sidebar.status}
                                    </span>{' '}
                                    <br />
                                    <span className="drawer-text">
                                        {patientFile?.patientInfo.status}
                                    </span>
                                </div>
                                <span className="drawer-text-label">
                                    {lang[key].components.notes.title}
                                </span>
                                <div className="drawer-notes-wrapper">
                                    <Accordion
                                        expanded={expanded === 'info'}
                                        onChange={handleNotePanel('info')}
                                    >
                                        <AccordionSummary
                                            expandIcon={
                                                <ExpandMoreIcon className="expand-icon" />
                                            }
                                        >
                                            {
                                                lang[key].components.stepTabs
                                                    .patientInfo
                                            }
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {patientFile?.patientInfo.notes}
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion
                                        expanded={expanded === 'scan'}
                                        onChange={handleNotePanel('scan')}
                                    >
                                        <AccordionSummary
                                            expandIcon={
                                                <ExpandMoreIcon className="expand-icon" />
                                            }
                                        >
                                            {
                                                lang[key].components.stepTabs
                                                    .earScan
                                            }
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {patientFile?.earScanInfo.notes}
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion
                                        expanded={expanded === 'cad'}
                                        onChange={handleNotePanel('cad')}
                                    >
                                        <AccordionSummary
                                            expandIcon={
                                                <ExpandMoreIcon className="expand-icon" />
                                            }
                                        >
                                            {
                                                lang[key].components.stepTabs
                                                    .CADModeling
                                            }
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {patientFile?.modelInfo.notes}
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion
                                        expanded={expanded === 'processing'}
                                        onChange={handleNotePanel('processing')}
                                    >
                                        <AccordionSummary
                                            expandIcon={
                                                <ExpandMoreIcon className="expand-icon" />
                                            }
                                        >
                                            {
                                                lang[key].components.stepTabs
                                                    .print
                                            }
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {patientFile?.printingInfo.notes}
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion
                                        expanded={expanded === 'delivery'}
                                        onChange={handleNotePanel('delivery')}
                                    >
                                        <AccordionSummary
                                            expandIcon={
                                                <ExpandMoreIcon className="expand-icon" />
                                            }
                                        >
                                            {
                                                lang[key].components.stepTabs
                                                    .delivery
                                            }
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {patientFile?.deliveryInfo.notes}
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion
                                        expanded={expanded === 'feedback'}
                                        onChange={handleNotePanel('feedback')}
                                    >
                                        <AccordionSummary
                                            expandIcon={
                                                <ExpandMoreIcon className="expand-icon" />
                                            }
                                        >
                                            {
                                                lang[key].components.stepTabs
                                                    .feedback
                                            }
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {patientFile?.feedbackInfo.notes}
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Button
                                    onClick={managePatient}
                                    className="manage-patient-button"
                                >
                                    {lang[key].components.button.managePatient}
                                </Button>
                            </div>
                        </div>
                    </Drawer>
                </ThemeProvider>

                <div
                    className={`controller-content ${
                        key === 'AR' ? 'controller-content-ar' : ''
                    }`}
                >
                    <ToggleButtons
                        lang={props.lang}
                        step={step}
                        handleStep={handleStep}
                        medStatus={medStatus}
                        earScanStatus={earScanStatus}
                        modelStatus={modelStatus}
                        printStatus={printStatus}
                        processingStatus={processingStatus}
                        deliveryStatus={deliveryStatus}
                        feedbackStatus={feedbackStatus}
                    />
                    <div className={`steps ${key === 'AR' ? 'steps-ar' : ''}`}>
                        {step === 'info' ? (
                            <MedicalInfo
                                info={patientFile?.patientInfo}
                                status={{
                                    value: medStatus,
                                    setStatus: handleMedStatus,
                                }}
                                lang={props.lang}
                                id={id}
                                updatePatientFile={updatePatientFile}
                            />
                        ) : (
                            <></>
                        )}
                        {step === 'scan' ? (
                            <EarScan
                                info={patientFile?.earScanInfo}
                                status={{
                                    value: earScanStatus,
                                    setStatus: handleEarScanStatus,
                                }}
                                lang={props.lang}
                                id={id}
                                updatePatientFile={updatePatientFile}
                            />
                        ) : (
                            <></>
                        )}
                        {step === 'cad' ? (
                            <CADModel
                                info={patientFile?.modelInfo}
                                status={{
                                    value: modelStatus,
                                    setStatus: handleModelStatus,
                                }}
                                lang={props.lang}
                                id={id}
                                updatePatientFile={updatePatientFile}
                            />
                        ) : (
                            <></>
                        )}
                        {step === 'printing' ? (
                            <Printing
                                info={patientFile?.printingInfo}
                                status={{
                                    value: printStatus,
                                    setStatus: handlePrintStatus,
                                }}
                                lang={props.lang}
                                id={id}
                                updatePatientFile={updatePatientFile}
                            />
                        ) : (
                            <></>
                        )}
                        {step === 'processing' ? (
                            <PostProcessing
                                info={patientFile?.processingInfo}
                                status={{
                                    value: processingStatus,
                                    setStatus: handleProcessingStatus,
                                }}
                                lang={props.lang}
                                id={id}
                                updatePatientFile={updatePatientFile}
                            />
                        ) : (
                            <></>
                        )}
                        {step === 'delivery' ? (
                            <Delivery
                                info={patientFile?.deliveryInfo}
                                status={{
                                    value: deliveryStatus,
                                    setStatus: handleDeliveryStatus,
                                }}
                                lang={props.lang}
                                id={id}
                                updatePatientFile={updatePatientFile}
                                address={patientFile?.patientInfo.address}
                                deliveryType={patientFile?.patientInfo.delivery}
                            />
                        ) : (
                            <></>
                        )}
                        {step === 'feedback' ? (
                            <Feedback
                                info={patientFile?.feedbackInfo}
                                status={{
                                    value: feedbackStatus,
                                    setStatus: handleFeedbackStatus,
                                }}
                                lang={props.lang}
                                id={id}
                                updatePatientFile={updatePatientFile}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </LoadWrapper>
    );
};

export default Controller;
