import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import './PatientDetail.scss';
import { useParams } from 'react-router-dom';
import swal from 'sweetalert';

import StepContent from '../../components/StepContent/StepContent';
import ToggleButtons from '../../components/ToggleButtons/ToggleButtons';
import ManagePatientModal from '../../components/ManagePatientModal/ManagePatientModal';
import {
    downloadBlobWithoutSaving,
    getAllStepsMetadata,
    getPatientById,
    updatePatient,
    updateStage,
} from '../../api/api';
import LoadWrapper from '../../components/LoadWrapper/LoadWrapper';
import { sortMetadata } from '../../utils/utils';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import { useTranslations } from '../../hooks/useTranslations';
import { LANGUAGES } from '../../utils/constants';
import PatientDetailSidebar from '../../components/PatientDetailSidebar/PatientDetailSidebar';

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

                // Patient data with photo uris
                const updatedData = await updateMetaDataPhotos(metaData, data);

                setStepMetaData(metaData);
                setPatientData(updatedData);
                setLoading(false);

            });
        };

        getData();
    }, [setStepMetaData, setPatientData, setLoading, errorWrap, patientId]);

    const updateMetaDataPhotos = async (metaData, data) => {
        const newPatientData = _.cloneDeep(data);
        let photoPromises = [];

        metaData.map( async step => {
            photoPromises = photoPromises.concat(step.fields.map(async field => {
                if (field.fieldType === "Photo") {
                    const photoData = newPatientData[step.key][field.key];
                    const newPhotoData = await convertPhotosToURI(photoData, step.key, field.key);

                    newPatientData[step.key][field.key] = newPhotoData;
                } 
            }))
        });
        await Promise.all(photoPromises);
        return newPatientData;
    }

    const convertPhotosToURI = async (photoData, stepKey, fieldKey) => {
        const newPhotoData = photoData.map(async photoObj => 
            {
                let modifiedPhotoObj = photoObj;
                modifiedPhotoObj.uri = await photoToURI(photoObj, stepKey, fieldKey);
                return modifiedPhotoObj;
            }
        );

        return await Promise.all(newPhotoData);
    }

    const photoToURI = async (photoObj, stepKey, fieldKey) => {
        const blob = await downloadBlobWithoutSaving(patientId,stepKey,fieldKey,photoObj.filename);
        const uri = await blobToDataURL(blob);
        return uri;
    }

    const blobToDataURL = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.onabort = () => reject(new Error("Read aborted"));
            reader.readAsDataURL(blob);
        });
    }

    /**
     * Called when the patient data for a step is saved
     * Submits to the backend and displays a message
     */
    const onStepSaved = (stepKey, stepData) => {
        errorWrap(async () => {
            const newPatientData = _.cloneDeep(patientData);
            newPatientData[stepKey] = _.cloneDeep(stepData);
            await updateStage(patientId, stepKey, stepData);
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
