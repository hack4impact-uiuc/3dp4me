/* eslint no-param-reassign: "warn" */
import React, { useEffect, useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import _ from 'lodash';
import './Controller.scss';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
} from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import swal from 'sweetalert';

import StepContent from '../StepContent/StepContent';
import ToggleButtons from '../../components/ToggleButtons/ToggleButtons';
import ManagePatientModal from '../../components/ManagePatientModal/ManagePatientModal';
import {
    getAllStepsMetadata,
    getPatientById,
    updatePatient,
    updateStage,
} from '../../utils/api';
import LoadWrapper from '../../components/LoadWrapper/LoadWrapper';
import { getPatientName } from '../../utils/utils';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import { useTranslations } from '../../hooks/useTranslations';
import { LANGUAGES } from '../../utils/constants';

const theme = createMuiTheme({
    direction: 'rtl',
});

const Controller = () => {
    const [translations, selectedLang] = useTranslations();
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(true);
    const errorWrap = useErrorWrap();

    const [selectedStep, setSelectedStep] = useState(null);
    const [stepMetaData, setStepMetaData] = useState(null);
    const [patientData, setPatientData] = useState(null);
    const [isManagePatientModalOpen, setManagePatientModalOpen] = useState(
        false,
    );

    const params = useParams();
    const { patientId } = params;

    const handleNotePanel = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const onStepSaved = (stepKey, stepData) => {
        errorWrap(async () => {
            const newPatientData = _.cloneDeep(patientData);
            newPatientData[stepKey] = _.cloneDeep(stepData);
            await updateStage(patientId, stepKey, stepData);
            setPatientData(newPatientData);
        });
    };

    const onPatientDataSaved = async (newPatientData) => {
        const patientDataCopy = _.cloneDeep(patientData);
        Object.assign(patientDataCopy, newPatientData);
        await errorWrap(async () => {
            await updatePatient(patientId, patientDataCopy);
            setPatientData(patientDataCopy);
            swal(
                translations.components.swal.managePatient.successMsg,
                '',
                'success',
            );
        });

        setManagePatientModalOpen(false);
    };

    /**
     * Gets the current patient model data. (Removes all of the step data)
     */
    const getCurrentPatientModelData = () => {
        return {
            firstName: patientData?.firstName,
            familyName: patientData?.familyName,
            fathersName: patientData?.fathersName,
            grandfathersName: patientData?.grandfathersName,
            orderId: patientData?.orderId,
            status: patientData?.status,
        };
    };

    const onStepChange = (newStep) => {
        if (newStep === null) return;

        setSelectedStep(newStep);
    };

    useEffect(() => {
        const getData = async () => {
            errorWrap(async () => {
                let res = await getAllStepsMetadata();
                let metaData = res.result;

                res = await getPatientById(patientId);
                const data = res.result;

                metaData = metaData.sort((a, b) => a.stepNumber - b.stepNumber);
                metaData.forEach((stepData) => {
                    stepData.fields = stepData.fields.sort(
                        (a, b) => a.fieldNumber - b.fieldNumber,
                    );

                    stepData.fields.forEach((field) => {
                        if (!field.options?.length) return;

                        field.options = field.options.sort(
                            (a, b) => a.Index - b.Index,
                        );
                    });
                });

                if (metaData.length > 0) setSelectedStep(metaData[0].key);

                setStepMetaData(metaData);
                setPatientData(data);
                setLoading(false);
            });
        };

        getData();
    }, [setStepMetaData, setPatientData, setLoading, errorWrap, patientId]);

    const generateStepContent = () => {
        if (stepMetaData == null) return null;
        if (patientData == null) return null;

        return (
            <div
                className={`steps ${
                    selectedLang === LANGUAGES.AR ? 'steps-ar' : ''
                }`}
            >
                {stepMetaData.map((step) => {
                    if (step.key === selectedStep) {
                        return (
                            <StepContent
                                patientId={patientId}
                                onDataSaved={onStepSaved}
                                metaData={stepMetaData.find(
                                    (s) => s.key === step.key,
                                )}
                                stepData={patientData[step.key] ?? {}}
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

                    if (patientData[metaData.key]?.notes == null) return null;

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
                                {metaData.displayName[selectedLang]}
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
                <ManagePatientModal
                    onDataSave={onPatientDataSaved}
                    patientData={getCurrentPatientModelData()}
                    isOpen={isManagePatientModalOpen}
                    onClose={() => setManagePatientModalOpen(false)}
                />
                <ThemeProvider
                    theme={selectedLang === LANGUAGES.AR ? theme : null}
                >
                    <Drawer
                        className={
                            selectedLang === LANGUAGES.EN
                                ? 'drawer'
                                : 'drawer-rtl'
                        }
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
                                        {translations.components.sidebar.name}
                                    </span>{' '}
                                    <br />
                                    <span className="drawer-text">
                                        {getPatientName(patientData)}
                                    </span>
                                </div>
                                <div className="drawer-text-section">
                                    <span className="drawer-text-label">
                                        {
                                            translations.components.sidebar
                                                .orderID
                                        }
                                    </span>{' '}
                                    <br />
                                    <span className="drawer-text">
                                        {patientData?.orderId}
                                    </span>
                                </div>
                                <div className="drawer-text-section">
                                    <span className="drawer-text-label">
                                        {translations.components.sidebar.status}
                                    </span>{' '}
                                    <br />
                                    <span className="drawer-text">
                                        {patientData?.status}
                                    </span>
                                </div>
                                <span className="drawer-text-label">
                                    {translations.components.notes.title}
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
                                    onClick={() =>
                                        setManagePatientModalOpen(true)
                                    }
                                    className="manage-patient-button"
                                >
                                    {
                                        translations.components.button
                                            .managePatient
                                    }
                                </Button>
                            </div>
                        </div>
                    </Drawer>
                </ThemeProvider>

                <div
                    className={`controller-content ${
                        selectedLang === LANGUAGES.AR
                            ? 'controller-content-ar'
                            : ''
                    }`}
                >
                    <ToggleButtons
                        step={selectedStep}
                        patientData={patientData}
                        metaData={stepMetaData}
                        handleStep={onStepChange}
                    />
                    {generateStepContent()}
                </div>
            </div>
        </LoadWrapper>
    );
};

export default Controller;
