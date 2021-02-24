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
import {
    getAllStepsMetadata,
    getPatientById,
    updateStage,
} from '../../utils/api';
import LoadWrapper from '../../components/LoadWrapper/LoadWrapper';

const theme = createMuiTheme({
    direction: 'rtl',
});

const Controller = ({ languageData }) => {
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(true);

    const [selectedStep, setSelectedStep] = useState('info');
    const [stepMetaData, setStepMetaData] = useState(null);
    const [patientData, setPatientData] = useState();

    const [medStatus, setMedStatus] = useState('unfinished');
    const [earScanStatus, setEarScanStatus] = useState('unfinished');
    const [modelStatus, setModelStatus] = useState('unfinished');
    const [printStatus, setPrintStatus] = useState('unfinished');
    const [processingStatus, setProcessingStatus] = useState('unfinished');
    const [deliveryStatus, setDeliveryStatus] = useState('unfinished');
    const [feedbackStatus, setFeedbackStatus] = useState('unfinished');

    const params = useParams();
    const { patientId } = params;

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

    const onStepChange = (event, newStep) => {
        if (newStep === null) return;

        setSelectedStep(newStep);
    };

    useEffect(() => {
        const getData = async () => {
            const metaData = await getAllStepsMetadata();
            const data = await getPatientById(patientId);
            // TODO: Handle bad response
            setStepMetaData(metaData);
            setPatientData(data);
            setLoading(false);
        };

        getData();
    }, [setStepMetaData, setPatientData, setLoading, patientId]);

    const generateStepContent = () => {
        if (stepMetaData == null) return null;
        if (patientData == null) return null;

        return (
            <div className={`steps ${key === 'AR' ? 'steps-ar' : ''}`}>
                {stepMetaData.map((step) => {
                    if (step.key === selectedStep) {
                        return (
                            <StepContent
                                languageData={languageData}
                                patientId={patientId}
                                metaData={stepMetaData.find(
                                    (s) => s.key === step.key,
                                )}
                                stepData={patientData[step.key]}
                                loading={loading}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        );
    };

    const generateNoteSidebar = () => {
        if (stepMetaData == null) return null;
        if (patientData == null) return null;

        return (
            <div className="drawer-notes-wrapper">
                {stepMetaData.map((metaData) => {
                    if (metaData.fields.find((f) => f.key === 'notes') == null)
                        return null;

                    return (
                        <Accordion
                            expanded={expanded === metaData.key}
                            onChange={handleNotePanel(metaData.key)}
                        >
                            <AccordionSummary
                                expandIcon={
                                    <ExpandMoreIcon className="expand-icon" />
                                }
                            >
                                {metaData.displayName[key]}
                            </AccordionSummary>
                            <AccordionDetails>
                                {patientData[metaData.key].notes}
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </div>
        );
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
                                        {patientData?.name}
                                    </span>
                                </div>
                                <div className="drawer-text-section">
                                    <span className="drawer-text-label">
                                        {lang.components.sidebar.orderID}
                                    </span>{' '}
                                    <br />
                                    <span className="drawer-text">
                                        {patientData?.orderId}
                                    </span>
                                </div>
                                <div className="drawer-text-section">
                                    <span className="drawer-text-label">
                                        {lang.components.sidebar.status}
                                    </span>{' '}
                                    <br />
                                    <span className="drawer-text">
                                        {patientData?.status}
                                    </span>
                                </div>
                                <span className="drawer-text-label">
                                    {lang.components.notes.title}
                                </span>
                                {generateNoteSidebar()}
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
                        step={selectedStep}
                        handleStep={onStepChange}
                        medStatus={medStatus}
                        // TODO: Pass metadata here
                        earScanStatus={earScanStatus}
                        modelStatus={modelStatus}
                        printStatus={printStatus}
                        processingStatus={processingStatus}
                        deliveryStatus={deliveryStatus}
                        feedbackStatus={feedbackStatus}
                    />
                    {generateStepContent()}
                </div>
            </div>
        </LoadWrapper>
    );
};

Controller.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default Controller;
