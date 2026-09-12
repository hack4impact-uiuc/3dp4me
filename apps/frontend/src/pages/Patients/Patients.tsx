import './Patients.scss'

import { Patient } from '@3dp4me/types'
import { useState } from 'react'

import PaginateBar from '../../components/PaginateBar/PaginateBar'
import PatientTable from '../../components/PatientTable/PatientTable'
import { SortConfig } from '../../hooks/useSortableData'
import { useTranslations } from '../../hooks/useTranslations'
import { useInvalidatePatients, usePatients } from '../../query/usePatients'
import {
    ALL_PATIENT_DASHBOARD_ROW_DATA,
    getPatientDashboardHeaders,
    PEOPLE_PER_PAGE,
    SERVER_SORTABLE_PATIENT_FIELDS,
    SortDirection,
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

    // Which column (if any) the full patient list is sorted by
    const [sortConfig, setSortConfig] = useState<SortConfig<Patient> | null>(null)

    const invalidatePatients = useInvalidatePatients()
    const { data: patients, isLoading } = usePatients({
        page: selectedPageNumber,
        limit: PEOPLE_PER_PAGE,
        query: searchQuery,
        sortBy: sortConfig?.key as string | undefined,
        sortOrder: sortConfig?.direction === SortDirection.Ascending ? 'asc' : 'desc',
    })

    /**
     * Cycles the sort direction for a column: ascending -> descending -> default.
     * Only columns backed directly by the Patient collection can be sorted server-side.
     */
    const onRequestSort = (key: string) => {
        if (!SERVER_SORTABLE_PATIENT_FIELDS.includes(key)) return

        let direction = SortDirection.Ascending
        if (sortConfig?.key === key && sortConfig.direction === SortDirection.Ascending)
            direction = SortDirection.Descending
        else if (sortConfig?.key === key && sortConfig.direction === SortDirection.Descending) {
            setSortConfig(null)
            setSelectedPageNumber(1)
            return
        }

        setSortConfig({ key, direction } as SortConfig<Patient>)
        setSelectedPageNumber(1)
    }

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
        <div>
            <div className="patient-list">
                <PatientTable
                    onAddPatient={onAddPatient}
                    tableTitle={translations.components.navbar.patients.pageTitle}
                    headers={getPatientDashboardHeaders(selectedLang)}
                    rowData={ALL_PATIENT_DASHBOARD_ROW_DATA}
                    patients={allPatients}
                    handleSearchQuery={onSearchQueryChanged}
                    initialSearchQuery={searchQuery}
                    isLoading={isLoading}
                    stepKey={''}
                    sortConfig={sortConfig}
                    onRequestSort={onRequestSort}
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
