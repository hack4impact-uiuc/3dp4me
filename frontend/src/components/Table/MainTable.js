import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
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
import { resolveObjPath } from '../../utils/object';
import useSortableData from '../../hooks/useSortableData';
import Eyecon from '../../assets/view.svg';
import { TableHeaderType } from '../../utils/custom-proptypes';
import { LANGUAGES } from '../../utils/constants';
import { useTranslations } from '../../hooks/useTranslations';
import { StyledTableCell, StyledTableRow } from './MainTable.style';
import { fieldToJSX } from '../../utils/fields';

const SORT_DIRECTIONS = {
    AESC: 'ascending',
    DESC: 'descending',
};

const MainTable = ({ data, headers, rowData }) => {
    const [translations, selectedLang] = useTranslations();

    const UNSORTED_DATA = data;
    const { items, requestSort, sortConfig } = useSortableData(
        data,
        UNSORTED_DATA,
    );

    /**
     * Given a patient data, a field key, and a field type, this function finds
     * the data and formats it accordingly.
     * @param {Object} patient The patient data
     * @param {String} fieldKey The field key. Can be nested with '.' (i.e. 'medicalInfo.data.options')
     * @param {*} fieldType The field type of the data that will be retrieved
     * @returns A stringified, formated version of the data.
     */
    const getPatientField = (patient, fieldKey, fieldType) => {
        const fieldData = resolveObjPath(patient, fieldKey);
        return fieldToJSX(fieldData, fieldType, selectedLang);
    };

    const renderTableBody = () => {
        if (!items || !rowData) return null;

        return items.map((patient) => (
            <StyledTableRow key={patient._id}>
                {renderTableRow(patient)}
            </StyledTableRow>
        ));
    };

    const renderSortArrow = (sortKey) => {
        if (!sortConfig || sortConfig.key !== sortKey) return;

        if (sortConfig.direction === SORT_DIRECTIONS.AESC)
            return <ArrowDropUpIcon className="dropdown-arrow" />;
        if (sortConfig.direction === SORT_DIRECTIONS.DESC)
            return <ArrowDropDownIcon className="dropdown-arrow" />;

        console.error(`Invalid sort direction: '${sortConfig.direction}'`);
        return null;
    };

    const renderHeader = () => {
        const cellAlign = selectedLang === LANGUAGES.AR ? 'right' : 'left';
        const cellClassName =
            selectedLang === LANGUAGES.AR ? 'cell-align-rtl' : 'cell-align';

        let headerCells = headers.map((header) => (
            <StyledTableCell
                onClick={() => requestSort(header.sortKey)}
                className="header"
                key={header.title}
                align={cellAlign}
            >
                <div className={cellClassName}>
                    {header.title}
                    {renderSortArrow(header.sortKey)}
                </div>
            </StyledTableCell>
        ));

        headerCells.push(<StyledTableCell className="header" align="center" />);

        return headerCells;
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
                        <TableRow>{renderHeader()}</TableRow>
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
