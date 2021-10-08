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



    // TODO: 

    // stepData
    // get photo array of names
    // map through and add to each object a uri
    // pass in that array all the way down to photofield as a prop (don't need this bc modify ref)
    // value.uri and get them into the array formatted
    // use value and displayName props 
    // original and thumbnail sizing 

    // future consideration: delete photo and confirm taking photo/pop up for take photo button + css

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
                // console.log(metaData);
                // console.log(data);


                // iterate through 

                const updatedData = await updateMetaDataPhotos(metaData, data);

                // console.log(updatedData);


                // Store it
                setStepMetaData(metaData);
                setPatientData(updatedData);
                setLoading(false);

            });
        };

        getData();
    }, [setStepMetaData, setPatientData, setLoading, errorWrap, patientId]);

    // questions:
    // modify whole patientData or just new arrays for photos? Don't do newMetaData right?
    // do we add anything to dependency array for useEffect such as functions below? Should these functions go inside the useEffect?
    // why am I getting issues when using await
    // commit .DS_Store?

    const updateMetaDataPhotos = async (metaData, data) => {
        // create copy of patient data
        const newPatientData = _.cloneDeep(data);

        // loop through steps
        for (let i = 0; i < metaData.length; i++) {
            const step = metaData[i];
            // loop through fields of each step
            for (let j = 0; j < step.fields.length; j++) {
                // when photo field is found, modify patient's data at that step and field 
                if (step.fields[j].fieldType === "Photo") {
                    const photoData = newPatientData[step.key][step.fields[j].key];
                    // get the photoData
                    const newPhotoData = await convertPhotosToURI(photoData, step.key, step.fields[j].key);

                    //resolving promises one by one

                    newPatientData[step.key][step.fields[j].key] = newPhotoData;
                    // await Promise.all(newPhotoData);


                    
                }
            }


        }
        return newPatientData;
    }

    const convertPhotosToURI = async (photoData, stepKey, fieldKey) => {
        const newPhotoData = photoData.map(async photoObj => 
            {
                // const blob = downloadBlobWithoutSaving(patientId,stepKey,fieldKey,photoObj.fileName,);
                // console.log(blob);
                // const urlCreator = window.URL || window.webkitURL; 
                // const imageUrl = urlCreator.createObjectURL(blob); 
                // photoObj.uri = "https://picsum.photos/id/1018/500/300/";
                photoObj.uri = await photoToURI(photoObj, stepKey, fieldKey);
                return photoObj;
            }
        );

        const log = await Promise.all(newPhotoData);
        console.log(log);
        return log;
        // console.log("hi");
        // console.log(newPhotoData);
        // return newPhotoData;
    }

    //this should've been filename not fileName
const photoToURI = async (photoObj, stepKey, fieldKey) => {
    const blob = await downloadBlobWithoutSaving(patientId,stepKey,fieldKey,photoObj.filename,);
    console.log(photoObj.fileName);
    const uri = await blobToDataURL(blob);
    return uri;
}

const blobToDataURL = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = _e => resolve(reader.result);
    reader.onerror = _e => reject(reader.error);
    reader.onabort = _e => reject(new Error("Read aborted"));
    reader.readAsDataURL(blob);
  });
}




// const convertPhotosToURIs = async (....) => {
//     const URIs = photoData.map(photoObj => photoToURI(photoObj));
//     await Promise.all(URIs)
// }

    

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
