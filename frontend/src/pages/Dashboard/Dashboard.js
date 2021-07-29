import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import MuiAlert from '@material-ui/lab/Alert';
import swal from 'sweetalert';
import { Button, TextField, Snackbar } from '@material-ui/core';

import { useErrorWrap } from '../../hooks/useErrorWrap';
import { getPatientName } from '../../utils/utils';
import {
    REQUIRED_DASHBOARD_SORT_KEYS,
    REQUIRED_DASHBOARD_HEADERS,
    LANGUAGES,
} from '../../utils/constants';
import Table from '../../components/Table/Table';
import ToggleButtons from '../../components/ToggleButtons/ToggleButtons';
import search from '../../assets/search.svg';
import {
    getAllStepsMetadata,
    getPatientsByStage,
    postNewPatient,
} from '../../utils/api';
import './Dashboard.scss';
import { useTranslations } from '../../hooks/useTranslations';
import {
    patientTableHeaderRenderer,
    patientTableRowRenderer,
} from '../../utils/table-renderers';
import CreatePatientModal from '../../components/CreatePatientModal/CreatePatientModal';

const Dashboard = () => {
    const errorWrap = useErrorWrap();
    const [translations, selectedLang] = useTranslations();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSnackbarOpen, setSnackbarOpen] = useState(false);
    const [isCreatePatientModalOpen, setCreatePatientModalOpen] = useState(
        false,
    );

    // All patients for the selected step
    const [patients, setPatients] = useState([]);

    // The metadata for all steps
    const [stepsMetaData, setStepsMetaData] = useState(null);

    // Currently selected step
    const [selectedStep, setSelectedStep] = useState('');

    // A list of filtered patients according to the search query
    const [filteredPatients, setFilteredPatients] = useState([]);

    useEffect(() => {
        const getMetadata = async () => {
            let res = await getAllStepsMetadata();

            // TODO: Sort metadata here
            setStepsMetaData(res.result);
            if (res.result.length > 0) {
                setSelectedStep(res.result[0].key);
                res = await getPatientsByStage(res.result[0].key);
                setPatients(res.result);
            }
        };

        errorWrap(getMetadata);
    }, [setSelectedStep, setStepsMetaData, errorWrap]);

    /**
     * Saves a patient to the DB
     */
    const onSavePatient = async (patientData) => {
        // TODO: Update the local data
        let patientId = null;

        await errorWrap(async () => {
            // Make the request
            const res = await postNewPatient(patientData);
            patientId = res?.result?._id;

            // Show success/error
            swal({
                title: translations.components.swal.createPatient.successMsg,
                icon: 'success',
            });
        });

        return patientId;
    };

    /**
     * Saves patient to the DB and immediately navigates to the
     * detail view for that patient
     */
    const onSaveAndEditPatient = async (patientData) => {
        const patientId = await onSavePatient(patientData);
        if (patientId) window.location.href += `patient-info/${patientId}`;
    };

    /**
     * Given a query and patient data, return true if this patient should
     * be included in the search results
     */
    const doesPatientMatchQuery = (patient, query) => {
        const patientName = getPatientName(patient).toLowerCase();
        const patientId = patient?._id?.toLowerCase();
        const lowercaseQuery = query?.toLowerCase();

        // If query is contained in patient name
        if (patientName.indexOf(lowercaseQuery) !== -1) return true;

        // If query is contained in patient's ID
        if (patientId.indexOf(lowercaseQuery) !== -1) return true;

        return false;
    };

    const handleSearch = (e) => {
        // Update the search query
        setSearchQuery(e.target.value);

        // Update the list of patients
        const filtered = patients.filter((patient) =>
            doesPatientMatchQuery(patient, e.target.value),
        );

        setSnackbarOpen(filtered.length === 0);
        setFilteredPatients(filtered);
    };

    const handleNoPatientClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    const handleStep = async (stepKey) => {
        if (!stepKey) return;

        // TODO: Put the patient data in a store
        setSelectedStep(stepKey);
        errorWrap(async () => {
            const res = await getPatientsByStage(stepKey);
            setPatients(res.result);
        });
    };

    function generatePageHeader() {
        if (stepsMetaData == null) return translations.components.table.loading;

        return stepsMetaData.map((element) => {
            if (selectedStep !== element.key) return null;

            return (
                <p key={`header-${element.key}`}>
                    {element.displayName[selectedLang]}
                </p>
            );
        });
    }

    function generateHeaders(fields) {
        if (fields == null) return [];

        const headers = _.cloneDeep(REQUIRED_DASHBOARD_HEADERS);
        fields.forEach((field) => {
            if (field.isVisibleOnDashboard)
                headers.push({
                    title: field.displayName[selectedLang],
                    sortKey: `${selectedStep}.${field.key}`,
                    fieldType: field.fieldType,
                });
        });

        return headers;
    }

    function generateRowData(stepKey, fields) {
        if (fields == null) return [];

        const rowData = _.cloneDeep(REQUIRED_DASHBOARD_SORT_KEYS);
        fields.forEach((field) => {
            if (field.isVisibleOnDashboard)
                rowData.push({
                    id: `${stepKey}.${field?.key}`,
                    dataType: field?.fieldType,
                });
        });

        return rowData;
    }

    function generateMainTable() {
        if (stepsMetaData == null) return null;

        return stepsMetaData.map((element) => {
            if (selectedStep !== element.key) return null;

            return (
                <Table
                    key={`table-${element.key}`}
                    renderHeader={patientTableHeaderRenderer}
                    renderTableRow={patientTableRowRenderer}
                    headers={generateHeaders(element.fields)}
                    rowData={generateRowData(element.key, element.fields)}
                    data={
                        searchQuery.length === 0 ? patients : filteredPatients
                    }
                />
            );
        });
    }

    return (
        <div className="dashboard">
            <CreatePatientModal
                isOpen={isCreatePatientModalOpen}
                onClose={() => setCreatePatientModalOpen(false)}
                onSave={onSavePatient}
                onSaveAndEdit={onSaveAndEditPatient}
            />

            <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={3000}
                onClose={handleNoPatientClose}
            >
                <MuiAlert
                    onClose={handleNoPatientClose}
                    severity="error"
                    elevation={6}
                    variant="filled"
                >
                    {translations.components.table.noPatientsFound}
                </MuiAlert>
            </Snackbar>
            <div className="tabs">
                <ToggleButtons
                    step={selectedStep}
                    metaData={stepsMetaData}
                    handleStep={handleStep}
                />
            </div>
            <div className="patient-list">
                <div className="header">
                    <div className="section">
                        <h2
                            className={
                                selectedLang === LANGUAGES.AR
                                    ? 'patient-list-title-ar'
                                    : 'patient-list-title'
                            }
                        >
                            {generatePageHeader()}
                        </h2>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <img
                                        alt="star"
                                        style={{ marginRight: '10px' }}
                                        src={search}
                                        width="16px"
                                    />
                                ),
                            }}
                            className="patient-list-search-field"
                            onChange={handleSearch}
                            value={searchQuery}
                            size="small"
                            variant="outlined"
                            placeholder={
                                translations.components.search.placeholder
                            }
                        />
                        <Button
                            className="create-patient-button"
                            onClick={() => setCreatePatientModalOpen(true)}
                        >
                            {translations.components.button.createPatient}
                        </Button>
                    </div>
                </div>
                {generateMainTable()}
            </div>
        </div>
    );
};

Dashboard.propTypes = {};

export default Dashboard;
