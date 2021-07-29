import React, { useEffect, useState } from 'react';

import { getAllPatients } from '../../utils/api';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import { useTranslations } from '../../hooks/useTranslations';
import PatientTable from '../../components/PatientTable/PatientTable';
import {
    ALL_PATIENT_DASHBOARD_HEADERS,
    ALL_PATIENT_DASHBOARD_ROW_DATA,
} from '../../utils/constants';
import './Patients.scss';

const Patients = () => {
    const translations = useTranslations()[0];
    const [allPatients, setAllPatients] = useState([]);
    const errorWrap = useErrorWrap();

    /**
     * Fetch data on all patients
     */
    useEffect(() => {
        const getData = async () => {
            errorWrap(async () => {
                const res = await getAllPatients();
                setAllPatients(res.result);
            });
        };
        getData();
    }, [setAllPatients, errorWrap]);

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
                    headers={ALL_PATIENT_DASHBOARD_HEADERS}
                    rowData={ALL_PATIENT_DASHBOARD_ROW_DATA}
                    patients={allPatients}
                />
            </div>
        </div>
    );
};

export default Patients;
