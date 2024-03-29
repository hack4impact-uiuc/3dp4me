import './Dashboard.scss'

import { Field, Nullish, Patient, Step } from '@3dp4me/types'
import { Snackbar, SnackbarCloseReason } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { trackPromise } from 'react-promise-tracker'

import { getAllStepsMetadata, getPatientsByStageAndPageNumberAndSearch } from '../../api/api'
import PaginateBar from '../../components/PaginateBar/PaginateBar'
import PatientTable from '../../components/PatientTable/PatientTable'
import ToggleButtons from '../../components/ToggleButtons/ToggleButtons'
import { useErrorWrap } from '../../hooks/useErrorWrap'
import { useTranslations } from '../../hooks/useTranslations'
import {
    DisplayFieldType,
    getStepDashboardHeaders,
    PATIENTS_BY_STEP_TABLE_ROW_DATA,
    PEOPLE_PER_PAGE,
} from '../../utils/constants'
import { ColumnMetadata, Header } from '../../utils/table-renderers'
import { sortMetadata } from '../../utils/utils'

const CLOSE_REASON_CLICKAWAY = 'clickaway'

/**
 * Shows a table of active patients, with a different table for each step
 */
const Dashboard = () => {
    const errorWrap = useErrorWrap()
    const [translations, selectedLang] = useTranslations()

    // All patients for the selected step
    const [patients, setPatients] = useState<Patient[]>([])

    // The metadata for all steps
    const [stepsMetaData, setStepsMetaData] = useState<Nullish<Step[]>>(null)

    // Currently selected step
    const [selectedStep, setSelectedStep] = useState('')

    // Currently selected page
    const [selectedPageNumber, setSelectedPageNumber] = useState(1)

    // Number of total patients in the database
    const [patientsCount, setPatientsCount] = useState(0)

    // Words to filter out patients by
    const [searchQuery, setSearchQuery] = useState('')

    const [isSnackbarOpen, setSnackbarOpen] = useState(false)

    /**
     * Gets patient data based on page number and step
     */

    const loadPatientData = async (stepKey: string, pageNumber: number, query: string) => {
        const res = await trackPromise(
            getPatientsByStageAndPageNumberAndSearch(stepKey, pageNumber, PEOPLE_PER_PAGE, query)
        )
        setPatients(res.result.data)
        setPatientsCount(res.result.count)

        if (res.result.data.length === 0) {
            setSnackbarOpen(true)
        }
    }

    /**
     * Gets metadata for all setps
     */
    useEffect(() => {
        /**
         * Gets metadata for all steps, only called once
         */
        const loadMetadataAndPatientData = async () => {
            const res = await trackPromise(getAllStepsMetadata(false))

            const metaData = sortMetadata(res.result)
            setStepsMetaData(metaData)
            if (metaData.length > 0) {
                setSelectedStep(metaData[0].key)
                await loadPatientData(metaData[0].key, 1, '')
            } else {
                throw new Error(translations.errors.noMetadata)
            }
        }

        const loadAllDashboardData = async () => {
            errorWrap(async () => {
                await loadMetadataAndPatientData()
            })
        }

        loadAllDashboardData()
    }, [translations, setSelectedStep, setStepsMetaData, errorWrap])

    /**
     * Called when a patient is successfully added to the backend
     * @param {Object} patientData The patient data (returned from server)
     */
    const onAddPatient = (patientData: Patient) => {
        setPatients((oldPatients) => oldPatients.concat(patientData))
    }

    /**
     * Called when the user selects a new step to view. Sets the step
     * and refetches patient data for this step
     */
    const onStepSelected = async (stepKey: string) => {
        if (!stepKey) return

        // TODO: Put the patient data in a store
        setSelectedStep(stepKey)

        errorWrap(async () => {
            await loadPatientData(stepKey, selectedPageNumber, searchQuery)
        })
    }

    const onPageNumberChanged = async (newPageNumber: number) => {
        if (selectedStep === '') return

        setSelectedPageNumber(newPageNumber)

        errorWrap(async () => {
            await loadPatientData(selectedStep, newPageNumber, searchQuery)
        })
    }

    const onSearchQueryChanged = (newSearchQuery: string) => {
        setSearchQuery(newSearchQuery)

        // The page number needs to be updated because the search query might filter the patient data
        // such that there aren't as many pages as the one the user is currently on.
        setSelectedPageNumber(1)

        errorWrap(async () => {
            await loadPatientData(selectedStep, 1, newSearchQuery)
        })
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
        headers.push({
            title: translations.tableHeaders.status,
            sortKey: `${stepKey}.status`,
        })

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
        rowData.push({
            id: `${stepKey}.status`,
            dataType: DisplayFieldType.STEP_STATUS,
        } as any)

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

    if (!stepsMetaData) return null

    return (
        <div className="dashboard">
            <div className="tabs">
                <ToggleButtons
                    step={selectedStep}
                    metaData={stepsMetaData}
                    handleStep={onStepSelected}
                />
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
