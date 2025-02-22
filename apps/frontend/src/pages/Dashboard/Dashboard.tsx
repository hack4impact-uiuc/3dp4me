import './Dashboard.scss'

import { Field, Patient } from '@3dp4me/types'
import type { SnackbarCloseReason } from '@mui/material/Snackbar'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import _ from 'lodash'
import { useEffect, useState } from 'react'

import PaginateBar from '../../components/PaginateBar/PaginateBar'
import PatientTable from '../../components/PatientTable/PatientTable'
import ToggleButtons from '../../components/ToggleButtons/ToggleButtons'
import { useSetError } from '../../hooks/uesSetError'
import { useTranslations } from '../../hooks/useTranslations'
import { useInvalidatePatients, usePatients } from '../../query/usePatients'
import { useSteps } from '../../query/useSteps'
import {
    DISABLE_FEATURE_PATIENT_STATUS,
    DisplayFieldType,
    getStepDashboardHeaders,
    PATIENTS_BY_STEP_TABLE_ROW_DATA,
    PEOPLE_PER_PAGE,
} from '../../utils/constants'
import { ColumnMetadata, Header } from '../../utils/table-renderers'

const CLOSE_REASON_CLICKAWAY = 'clickaway'

/**
 * Shows a table of active patients, with a different table for each step
 */
const Dashboard = () => {
    const setError = useSetError()
    const [translations, selectedLang] = useTranslations()

    // The metadata for all steps
    const {
        data: stepsMetaData,
        isLoading: areStepsLoading,
        isError: isStepsError,
    } = useSteps({
        includeHiddenFields: false,
    })

    // Controls toast that says "no patients found"
    const [isSnackbarOpen, setSnackbarOpen] = useState(false)

    // Currently selected step
    const [selectedStep, setSelectedStep] = useState('')

    // Currently selected page
    const [selectedPageNumber, setSelectedPageNumber] = useState(1)

    // Words to filter out patients by
    const [searchQuery, setSearchQuery] = useState('')
    const invalidatePatients = useInvalidatePatients()
    const {
        data: patientsData,
        isLoading: arePatientsLoading,
        isError: isPatientsError,
    } = usePatients({
        stepKey: selectedStep,
        page: selectedPageNumber,
        limit: PEOPLE_PER_PAGE,
        query: searchQuery,
    })

    const patients = patientsData?.data || []
    const patientsCount = patientsData?.count || 0
    const isLoading = arePatientsLoading || areStepsLoading || selectedStep === ''
    const isError = isPatientsError || isStepsError

    useEffect(() => {
        if (!isLoading && patientsCount === 0) setSnackbarOpen(true)
    }, [patientsCount, isLoading])

    /**
     * Gets metadata for all setps
     */
    useEffect(() => {
        if (areStepsLoading) return

        if (!stepsMetaData || stepsMetaData.length === 0) {
            setError(translations.errors.noMetadata)
            return
        }

        if (stepsMetaData?.find((s) => s.key === selectedStep)) {
            return
        }

        setSelectedStep(stepsMetaData[0].key)
    }, [translations, setSelectedStep, stepsMetaData, areStepsLoading])

    /**
     * Called when a patient is successfully added to the backend
     * @param {Object} patientData The patient data (returned from server)
     */
    const onAddPatient = () => {
        invalidatePatients()
    }

    /**
     * Called when the user selects a new step to view. Sets the step
     * and refetches patient data for this step
     */
    const onStepSelected = async (stepKey: string) => {
        if (!stepKey) return
        setSelectedStep(stepKey)
    }

    const onPageNumberChanged = async (newPageNumber: number) => {
        if (selectedStep === '') return

        setSelectedPageNumber(newPageNumber)
    }

    const onSearchQueryChanged = (newSearchQuery: string) => {
        setSearchQuery(newSearchQuery)

        // The page number needs to be updated because the search query might filter the patient data
        // such that there aren't as many pages as the one the user is currently on.
        setSelectedPageNumber(1)
    }

    /**
     * Gets the display name of the currently selected step
     */
    function getTableTitle() {
        if (stepsMetaData == null) return translations.components.table.loading

        for (let i = 0; i < stepsMetaData?.length; i++) {
            if (selectedStep === stepsMetaData[i].key)
                return stepsMetaData[i].displayName[selectedLang]
        }

        console.error(`Unrecognized step: ${selectedStep}`)
        return `Unnamed Step`
    }

    /**
     * Generates headers for a step table. Goes through each field in the step and checks
     * if it should be visible on the dashboard. If so, adds to headers.
     * @returns Array of headers
     */
    function generateHeaders(stepKey: string, fields: Field[]): Header<Patient>[] {
        if (fields == null) return []

        const headers = getStepDashboardHeaders(selectedLang)

        // Have to push this at runtime because we don't know the stepKey ahead
        if (!DISABLE_FEATURE_PATIENT_STATUS) {
            headers.push({
                title: translations.tableHeaders.status,
                sortKey: `${stepKey}.status`,
            })
        }

        fields.forEach((field) => {
            if (field.isVisibleOnDashboard)
                headers.push({
                    title: field.displayName[selectedLang],
                    sortKey: `${stepKey}.${field.key}`,
                })
        })

        return headers as any
    }

    /**
     * Generates row data for a step table. Goes through each field in the step and checks
     * if it should be visible on the dashboard. If so, adds to row data.
     * @returns Array of row data
     */
    function generateRowData(stepKey: string, fields: Field[]): ColumnMetadata<Patient>[] {
        if (fields == null) return []

        const rowData = _.cloneDeep(PATIENTS_BY_STEP_TABLE_ROW_DATA)

        if (!DISABLE_FEATURE_PATIENT_STATUS) {
            rowData.push({
                id: `${stepKey}.status`,
                dataType: DisplayFieldType.STEP_STATUS,
            } as any)
        }

        fields.forEach((field) => {
            if (field.isVisibleOnDashboard)
                rowData.push({
                    id: `${stepKey}.${field?.key}`,
                    dataType: field?.fieldType,
                } as any)
        })

        return rowData
    }

    /**
     * Generates the table for the selected step
     */
    function generateMainTable() {
        if (stepsMetaData == null) return null

        return stepsMetaData.map((element) => {
            if (selectedStep !== element.key) return null

            return (
                <PatientTable
                    isLoading={isLoading}
                    onAddPatient={onAddPatient}
                    key={`table-${element.key}`}
                    tableTitle={getTableTitle()}
                    headers={generateHeaders(element.key, element.fields)}
                    rowData={generateRowData(element.key, element.fields)}
                    patients={patients}
                    handleSearchQuery={onSearchQueryChanged}
                    initialSearchQuery={searchQuery}
                    stepKey={selectedStep}
                />
            )
        })
    }

    /**
     * Only close snackbar if the 'x' button is pressed
     */
    const onCloseSnackbar = (reason: SnackbarCloseReason) => {
        if (reason === CLOSE_REASON_CLICKAWAY) return
        setSnackbarOpen(false)
    }

    if (!stepsMetaData || isError) return null

    return (
        <div className="dashboard">
            <div className="tabs">
                <ToggleButtons step={selectedStep} handleStep={onStepSelected} />
            </div>
            <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={3000}
                onClose={(_, reason) => onCloseSnackbar(reason)}
            >
                <MuiAlert
                    onClose={() => onCloseSnackbar('timeout')}
                    severity="error"
                    elevation={6}
                    variant="filled"
                >
                    {translations.components.table.noPatientsFound}
                </MuiAlert>
            </Snackbar>
            <div className="patient-list">{generateMainTable()}</div>
            <PaginateBar
                pageCount={Math.ceil(patientsCount / PEOPLE_PER_PAGE)}
                onPageChange={onPageNumberChanged}
                currentPage={selectedPageNumber - 1}
            />
        </div>
    )
}

export default Dashboard
