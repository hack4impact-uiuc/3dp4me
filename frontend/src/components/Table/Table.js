import React from 'react';
import SimpleTable from '../SimpleTable/SimpleTable';
import PropTypes from 'prop-types';
import { TableHeaderType } from '../../utils/custom-proptypes';

const Table = ({ data, headers, rowData, renderHeader, renderTableRow }) => {
    return (
        <SimpleTable
            data={data}
            headers={headers}
            rowData={rowData}
            renderHeader={renderHeader}
            renderTableRow={renderTableRow}
        />
    );
};

Table.propTypes = {
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

export default Table;
