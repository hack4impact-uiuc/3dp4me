import React, { useState } from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { trackPromise } from 'react-promise-tracker';

import { useErrorWrap } from '../../hooks/useErrorWrap';
import { useTranslations } from '../../hooks/useTranslations';
import { postNewPatient } from '../../api/api';
import {
    ColumnMetadata,
    Header,
    patientTableHeaderRenderer,
    patientTableRowRenderer,
} from '../../utils/table-renderers';
import CreatePatientModal from '../CreatePatientModal/CreatePatientModal';
import Table from '../Table/Table';
import { Routes } from '../../utils/constants';
import { BasePatient, Language, Nullish, Patient } from '@3dp4me/types';

export interface PatientTableProps {
    onAddPatient: (patient: Patient) => void
    tableTitle: string
    patients: Patient[]
    headers: Header[]
    rowData: ColumnMetadata<Patient>[]
    initialSearchQuery: string
    handleSearchQuery: (query: string) => void
    stepKey: string
}

/**
 * A table to be used with patient data. Same as a normal <Table/> element,
 * but the 'search' and 'addPatient' functionalities are implemented.
 */
const PatientTable = ({
    onAddPatient,
    tableTitle,
    patients,
    headers,
    rowData,
    initialSearchQuery,
    handleSearchQuery,
    stepKey,
}: PatientTableProps) => {
    const errorWrap = useErrorWrap();
    const translations = useTranslations()[0];
    const [isCreatePatientModalOpen, setCreatePatientModalOpen] =
        useState(false);

    /**
     * Saves a patient to the DB
     */
    const onSavePatient = async (patientData: BasePatient) => {
        let patient: Nullish<Patient> = null;

        await errorWrap(async () => {
            // Make the request
            const res = await trackPromise(postNewPatient(patientData));
            patient = res?.result;
        });

        // If success, show message and do callback
        if (patient) {
            swal({
                title: translations.components.swal.createPatient.successMsg,
                icon: 'success',
            });

            onAddPatient(patient);
        }

        // TODO: Get rid of the error wraps because ts has a hard time with it
        return (patient as any as Patient)?._id;
    };

    /**
     * Saves patient to the DB and immediately navigates to the
     * detail view for that patient
     */
    const onSaveAndEditPatient = async (patientData: BasePatient) => {
        const patientId = await onSavePatient(patientData);
        const currentRoute = window.location.href;
        let relativeRoute = `${Routes.PATIENT_DETAIL}/${patientId}?stepKey=${stepKey}`;

        // Remove double '/'
        if (
            relativeRoute[0] === '/' &&
            currentRoute[currentRoute.length - 1] === '/'
        )
            relativeRoute = relativeRoute.substr(1, relativeRoute.length - 1);

        if (patientId) window.location.href = currentRoute + relativeRoute;
    };

    const PatientTableRowRendererForStep = (
        patientRowData: ColumnMetadata<Patient>[],
        patient: Patient,
        selectedLang: Language,
    ) => {
        return patientTableRowRenderer(
            patientRowData,
            patient,
            selectedLang,
            stepKey,
        );
    };

    return (
        <div>
            <CreatePatientModal
                isOpen={isCreatePatientModalOpen}
                onClose={() => setCreatePatientModalOpen(false)}
                onSave={onSavePatient}
                onSaveAndEdit={onSaveAndEditPatient}
            />

            <Table<Patient>
                onCreateRow={() => setCreatePatientModalOpen(true)}
                tableTitle={tableTitle}
                addRowButtonTitle={translations.components.button.createPatient}
                renderHeader={patientTableHeaderRenderer}
                renderTableRow={PatientTableRowRendererForStep}
                initialSearchQuery={initialSearchQuery}
                handleSearchQuery={handleSearchQuery}
                headers={headers}
                rowData={rowData}
                data={patients}
            />
        </div>
    );
};

export default PatientTable;
