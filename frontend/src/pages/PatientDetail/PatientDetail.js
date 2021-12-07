import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import swal from 'sweetalert';
import { StringParam, useQueryParam } from 'use-query-params';
import { trackPromise } from 'react-promise-tracker';

import {
    getAllStepsMetadata,
    getPatientById,
    updatePatient,
    updateStage,
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
    const [patientData, setPatientData] = useState(null);
    const [isManagePatientModalOpen, setManagePatientModalOpen] =
        useState(false);
    const stepKeyParam = useQueryParam('stepKey', StringParam)[0];
    const [edit, setEdit] = useState(false);
    // const [willChangeStep, setWillChangeStep] = useState(false);

    useEffect(() => {
        const determinePreventDefault = (e) => {
            // console.log(metaData.displayName);
            console.log(edit);
            // Check if any of the input fields are filled
            if (edit) {
                // Cancel the event and show alert that
                // the unsaved changes would be lost
                e.preventDefault();
                e.returnValue = '';
            }
        };
        console.log('hi');
        window.addEventListener('beforeunload', determinePreventDefault);
        return () =>
            window.removeEventListener('beforeunload', determinePreventDefault);
    }, [edit]);

    /**
     * Fetch metadata for all steps and the patient's data.
     * Then sort it.
     */
    useEffect(() => {
        const getData = async () => {
            errorWrap(async () => {
                // Step metadata
                let res = await trackPromise(getAllStepsMetadata(false));
                let metaData = res.result;

                // Patient data
                res = await trackPromise(getPatientById(patientId));
                const data = res.result;

                // Sort it
                metaData = sortMetadata(metaData);

                if (stepKeyParam) setSelectedStep(stepKeyParam);
                else if (metaData?.length) setSelectedStep(metaData[0].key);

                setStepMetaData(metaData);
                setPatientData(data);
                setLoading(false);
            });
        };

        getData();
    }, [setStepMetaData, setPatientData, setLoading, errorWrap, patientId]);

    /**
     * Called when the patient data for a step is saved
     * Submits to the backend and displays a message
     */
    const onStepSaved = (stepKey, stepData) => {
        errorWrap(async () => {
            const newPatientData = _.cloneDeep(patientData);
            newPatientData[stepKey] = _.cloneDeep(stepData);
            await trackPromise(updateStage(patientId, stepKey, stepData));
            setPatientData(newPatientData);
        });
    };

    /**
     * Called when the patient data is submitted from the modal.dd
     * Submits to the backend and displays a message
     */
    const onPatientDataSaved = async (newPatientData) => {
        const patientDataCopy = _.cloneDeep(patientData);
        Object.assign(patientDataCopy, newPatientData);
        await errorWrap(async () => {
            await trackPromise(updatePatient(patientId, patientDataCopy));
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

    // swal({
    //     title: translations.components.button.discard.question,
    //     text: translations.components.button.discard.warningMessage,
    //     icon: 'warning',
    //     dangerMode: true,
    //     buttons: [
    //         translations.components.button.discard.cancelButton,
    //         translations.components.button.discard.confirmButton,
    //     ],
    // }).then((isDeleteConfirmed) => {
    //     if (isDeleteConfirmed) {
    //         swal({
    //             title: translations.components.button.discard.success,
    //             icon: 'success',
    //             buttons: translations.components.button.discard.confirmButton,
    //         });
    //         // TODO: Nonexistent values don't get reset.
    //         setUpdatedData(_.cloneDeep(stepData));
    //         setEdit(false);
    //     }
    // });

    const onStepChange = (newStep) => {
        if (edit) {
            swal({
                title: 'You have unsaved changes. Do you want to leave this page?',
                buttons: ['Stay', 'Leave'],
            }).then((isLeaveConfirmed) => {
                console.log('here is result');
                /* Read more about isConfirmed, isDenied below */
                if (isLeaveConfirmed) {
                    if (newStep === null) return;
                    setSelectedStep(newStep);
                    setEdit(false);
                    window.history.pushState(
                        {},
                        '',
                        `${patientId}?stepKey=${newStep}`,
                    );
                }
            });
        } else {
            setSelectedStep(newStep);
            setEdit(false);
            window.history.pushState({}, '', `${patientId}?stepKey=${newStep}`);
        }
    };

    /**
     * This generates the main content of this screen.
     * Renders all of the fields in the selected step
     */
    const generateStepContent = () => {
        if (stepMetaData == null) return null;
        if (patientData == null) return null;

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
                            stepData={patientData[step.key] ?? {}}
                            loading={loading}
                            edit={edit}
                            setEdit={setEdit}
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
                    patientData={patientData}
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

export default PatientDetail;
