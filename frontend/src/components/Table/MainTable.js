import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import './MainTable.scss';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

import { resolveObjPath } from '../../utils/object';
import useSortableData from '../../hooks/useSortableData';
import finishedIcon from '../../assets/check.svg';
import partiallyIcon from '../../assets/half-circle.svg';
import unfinishedIcon from '../../assets/exclamation.svg';
import Eyecon from '../../assets/view.svg';
import { TableHeaderType } from '../../utils/custom-proptypes';
import {
    FIELD_TYPES,
    LANGUAGES,
    PATIENT_STATUS,
    SIGNATURE_STATUS,
    STEP_STATUS,
} from '../../utils/constants';
import { formatDate } from '../../utils/date';
import { useTranslations } from '../../hooks/useTranslations';
import { StyledTableCell, StyledTableRow } from './MainTable.style';

const MainTable = ({ data, headers, rowData }) => {
    const [translations, selectedLang] = useTranslations();

    const UNSORTED_DATA = data;
    const { items, requestSort, sortConfig } = useSortableData(
        data,
        UNSORTED_DATA,
    );

    // TODO: Can I get rid of the first 3??
    const statusStyle = {
        [STEP_STATUS.FINISHED]: (
            <div>
                <img
                    alt="complete"
                    style={{ marginRight: '6px' }}
                    width="16px"
                    src={finishedIcon}
                />
                {translations.components.bottombar.finished}
            </div>
        ),
        [STEP_STATUS.PARTIALLY_FINISHED]: (
            <div style={{ color: '#ff9d00' }}>
                <img
                    alt="partial"
                    style={{ marginRight: '6px' }}
                    width="16px"
                    src={partiallyIcon}
                />{' '}
                {translations.components.bottombar.partial}
            </div>
        ),
        [STEP_STATUS.UNFINISHED]: (
            <div style={{ color: 'red' }}>
                <img
                    alt="incomplete"
                    style={{ marginRight: '6px' }}
                    width="16px"
                    src={unfinishedIcon}
                />{' '}
                {translations.components.bottombar.unfinished}
            </div>
        ),
        [PATIENT_STATUS.ACTIVE]: (
            <div style={{ color: '#65d991' }}>
                {translations.components.bottombar.active}
            </div>
        ),
        [PATIENT_STATUS.ARCHIVE]: (
            <div style={{ color: 'black' }}>
                <b>{translations.components.bottombar.archived}</b>
            </div>
        ),
        [PATIENT_STATUS.FEEDBACK]: (
            <div style={{ color: '#5395f8' }}>
                {translations.components.bottombar.feedback}
            </div>
        ),
    };

    const signatureStyles = {
        [SIGNATURE_STATUS.SIGNED]: (
            <div style={{ color: '#65d991' }}>
                <CheckIcon />
            </div>
        ),
        [SIGNATURE_STATUS.UNSIGNED]: (
            <div style={{ color: 'red' }}>
                <CloseIcon />
            </div>
        ),
    };

    /**
     * Given a patient data, a field key, and a field type, this function finds
     * the data and formats it accordingly.
     * @param {Object} patient The patient data
     * @param {String} fieldKey The field key. Can be nested with '.' (i.e. 'medicalInfo.data.options')
     * @param {*} fieldType The field type of the data that will be retrieved
     * @returns A stringified, formated version of the data.
     */
    const getPatientField = (patient, fieldKey, fieldType) => {
        const rawData = resolveObjPath(patient, fieldKey);
        switch (fieldType) {
            case FIELD_TYPES.STRING:
            case FIELD_TYPES.NUMBER:
                return rawData;
            case FIELD_TYPES.DATE:
                return formatDate(new Date(rawData), selectedLang);
            case FIELD_TYPES.SIGNATURE: {
                const status = rawData?.signatureData?.length
                    ? SIGNATURE_STATUS.SIGNED
                    : SIGNATURE_STATUS.UNSIGNED;
                return signatureStyles[status];
            }
            case FIELD_TYPES.STATUS:
                return <b>{statusStyle[rawData]}</b>;
            default:
                return rawData;
        }
    };

    const renderTableBody = () => {
        if (!items || !rowData) return null;

        return items.map((patient) => (
            <StyledTableRow key={patient._id}>
                {renderTableRow(patient)}
            </StyledTableRow>
        ));
    };

    /**
     * Given patient data, constructs an array of cells for the row.
     * @param {Object} patient The patient data
     * @returns Array of cells
     */
    const renderTableRow = (patient) => {
        const cellClassName =
            selectedLang === LANGUAGES.AR ? 'cell-rtl' : 'cell';
        const cellAlign = selectedLang === LANGUAGES.AR ? 'right' : 'left';

        // Construct a cell for each piece of patient data
        let row = rowData.map(({ id, dataType }) => (
            <StyledTableCell
                className={cellClassName}
                key={`${patient._id}-${id}`}
                align={cellAlign}
            >
                {getPatientField(patient, id, dataType)}
            </StyledTableCell>
        ));

        // Add a link to the patient's page
        row.push(
            <StyledTableCell className="cell" align="center">
                <Link
                    className="table-view-link"
                    to={`/patient-info/${patient._id}`}
                >
                    <IconButton>
                        <img alt="status icon" width="18px" src={Eyecon} />
                    </IconButton>{' '}
                    {translations.components.table.view}
                </Link>
            </StyledTableCell>,
        );

        return row;
    };

    return (
        <div className="table-container">
            <TableContainer className="table-container" component={Paper}>
                <Table stickyHeader className="table">
                    <TableHead>
                        <TableRow>
                            {headers.map((header) => (
                                <StyledTableCell
                                    onClick={() => requestSort(header.sortKey)}
                                    className="header"
                                    key={header.title}
                                    align={
                                        selectedLang === LANGUAGES.AR
                                            ? 'right'
                                            : 'left'
                                    }
                                >
                                    <div
                                        className={
                                            selectedLang === LANGUAGES.AR
                                                ? 'cell-align-rtl'
                                                : 'cell-align'
                                        }
                                    >
                                        {header.title}
                                        {sortConfig !== null &&
                                        sortConfig.key === header.sortKey &&
                                        sortConfig.direction === 'ascending' ? (
                                            <ArrowDropUpIcon className="dropdown-arrow" />
                                        ) : (
                                            <></>
                                        )}
                                        {sortConfig !== null &&
                                        sortConfig.key === header.sortKey &&
                                        sortConfig.direction ===
                                            'descending' ? (
                                            <ArrowDropDownIcon className="dropdown-arrow" />
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </StyledTableCell>
                            ))}
                            <StyledTableCell
                                className="header"
                                align="center"
                            />
                        </TableRow>
                    </TableHead>
                    <TableBody className="table-body">
                        {renderTableBody()}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

MainTable.propTypes = {
    headers: PropTypes.arrayOf(TableHeaderType).isRequired,
    rowData: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            dataType: PropTypes.string,
        }),
    ),
    patients: PropTypes.arrayOf(PropTypes.object),
};

export default MainTable;
