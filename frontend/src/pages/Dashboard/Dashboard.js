import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import { useErrorWrap } from '../../hooks/useErrorWrap';
import {
    getStepDashboardHeaders,
    PATIENTS_BY_STEP_TABLE_ROW_DATA,
    FIELD_TYPES,
    PEOPLE_PER_PAGE,
} from '../../utils/constants';
import ToggleButtons from '../../components/ToggleButtons/ToggleButtons';
import {
    getAllStepsMetadata,
    getPatientsByStageAndPageNumber,
    getPatientsCount,
} from '../../api/api';
import './Dashboard.scss';
import { useTranslations } from '../../hooks/useTranslations';
import PatientTable from '../../components/PatientTable/PatientTable';
import { sortMetadata } from '../../utils/utils';
import PaginateBar from '../../components/PaginateBar/PaginateBar';

/**
 * Shows a table of active patients, with a different table for each step
 */
const Dashboard = () => {
    const errorWrap = useErrorWrap();
    const [translations, selectedLang] = useTranslations();

    // All patients for the selected step
    const [patients, setPatients] = useState([]);

    // The metadata for all steps
    const [stepsMetaData, setStepsMetaData] = useState(null);

    // Currently selected step
    const [selectedStep, setSelectedStep] = useState('');

    // Currently selected page
    const [selectedPageNumber, setPageNumber] = useState(1);

    // Number of total patients in the database
    const [patientsCount, setPatientsCount] = useState(0);

    /**
     * Gets patient data based on page number and step
     */

    const loadPatientData = async (stepKey, pageNumber) => {
        const res = await getPatientsByStageAndPageNumber(
            stepKey,
            pageNumber,
            PEOPLE_PER_PAGE,
        );
        setPatients(res.result);
    };

    /**
     * Gets metadata for all setps
     */
    useEffect(() => {
        /**
         * Gets metadata for all steps, only called once
         */
        const loadMetadataAndPatientData = async () => {
            const res = await getAllStepsMetadata(false);

            const metaData = sortMetadata(res.result);
            setStepsMetaData(metaData);
            if (metaData.length > 0) {
                setSelectedStep(metaData[0].key);
                await loadPatientData(metaData[0].key, selectedPageNumber);
            } else {
                throw new Error(translations.errors.noMetadata);
            }
        };

        const loadAllDashboardData = async () => {
            errorWrap(async () => {
                const res = await getPatientsCount();
                setPatientsCount(res.result);

                await loadMetadataAndPatientData();
            });
        };

        loadAllDashboardData();
    }, [
        setSelectedStep,
        selectedPageNumber,
        setStepsMetaData,
        errorWrap,
        translations,
    ]);

    /**
     * Called when a patient is successfully added to the backend
     * @param {Object} patientData The patient data (returned from server)
     */
    const onAddPatient = (patientData) => {
        setPatients((oldPatients) => oldPatients.concat(patientData));
    };

    /**
     * Called when the user selects a new step to view. Sets the step
     * and refetches patient data for this step
     */
    const onStepSelected = async (stepKey) => {
        if (!stepKey) return;

        // TODO: Put the patient data in a store

        setSelectedStep(stepKey);

        errorWrap(async () => {
            await loadPatientData(stepKey, selectedPageNumber);
        });
    };

    const onPageNumberChanged = async (newPageNumber) => {
        if (selectedStep === '') return;

        setPageNumber(newPageNumber);

        errorWrap(async () => {
            await loadPatientData(selectedStep, newPageNumber);
        });
    };

    /**
     * Gets the display name of the currently selected step
     */
    function getTableTitle() {
        if (stepsMetaData == null) return translations.components.table.loading;

        for (let i = 0; i < stepsMetaData?.length; i++) {
            if (selectedStep === stepsMetaData[i].key)
                return stepsMetaData[i].displayName[selectedLang];
        }

        console.error(`Unrecognized step: ${selectedStep}`);
        return null;
    }

    /**
     * Generates headers for a step table. Goes through each field in the step and checks
     * if it should be visible on the dashboard. If so, adds to headers.
     * @returns Array of headers
     */
    function generateHeaders(stepKey, fields) {
        if (fields == null) return [];

        const headers = getStepDashboardHeaders(selectedLang);

        // Have to push this at runtime because we don't know the stepKey ahead
        headers.push({
            title: translations.tableHeaders.status,
            sortKey: `${stepKey}.status`,
        });

        fields.forEach((field) => {
            if (field.isVisibleOnDashboard)
                headers.push({
                    title: field.displayName[selectedLang],
                    sortKey: `${stepKey}.${field.key}`,
                });
        });

        return headers;
    }

    /**
     * Generates row data for a step table. Goes through each field in the step and checks
     * if it should be visible on the dashboard. If so, adds to row data.
     * @returns Array of row data
     */
    function generateRowData(stepKey, fields) {
        if (fields == null) return [];

        const rowData = _.cloneDeep(PATIENTS_BY_STEP_TABLE_ROW_DATA);
        rowData.push({
            id: `${stepKey}.status`,
            dataType: FIELD_TYPES.STEP_STATUS,
        });

        fields.forEach((field) => {
            if (field.isVisibleOnDashboard)
                rowData.push({
                    id: `${stepKey}.${field?.key}`,
                    dataType: field?.fieldType,
                });
        });

        return rowData;
    }

    /**
     * Generates the table for the selected step
     */
    function generateMainTable() {
        if (stepsMetaData == null) return null;

        return stepsMetaData.map((element) => {
            if (selectedStep !== element.key) return null;

            return (
                <PatientTable
                    onAddPatient={onAddPatient}
                    key={`table-${element.key}`}
                    tableTitle={getTableTitle()}
                    headers={generateHeaders(element.key, element.fields)}
                    rowData={generateRowData(element.key, element.fields)}
                    patients={patients}
                    stepKey={selectedStep}
                />
            );
        });
    }

    return (
        <div className="dashboard">
            <div className="tabs">
                <ToggleButtons
                    step={selectedStep}
                    metaData={stepsMetaData}
                    handleStep={onStepSelected}
                />
            </div>
            <div className="patient-list">{generateMainTable()}</div>
            <PaginateBar
                pageCount={Math.ceil(patientsCount / PEOPLE_PER_PAGE, 10)}
                onPageChange={onPageNumberChanged}
            />
        </div>
    );
};

Dashboard.propTypes = {};

export default Dashboard;
