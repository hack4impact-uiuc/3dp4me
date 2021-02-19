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
} from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import reactSwal from '@sweetalert/with-react';
import { useParams } from 'react-router-dom';

import { LanguageDataType } from '../../utils/custom-proptypes';
import StepContent from '../StepContent/StepContent';
import MedicalInfo from '../MedicalInfo/MedicalInfo';
import EarScan from '../EarScan/EarScan';
import CADModel from '../CADModel/CADModel';
import Printing from '../3DPrinting/Printing';
import PostProcessing from '../PostProcessing/PostProcessing';
import Delivery from '../Delivery/Delivery';
import Feedback from '../Feedback/Feedback';
import ToggleButtons from '../../components/ToggleButtons/ToggleButtons';
import ManagePatientModal from '../../components/ManagePatientModal/ManagePatientModal';
import { getPatientById, updateStage } from '../../utils/api';
import LoadWrapper from '../../components/LoadWrapper/LoadWrapper';

const theme = createMuiTheme({
    direction: 'rtl',
});

const Controller = ({ languageData }) => {
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [patientData, setPatientData] = useState();
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

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const managePatient = () => {
        reactSwal({
            className: 'controller-manage-patient-swal',
            buttons: {},
            content: <ManagePatientModal languageData={languageData} />,
        });
    };

    const handleNotePanel = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleStep = (event, newStep) => {
        if (newStep !== null) {
            setStep(newStep);
        }
    };

    const handleMedStatus = (e) => {
        if (
            e.target.value === 'unfinished' ||
            e.target.value === 'partial' ||
            e.target.value === 'finished'
        ) {
            setMedStatus(e.target.value);
            const patientDataCopy = patientData;
            patientDataCopy.patientInfo.status = e.target.value;
            updateStage(id, 'patientInfo', patientDataCopy.patientInfo);
            setPatientData(patientDataCopy);
        }
    };
    const handleEarScanStatus = (e) => {
        if (
            e.target.value === 'unfinished' ||
            e.target.value === 'partial' ||
            e.target.value === 'finished'
        ) {
            setEarScanStatus(e.target.value);
            const patientDataCopy = patientData;
            patientDataCopy.earScanInfo.status = e.target.value;
            updateStage(id, 'earScanInfo', patientDataCopy.earScanInfo);
            setPatientData(patientDataCopy);
        }
    };
    const handleModelStatus = (e) => {
        if (
            e.target.value === 'unfinished' ||
            e.target.value === 'partial' ||
            e.target.value === 'finished'
        ) {
            setModelStatus(e.target.value);
            const patientDataCopy = patientData;
            patientDataCopy.modelInfo.status = e.target.value;
            updateStage(id, 'modelInfo', patientDataCopy.modelInfo);
            setPatientData(patientDataCopy);
        }
    };
    const handlePrintStatus = (e) => {
        if (
            e.target.value === 'unfinished' ||
            e.target.value === 'partial' ||
            e.target.value === 'finished'
        ) {
            setPrintStatus(e.target.value);
            const patientDataCopy = patientData;
            patientDataCopy.printingInfo.status = e.target.value;
            updateStage(id, 'printingInfo', patientDataCopy.printingInfo);
            setPatientData(patientDataCopy);
        }
    };
    const handleProcessingStatus = (e) => {
        if (
            e.target.value === 'unfinished' ||
            e.target.value === 'partial' ||
            e.target.value === 'finished'
        ) {
            setProcessingStatus(e.target.value);
            const patientDataCopy = patientData;
            patientDataCopy.processingInfo.status = e.target.value;
            updateStage(id, 'processingInfo', patientDataCopy.processingInfo);
            setPatientData(patientDataCopy);
        }
    };
    const handleDeliveryStatus = (e) => {
        if (
            e.target.value === 'unfinished' ||
            e.target.value === 'partial' ||
            e.target.value === 'finished'
        ) {
            setDeliveryStatus(e.target.value);
            const patientDataCopy = patientData;
            patientDataCopy.deliveryInfo.status = e.target.value;
            updateStage(id, 'deliveryInfo', patientDataCopy.deliveryInfo);
            setPatientData(patientDataCopy);
        }
    };
    const handleFeedbackStatus = (e) => {
        if (
            e.target.value === 'unfinished' ||
            e.target.value === 'partial' ||
            e.target.value === 'finished'
        ) {
            setFeedbackStatus(e.target.value);
            const patientDataCopy = patientData;
            patientDataCopy.feedbackInfo.status = e.target.value;
            updateStage(id, 'feedbackInfo', patientDataCopy.feedbackInfo);
            setPatientData(patientDataCopy);
        }
    };

    useEffect(() => {
        const getData = async () => {
            // TODO: api call to get all info about a patient
            const res = await getPatientById(id);
            setPatientData(res.result);
            setLoading(false);
        };

        getData();
    }, [setPatientData, setLoading, id]);

    const updatePatientFile = (stageName, updated) => {
        setPatientData({ ...patientData, stageName: updated });
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
                                        {lang.components.sidebar.name}
                                    </span>{' '}
                                    <br />
                                    <span className="drawer-text">
                                        {patientData?.patientInfo.name}
                                    </span>
                                </div>
                                <div className="drawer-text-section">
                                    <span className="drawer-text-label">
                                        {lang.components.sidebar.orderID}
                                    </span>{' '}
                                    <br />
                                    <span className="drawer-text">
                                        {patientData?.patientInfo.orderId}
                                    </span>
                                </div>
                                <div className="drawer-text-section">
                                    <span className="drawer-text-label">
                                        {lang.components.sidebar.dob}
                                    </span>{' '}
                                    <br />
                                    <span className="drawer-text">
                                        {patientData?.patientInfo.dob}
                                    </span>
                                </div>
                                <div className="drawer-text-section">
                                    <span className="drawer-text-label">
                                        {lang.components.sidebar.status}
                                    </span>{' '}
                                    <br />
                                    <span className="drawer-text">
                                        {patientData?.patientInfo.status}
                                    </span>
                                </div>
                                <span className="drawer-text-label">
                                    {lang.components.notes.title}
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
                                                lang.components.stepTabs
                                                    .patientInfo
                                            }
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {patientData?.patientInfo.notes}
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
                                            {lang.components.stepTabs.earScan}
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {patientData?.earScanInfo.notes}
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
                                                lang.components.stepTabs
                                                    .CADModeling
                                            }
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {patientData?.modelInfo.notes}
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
                                            {lang.components.stepTabs.print}
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {patientData?.printingInfo.notes}
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
                                            {lang.components.stepTabs.delivery}
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {patientData?.deliveryInfo.notes}
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
                                            {lang.components.stepTabs.feedback}
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {patientData?.feedbackInfo.notes}
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
                                    {lang.components.button.managePatient}
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
                        languageData={languageData}
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
                            <StepContent
                                // metaData={null}
                                // stepData={null}
                                languageData={languageData}
                                id={id}
                                updatePatientFile={updatePatientFile}
                            />
                        ) : (
                            // <MedicalInfo
                            //     information={patientData?.patientInfo}
                            //     status={{
                            //         state: medStatus,
                            //         setState: handleMedStatus,
                            //     }}
                            //     languageData={languageData}
                            //     id={id}
                            //     updatePatientFile={updatePatientFile}
                            // />
                            <></>
                        )}
                        {step === 'scan' ? (
                            <EarScan
                                information={patientData?.earScanInfo}
                                status={{
                                    state: earScanStatus,
                                    setState: handleEarScanStatus,
                                }}
                                languageData={languageData}
                                id={id}
                                updatePatientFile={updatePatientFile}
                            />
                        ) : (
                            <></>
                        )}
                        {step === 'cad' ? (
                            <CADModel
                                information={patientData?.modelInfo}
                                status={{
                                    value: modelStatus,
                                    setStatus: handleModelStatus,
                                }}
                                languageData={languageData}
                                id={id}
                                updatePatientFile={updatePatientFile}
                            />
                        ) : (
                            <></>
                        )}
                        {step === 'printing' ? (
                            <Printing
                                information={patientData?.printingInfo}
                                status={{
                                    state: printStatus,
                                    setState: handlePrintStatus,
                                }}
                                languageData={languageData}
                                id={id}
                                updatePatientFile={updatePatientFile}
                            />
                        ) : (
                            <></>
                        )}
                        {step === 'processing' ? (
                            <PostProcessing
                                information={patientData?.processingInfo}
                                status={{
                                    state: processingStatus,
                                    setState: handleProcessingStatus,
                                }}
                                languageData={languageData}
                                id={id}
                                updatePatientFile={updatePatientFile}
                            />
                        ) : (
                            <></>
                        )}
                        {step === 'delivery' ? (
                            <Delivery
                                information={patientData?.deliveryInfo}
                                status={{
                                    state: deliveryStatus,
                                    setState: handleDeliveryStatus,
                                }}
                                languageData={languageData}
                                id={id}
                                updatePatientFile={updatePatientFile}
                                address={patientData?.patientInfo.address}
                                deliveryType={patientData?.patientInfo.delivery}
                            />
                        ) : (
                            <></>
                        )}
                        {step === 'feedback' ? (
                            <Feedback
                                information={patientData?.feedbackInfo}
                                status={{
                                    state: feedbackStatus,
                                    setState: handleFeedbackStatus,
                                }}
                                languageData={languageData}
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

Controller.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default Controller;
