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
    const [patients, setPatients] = useState([]);
    const [stepsMetaData, setStepsMetaData] = useState(null);
    const [step, setStep] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [noPatient, setNoPatient] = useState(false);
    const errorWrap = useErrorWrap();
    const [translations, selectedLang] = useTranslations();
    const [isCreatePatientModalOpen, setCreatePatientModalOpen] = useState(
        false,
    );

    const onSavePatient = (patientData) => {
        console.log(patientData);
    };

    const onSaveAndEditPatient = (patientData) => {
        onSavePatient(patientData);
    };

    const createPatientHelper = async (edit) => {
        const patient = {};
        patient.firstName = document.getElementById('createFirstName').value;
        patient.fathersName = document.getElementById(
            'createFathersName',
        ).value;
        patient.grandfathersName = document.getElementById(
            'createGrandfathersName',
        ).value;
        patient.familyName = document.getElementById('createFamilyName').value;

        let res = null;
        try {
            res = await postNewPatient(patient);
            const id = res.result._id;

            if (edit) window.location.href += `patient-info/${id}`;
        } catch (error) {
            console.error(error);
        } finally {
            swal({
                title: res?.success
                    ? translations.components.swal.createPatient.successMsg
                    : translations.components.swal.createPatient.failMsg,
                icon: res?.success ? 'success' : 'warning',
            });
        }
    };

    const doesPatientMatchQuery = (patient, query) => {
        if (
            getPatientName(patient)
                .toLowerCase()
                .indexOf(query.toLowerCase()) !== -1
        )
            return true;

        if (patient._id.indexOf(query) !== -1) return true;

        return false;
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        const filtered = patients.filter((patient) =>
            doesPatientMatchQuery(patient, e.target.value),
        );
        setNoPatient(filtered.length === 0);
        setFilteredPatients(filtered);
    };

    const handleNoPatientClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setNoPatient(false);
    };

    const handleStep = async (stepKey) => {
        setSearchQuery('');
        if (stepKey !== null) {
            setStep(stepKey);
            errorWrap(async () => {
                const res = await getPatientsByStage(stepKey);
                setPatients(res.result);
            });
        }
    };

    useEffect(() => {
        const getMetadata = async () => {
            errorWrap(async () => {
                let res = await getAllStepsMetadata();
                setStepsMetaData(res.result);
                if (res.result.length > 0) {
                    setStep(res.result[0].key);
                    res = await getPatientsByStage(res.result[0].key);
                    setPatients(res.result);
                }
            });
        };

        getMetadata();
    }, [setStep, setStepsMetaData, errorWrap]);

    function generatePageHeader() {
        if (stepsMetaData == null) return translations.components.table.loading;

        return stepsMetaData.map((element) => {
            if (step !== element.key) return null;

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
                    sortKey: `${step}.${field.key}`,
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
            if (step !== element.key) return null;

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
                open={noPatient}
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
                    step={step}
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
