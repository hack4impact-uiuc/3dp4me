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
    const selectedLang = useTranslations()[1];
    const { sortedData, requestSort, sortConfig } = useSortableData(data);

    const renderTableBody = () => {
        if (!sortedData || !rowData) return null;

        return sortedData.map((patient) => (
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
    renderHeader: PropTypes.func.isRequired,
    renderTableRow: PropTypes.func.isRequired,
    data: PropTypes.arrayOf(PropTypes.object),
    rowData: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            dataType: PropTypes.string,
        }),
    ).isRequired,
};

export default MainTable;
