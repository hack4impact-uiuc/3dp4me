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
import { resolveObjPath } from '../../utils/object';
import useSortableData from '../../hooks/useSortableData';
import Eyecon from '../../assets/view.svg';
import { TableHeaderType } from '../../utils/custom-proptypes';
import { LANGUAGES } from '../../utils/constants';
import { useTranslations } from '../../hooks/useTranslations';
import { StyledTableCell, StyledTableRow } from './MainTable.style';
import { fieldToJSX } from '../../utils/fields';
import {
    defaultTableHeaderRenderer,
    defaultTableRowRenderer,
} from '../../utils/table-renderers';

const MainTable = ({ data, headers, rowData }) => {
    const [translations, selectedLang] = useTranslations();

    const UNSORTED_DATA = data;
    const { items, requestSort, sortConfig } = useSortableData(
        data,
        UNSORTED_DATA,
    );

    const renderTableBody = () => {
        if (!items || !rowData) return null;

        return items.map((patient) => (
            <StyledTableRow key={patient._id}>
                {renderTableRow(patient)}
            </StyledTableRow>
        ));
    };

    const renderHeader = () => {
        let headerCells = defaultTableHeaderRenderer(
            headers,
            sortConfig,
            requestSort,
            selectedLang,
        );
        headerCells.push(<StyledTableCell className="header" align="center" />);
        return headerCells;
    };

    /**
     * Given patient data, constructs an array of cells for the row.
     * @param {Object} patient The patient data
     * @returns Array of cells
     */
    const renderTableRow = (patient) => {
        // Construct the base row
        let row = defaultTableRowRenderer(rowData, patient, selectedLang);

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
