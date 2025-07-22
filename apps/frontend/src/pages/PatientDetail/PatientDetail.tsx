import './PatientDetail.scss'

import { Patient, ReservedStep, RootStepFieldKeys } from '@3dp4me/types'
import { useEffect, useState } from 'react'
import { trackPromise } from 'react-promise-tracker'
import { useParams } from 'react-router-dom'
import swal from 'sweetalert'
import { StringParam, useQueryParam } from 'use-query-params'

import { deletePatientById, updatePatient, updateStage, uploadFile } from '../../api/api'
import LoadWrapper from '../../components/LoadWrapper/LoadWrapper'
import ManagePatientModal from '../../components/ManagePatientModal/ManagePatientModal'
import PatientDetailSidebar from '../../components/PatientDetailSidebar/PatientDetailSidebar'
import StepContent from '../../components/StepContent/StepContent'
import ToggleButtons from '../../components/ToggleButtons/ToggleButtons'
import { useErrorWrap } from '../../hooks/useErrorWrap'
import { useTranslations } from '../../hooks/useTranslations'
import { useInvalidatePatient, usePatient } from '../../query/usePatient'
import { useSteps } from '../../query/useSteps'
import { LANGUAGES, Routes } from '../../utils/constants'
import { getStepData } from '../../utils/metadataUtils'

/**
 * The detail view for a patient. Shows their information
 * for each step.
 */
const PatientDetail = () => {
    const errorWrap = useErrorWrap()
    const { patientId } = useParams<{ patientId: string }>()
    const [translations, selectedLang] = useTranslations()
    const [selectedStep, setSelectedStep] = useState('')
    const [isManagePatientModalOpen, setManagePatientModalOpen] = useState(false)
    const stepKeyParam = useQueryParam('stepKey', StringParam)[0]
    const [edit, setEdit] = useState(false)
    const {
        data: patientData,
        isLoading: isPatientLoading,
        isError: isPatientError,
    } = usePatient(patientId)
    const {
        data: stepMetaData,
        isLoading: areStepsLoading,
        isError: isStepsError,
    } = useSteps({
        includeHiddenFields: false,
        includeReservedSteps: true,
    })
    const invalidatePatient = useInvalidatePatient(patientId)
    const isError = isPatientError || isStepsError
    const isLoading = isPatientLoading || areStepsLoading

    /**
     * Fetch metadata for all steps and the patient's data.
     * Then sort it.
     */
    useEffect(() => {
        if (!stepMetaData) return
        if (stepMetaData.find((s) => s.key === selectedStep)) return

        if (stepKeyParam) {
            setSelectedStep(stepKeyParam)
            return
        }

        if (stepMetaData?.length) setSelectedStep(stepMetaData[0].key)
    }, [stepMetaData, stepKeyParam])

    /**
     * Called when the patient data for a step is saved
     * Submits to the backend and displays a message
     */
    const onStepSaved = async (stepKey: string, stepData: Record<string, any>) => {
        if (!patientData) return

        await updateStage(patientId, stepKey, stepData)
        invalidatePatient()
    }

    /**
     * Called when the patient data is submitted from the modal.dd
     * Submits to the backend and displays a message
     */
    const onPatientDataSaved = async (newPatientData: Patient) => {
        if (!patientData) return

        await updatePatient(patientId, newPatientData)
        swal(translations.components.swal.managePatient.successMsg, '', 'success')

        invalidatePatient()
        setManagePatientModalOpen(false)
    }

    const onUploadProfilePicture = async (file: File) => {
        await trackPromise(
            uploadFile(
                patientId,
                ReservedStep.Root,
                RootStepFieldKeys.ProfilePicture,
                file.name,
                file
            )
        )

        invalidatePatient()
    }

    const onPatientDeleted = async () => {
        errorWrap(
            async () => {
                setEdit(false)
                await trackPromise(deletePatientById(patientId))
                invalidatePatient()
            },
            () => {
                // Success - Go back to the home page
                window.location.href = '/'
            },
            () => {
                // Error while deleting patient
                swal(
                    translations.components.swal.patientDetail.errorTitle,
                    translations.components.swal.patientDetail.errorMessage,
                    'error'
                )
            }
        )
    }

    const displayUnsavedDataAlert = (newStep: string) => {
        swal({
            title: translations.components.swal.dataDiscarding.confirmationQuestion,
            buttons: [
                translations.components.swal.dataDiscarding.stay,
                translations.components.swal.dataDiscarding.leave,
            ],
        }).then((isLeaveConfirmed) => {
            if (isLeaveConfirmed) {
                switchStep(newStep)
            }
        })
    }

    const switchStep = (newStep: string) => {
        if (newStep === null) return
        setSelectedStep(newStep)
        setEdit(false)
        window.history.pushState({}, '', `${Routes.PATIENT_DETAIL}/${patientId}?stepKey=${newStep}`)
    }

    const onStepChange = (newStep: string) => {
        if (edit) {
            displayUnsavedDataAlert(newStep)
        } else {
            switchStep(newStep)
        }
    }

    /**
     * This generates the main content of this screen.
     * Renders all of the fields in the selected step
     */
    const generateStepContent = () => {
        if (!stepMetaData) return null
        if (!patientData) return null

        const className = selectedLang === LANGUAGES.AR ? 'steps steps-ar' : 'steps'

        return (
            <div className={className}>
                {stepMetaData.map((step) => {
                    if (step.key !== selectedStep) return null
                    if (Object.values(ReservedStep).includes(step.key as ReservedStep)) return null

                    return (
                        <StepContent
                            key={step.key}
                            patientId={patientId}
                            onDataSaved={onStepSaved}
                            metaData={stepMetaData.find((s) => s.key === step.key)!}
                            stepData={getStepData(patientData, step.key) ?? {}}
                            loading={isLoading}
                            edit={edit}
                            setEdit={setEdit}
                        />
                    )
                })}
            </div>
            //</div>
        )
    }

    if (isError) {
        return null
    }

    //changed
    return (
        <LoadWrapper loading={isLoading}>
            <div className="root">
                <ManagePatientModal
                    onDataSave={onPatientDataSaved}
                    onStepSave={onStepSaved}
                    patientData={patientData!}
                    stepMetadata={stepMetaData!}
                    isOpen={isManagePatientModalOpen}
                    onClose={() => setManagePatientModalOpen(false)}
                    onDeleted={onPatientDeleted}
                    onUploadProfilePicture={onUploadProfilePicture}
                />

                <div className="root">
                    <div className="sidebar">
                        <PatientDetailSidebar
                            patientData={patientData!}
                            onViewPatient={() => setManagePatientModalOpen(true)}
                        />
                    </div>

                    <div className="main-content">
                        <ToggleButtons
                            step={selectedStep}
                            patientData={patientData!}
                            handleStep={onStepChange}
                        />
                        {generateStepContent()}
                    </div>
                </div>
            </div>
        </LoadWrapper>
    )
}


export default PatientDetail

// Added inline style for Arabic language to shift content left to accommodate right sidebar
