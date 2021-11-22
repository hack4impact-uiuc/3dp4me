import React, { useEffect, useState } from 'react';

import {
    getPatientsCount,
    getPatientsByPageNumberAndSearch,
} from '../../api/api';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import { useTranslations } from '../../hooks/useTranslations';
import PatientTable from '../../components/PatientTable/PatientTable';
import {
    getPatientDashboardHeaders,
    ALL_PATIENT_DASHBOARD_ROW_DATA,
    PEOPLE_PER_PAGE,
} from '../../utils/constants';
import './Patients.scss';
import PaginateBar from '../../components/PaginateBar/PaginateBar';

/**
 * Shows a table of all patients within the system
 */
const Patients = () => {
    const [translations, selectedLang] = useTranslations();
    const [allPatients, setAllPatients] = useState([]);
    const [patientsCount, setPatientsCount] = useState(0);

    // Currently selected page
    const [selectedPageNumber, setSelectedPageNumber] = useState(1);

    // Words to filter out patients by
    const [searchQuery, setSearchQuery] = useState('');

    const errorWrap = useErrorWrap();

    const loadPatientData = async (pageNumber, searchBy) => {
        const res = await getPatientsByPageNumberAndSearch(
            pageNumber,
            PEOPLE_PER_PAGE,
            searchBy,
        );
        setAllPatients(res.result.data);
        setPatientsCount(res.result.count);
    };

    const updatePage = async (newPage) => {
        setSelectedPageNumber(newPage);

        errorWrap(async () => {
            loadPatientData(newPage, searchQuery);
        });
    };

    const onSearchQueryChanged = (newSearchQuery) => {
        setSearchQuery(newSearchQuery);

        // The page number needs to be updated because the search query might filter the patient data
        // such that there aren't as many pages as the one the user is currently on.
        setSelectedPageNumber(1);

        errorWrap(async () => {
            loadPatientData(1, newSearchQuery);
        });
    };

    /**
     * Fetch data on all patients
     */
    useEffect(() => {
        const getInitialPage = async () => {
            errorWrap(async () => {
                // page number starts at 1
                const res = await getPatientsByPageNumberAndSearch(
                    1,
                    PEOPLE_PER_PAGE,
                );
                setAllPatients(res.result.data);
                setPatientsCount(res.result.count);
            });
        };

        const getCount = async () => {
            errorWrap(async () => {
                const res = await getPatientsCount();

                setPatientsCount(res.result);
                getInitialPage();
            });
        };

        getCount();
    }, [setPatientsCount, setAllPatients, errorWrap]);

    /**
     * Called when a patient is successfully added to the backend
     * @param {Object} patientData The patient data (returned from server)
     */
    const onAddPatient = (patientData) => {
        setAllPatients((oldPatients) => oldPatients.concat(patientData));
    };

    return (
        <div className="dashboard">
            <div className="patient-list">
                <PatientTable
                    onAddPatient={onAddPatient}
                    tableTitle={
                        translations.components.navbar.patients.pageTitle
                    }
                    headers={getPatientDashboardHeaders(selectedLang)}
                    rowData={ALL_PATIENT_DASHBOARD_ROW_DATA}
                    patients={allPatients}
                    handleSearchQuery={onSearchQueryChanged}
                    initialSearchQuery={searchQuery}
                />

                <PaginateBar
                    pageCount={Math.ceil(patientsCount / PEOPLE_PER_PAGE, 10)}
                    onPageChange={updatePage}
                    currentPage={selectedPageNumber - 1}
                />
            </div>
        </div>
    );
};

export default Patients;
