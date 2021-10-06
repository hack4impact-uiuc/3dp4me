import React, { useEffect, useState } from 'react';

import { getPatientsCount, getPatientsByPageNumber } from '../../api/api';
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

    const errorWrap = useErrorWrap();

    const updatePage = async (newPage) => {
        errorWrap(async () => {
            const res = await getPatientsByPageNumber(newPage, PEOPLE_PER_PAGE);
            setAllPatients(res.result);
        });
    };

    /**
     * Fetch data on all patients
     */
    useEffect(() => {

        const getInitialPage = async () => {
            errorWrap(async () => {
                // page number starts at 1
                const res = await getPatientsByPageNumber(1, PEOPLE_PER_PAGE);
                setAllPatients(res.result);
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
                />

                <PaginateBar
                    pageCount={Math.ceil(patientsCount / PEOPLE_PER_PAGE, 10)}
                    onPageChange={updatePage}
                />
            </div>
        </div>
    );
};

export default Patients;
