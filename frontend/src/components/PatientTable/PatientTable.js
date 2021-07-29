import React, { useState } from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';

import { useErrorWrap } from '../../hooks/useErrorWrap';
import { useTranslations } from '../../hooks/useTranslations';
import { postNewPatient } from '../../utils/api';
import {
    patientTableHeaderRenderer,
    patientTableRowRenderer,
} from '../../utils/table-renderers';
import { getPatientName } from '../../utils/utils';
import CreatePatientModal from '../CreatePatientModal/CreatePatientModal';
import Table from '../Table/Table';
import { TableRowType, TableHeaderType } from '../../utils/custom-proptypes';
import { ROUTES } from '../../utils/constants';

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
}) => {
    const errorWrap = useErrorWrap();
    const translations = useTranslations()[0];
    const [isCreatePatientModalOpen, setCreatePatientModalOpen] = useState(
        false,
    );

    /**
     * Saves a patient to the DB
     */
    const onSavePatient = async (patientData) => {
        let patient = null;

        await errorWrap(async () => {
            // Make the request
            const res = await postNewPatient(patientData);
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

        return patient?._id;
    };

    /**
     * Saves patient to the DB and immediately navigates to the
     * detail view for that patient
     */
    const onSaveAndEditPatient = async (patientData) => {
        const patientId = await onSavePatient(patientData);
        let currentRoute = window.location.href;
        let relativeRoute = `${ROUTES.PATIENT_DETAIL}/${patientId}`;

        // Remove doulbe '/'
        if (
            relativeRoute[0] === '/' &&
            currentRoute[currentRoute.length - 1] === '/'
        )
            relativeRoute = relativeRoute.substr(1, relativeRoute.length - 1);

        if (patientId) window.location.href = currentRoute + relativeRoute;
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

    return (
        <div>
            <CreatePatientModal
                isOpen={isCreatePatientModalOpen}
                onClose={() => setCreatePatientModalOpen(false)}
                onSave={onSavePatient}
                onSaveAndEdit={onSaveAndEditPatient}
            />

            <Table
                onCreateRow={() => setCreatePatientModalOpen(true)}
                tableTitle={tableTitle}
                doesRowMatchQuery={doesPatientMatchQuery}
                addRowButtonTitle={translations.components.button.createPatient}
                renderHeader={patientTableHeaderRenderer}
                renderTableRow={patientTableRowRenderer}
                headers={headers}
                rowData={rowData}
                data={patients}
            />
        </div>
    );
};

PatientTable.propTypes = {
    onAddPatient: PropTypes.func.isRequired,
    tableTitle: PropTypes.string,
    patients: PropTypes.arrayOf(PropTypes.object),
    headers: PropTypes.arrayOf(TableHeaderType).isRequired,
    rowData: PropTypes.arrayOf(TableRowType).isRequired,
};

export default PatientTable;
