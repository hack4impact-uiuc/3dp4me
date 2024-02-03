import './Patients.scss'

import { useState } from 'react'

import PaginateBar from '../../components/PaginateBar/PaginateBar'
import PatientTable from '../../components/PatientTable/PatientTable'
import { useTranslations } from '../../hooks/useTranslations'
import { useInvalidatePatients, usePatients } from '../../query/usePatients'
import {
    ALL_PATIENT_DASHBOARD_ROW_DATA,
    getPatientDashboardHeaders,
    PEOPLE_PER_PAGE,
} from '../../utils/constants'

/**
 * Shows a table of all patients within the system
 */
const Patients = () => {
    const [translations, selectedLang] = useTranslations()
    // Currently selected page
    const [selectedPageNumber, setSelectedPageNumber] = useState(1)

    // Words to filter out patients by
    const [searchQuery, setSearchQuery] = useState('')

    const invalidatePatients = useInvalidatePatients()
    const { data: patients } = usePatients({
        page: selectedPageNumber,
        limit: PEOPLE_PER_PAGE,
        query: searchQuery,
    })

    const allPatients = patients?.data || []
    const patientsCount = patients?.count || 0

    const updatePage = async (newPage: number) => {
        setSelectedPageNumber(newPage)
    }

    const onSearchQueryChanged = (newSearchQuery: string) => {
        setSearchQuery(newSearchQuery)

        // The page number needs to be updated because the search query might filter the patient data
        // such that there aren't as many pages as the one the user is currently on.
        setSelectedPageNumber(1)
    }

    /**
     * Called when a patient is successfully added to the backend
     */
    const onAddPatient = () => {
        invalidatePatients()
    }

    return (
        <div className="dashboard">
            <div className="patient-list">
                <PatientTable
                    onAddPatient={onAddPatient}
                    tableTitle={translations.components.navbar.patients.pageTitle}
                    headers={getPatientDashboardHeaders(selectedLang)}
                    rowData={ALL_PATIENT_DASHBOARD_ROW_DATA}
                    patients={allPatients}
                    handleSearchQuery={onSearchQueryChanged}
                    initialSearchQuery={searchQuery}
                    stepKey={''}
                />

                <PaginateBar
                    pageCount={Math.ceil(patientsCount / PEOPLE_PER_PAGE)}
                    onPageChange={updatePage}
                    currentPage={selectedPageNumber - 1}
                />
            </div>
        </div>
    )
}

export default Patients
