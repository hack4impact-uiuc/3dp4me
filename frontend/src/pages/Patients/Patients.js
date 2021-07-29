import React, { useEffect, useState } from 'react';
import { Button, Snackbar, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './Patients.scss';
import MuiAlert from '@material-ui/lab/Alert';
import swal from 'sweetalert';
import reactSwal from '@sweetalert/with-react';

import { getPatientName } from '../../utils/utils';
import Table from '../../components/Table/Table';
import search from '../../assets/search.svg';
import archive from '../../assets/archive.svg';
import { getAllPatients } from '../../utils/api';
import {
    ALL_PATIENT_DASHBOARD_HEADERS,
    ALL_PATIENT_DASHBOARD_ROW_DATA,
    LANGUAGES,
    REQUIRED_DASHBOARD_HEADERS,
    REQUIRED_DASHBOARD_SORT_KEYS,
} from '../../utils/constants';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import { useTranslations } from '../../hooks/useTranslations';
import {
    patientTableHeaderRenderer,
    patientTableRowRenderer,
} from '../../utils/table-renderers';
import PatientTable from '../../components/PatientTable/PatientTable';

const Patients = () => {
    const [translations, selectedLang] = useTranslations();
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
