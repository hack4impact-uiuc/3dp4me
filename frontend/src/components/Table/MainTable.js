import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import './MainTable.scss';
import useSortableData from '../../hooks/useSortableData';
import { TableHeaderType } from '../../utils/custom-proptypes';
import { useTranslations } from '../../hooks/useTranslations';
import { StyledTableRow } from './MainTable.style';

const MainTable = ({
    data,
    headers,
    rowData,
    renderHeader,
    renderTableRow,
}) => {
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
                {renderTableRow(rowData, patient, selectedLang)}
            </StyledTableRow>
        ));
    };

    return (
        <div className="table-container">
            <TableContainer className="table-container" component={Paper}>
                <Table stickyHeader className="table">
                    <TableHead>
                        <TableRow>
                            {renderHeader(
                                headers,
                                sortConfig,
                                requestSort,
                                selectedLang,
                            )}
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
