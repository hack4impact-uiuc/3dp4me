import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import swal from 'sweetalert';
import {
    getAllStepsMetadata,
    getPatientById,
    updatePatient,
    updateStage
} from '../../api/api';
import LoadWrapper from '../../components/LoadWrapper/LoadWrapper';
import ManagePatientModal from '../../components/ManagePatientModal/ManagePatientModal';
import PatientDetailSidebar from '../../components/PatientDetailSidebar/PatientDetailSidebar';
import StepContent from '../../components/StepContent/StepContent';
import ToggleButtons from '../../components/ToggleButtons/ToggleButtons';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import { useTranslations } from '../../hooks/useTranslations';
import { LANGUAGES } from '../../utils/constants';
import { sortMetadata } from '../../utils/utils';
import './PatientDetail.scss';


/**
 * The detail view for a patient. Shows their information
 * for each step.
 */
const PatientDetail = () => {
    const errorWrap = useErrorWrap();
    const params = useParams();
    const { patientId } = params;
    const [translations, selectedLang] = useTranslations();
    const [loading, setLoading] = useState(true);
    const [selectedStep, setSelectedStep] = useState('');
    const [stepMetaData, setStepMetaData] = useState(null);
    const [remotePatientData, setRemotePatientData] = useState(null);
    const [localPatientData, setLocalPatientData] = useState(null);
    const [isManagePatientModalOpen, setManagePatientModalOpen] =
        useState(false);

    /**
     * Fetch metadata for all steps and the patient's data.
     * Then sort it.
     */
    useEffect(() => {
        const getData = async () => {
            errorWrap(async () => {
                // Step metadata
                let res = await getAllStepsMetadata();
                let metaData = res.result;

                // Patient data
                res = await getPatientById(patientId);
                const data = res.result;

                // Sort it
                metaData = sortMetadata(metaData);
                if (metaData.length > 0) setSelectedStep(metaData[0].key);

                // Store it
                setStepMetaData(metaData);
                setRemotePatientData(data);
                setLoading(false);
            });
        };

        getData();
    }, [setStepMetaData, setRemotePatientData, setLoading, errorWrap, patientId]);

    /**
     * Called when the patient data for a step is saved
     * Submits to the backend and displays a message
     */
    const onStepSaved = (stepKey, stepData) => {
        errorWrap(async () => {
            const newPatientData = _.cloneDeep(remotePatientData);
            newPatientData[stepKey] = _.cloneDeep(stepData);
            await updateStage(patientId, stepKey, stepData);
            setRemotePatientData(newPatientData);
        });
    };

    /**
     * Called when the patient data is submitted from the modal.dd
     * Submits to the backend and displays a message
     */
    const onPatientDataSaved = async (newPatientData) => {
        const remotePatientDataCopy = _.cloneDeep(remotePatientData);
        Object.assign(remotePatientDataCopy, newPatientData);
        await errorWrap(async () => {
            await updatePatient(patientId, remotePatientDataCopy);
            setRemotePatientData(remotePatientDataCopy);
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
            firstName: remotePatientData?.firstName,
            familyName: remotePatientData?.familyName,
            fathersName: remotePatientData?.fathersName,
            grandfathersName: remotePatientData?.grandfathersName,
            orderId: remotePatientData?.orderId,
            status: remotePatientData?.status,
        };
    };

    const onStepChange = (newStep) => {
        if (newStep === null) return;

        setSelectedStep(newStep);
    };

    /**
     * This generates the main content of this screen.
     * Renders all of the fields in the selected step
     */
    const generateStepContent = () => {
        if (stepMetaData == null) return null;
        if (remotePatientData == null) return null;

        const className =
            selectedLang === LANGUAGES.AR ? 'steps steps-ar' : 'steps';

        return (
            <div className={className}>
                {stepMetaData.map((step) => {
                    if (step.key !== selectedStep) return null;

                    return (
                        <StepContent
                            key={step.key}
                            patientId={patientId}
                            onDataSaved={onStepSaved}
                            metaData={stepMetaData.find(
                                (s) => s.key === step.key,
                            )}
                            stepData={remotePatientData[step.key] ?? {}}
                            loading={loading}
                        />
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

                <PatientDetailSidebar
                    stepMetaData={stepMetaData}
                    patientData={remotePatientData}
                    onViewPatient={() => setManagePatientModalOpen(true)}
                />

                <div
                    className={`controller-content ${
                        selectedLang === LANGUAGES.AR
                            ? 'controller-content-ar'
                            : ''
                    }`}
                >
                    <ToggleButtons
                        step={selectedStep}
                        patientData={remotePatientData}
                        metaData={stepMetaData}
                        handleStep={onStepChange}
                    />
                    {generateStepContent()}
                </div>
            </div>
        </LoadWrapper>
    );
};

export default PatientDetail;
