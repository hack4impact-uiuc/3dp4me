
import React, { useEffect, useState } from 'react';

import { getAllPatients, getPatientsCount, getPatientsByPageNumber } from '../../api/api';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import { useTranslations } from '../../hooks/useTranslations';
import PatientTable from '../../components/PatientTable/PatientTable';
import {
    getPatientDashboardHeaders,
    ALL_PATIENT_DASHBOARD_ROW_DATA,
} from '../../utils/constants';
import './Patients.scss';
import PaginateBar from '../../components/PaginateBar/PaginateBar';


const PATIENTS_PER_PAGE = 14;

/**
 * Shows a table of all patients within the system
 */
const Patients = () => {
    const [translations, selectedLang] = useTranslations();
    const [allPatients, setAllPatients] = useState([]);
    const [patientsCount, setPatientsCount] = useState(0);


    const errorWrap = useErrorWrap();

    const getData = async (newPage) => {
        errorWrap(async () => {
            const res = await getPatientsByPageNumber(newPage, PATIENTS_PER_PAGE);

            setAllPatients(res.result);

        });
    };

    const updatePage = async (newPage) => {
        errorWrap(async () => {
            await getData(newPage);
        });
    }

    /**
     * Fetch data on all patients
     */
    useEffect(() => {

        const getCount = async () => {
            errorWrap(async () => {
                const res = await getPatientsCount();

                setPatientsCount(res.result);
                getData(1); //page number starts at 1
            });
        }

        
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

                <PaginateBar pageCount = {patientsCount / PATIENTS_PER_PAGE} onPageChange = {updatePage}/>
            </div>
        </div>
    );
};

export default Patients;
