import { Button, Snackbar, TextField } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import search from '../../assets/search.svg';
import { useTranslations } from '../../hooks/useTranslations';
import { LANGUAGES } from '../../utils/constants';
import { TableHeaderType, TableRowType } from '../../utils/custom-proptypes';
import SimpleTable from '../SimpleTable/SimpleTable';


const CLOSE_REASON_CLICKAWAY = 'clickaway';

/**
 * Wraps <SimpleTable />, adding search and the ability to add items
 */
const Table = ({
    doesRowMatchQuery,
    tableTitle,
    addRowButtonTitle,
    onCreateRow,
    data,
    headers,
    rowData,
    renderHeader,
    renderTableRow,
}) => {
    const [translations, selectedLang] = useTranslations();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [isSnackbarOpen, setSnackbarOpen] = useState(false);

    /**
     * Updates the search bar and filtered patients
     */
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);

        const filtered = data.filter((row) =>
            doesRowMatchQuery(row, e.target.value),
        );

        setSnackbarOpen(filtered.length === 0);
        setFilteredData(filtered);
    };

    /**
     * Only close snackbar if the 'x' button is pressed
     */
    const onCloseSnackbar = (event, reason) => {
        if (reason === CLOSE_REASON_CLICKAWAY) return;

        setSnackbarOpen(false);
    };

    return (
        <div>
            <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={3000}
                onClose={onCloseSnackbar}
            >
                <MuiAlert
                    onClose={onCloseSnackbar}
                    severity="error"
                    elevation={6}
                    variant="filled"
                >
                    {translations.components.table.noPatientsFound}
                </MuiAlert>
            </Snackbar>

            <div className="header">
                <div className="section">
                    <h2
                        className={
                            selectedLang === LANGUAGES.AR
                                ? 'patient-list-title-ar'
                                : 'patient-list-title'
                        }
                    >
                        <p>{tableTitle}</p>
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
                        initValue={searchQuery}
                        size="small"
                        variant="outlined"
                        placeholder={translations.components.search.placeholder}
                    />
                    <Button
                        className="create-patient-button"
                        onClick={onCreateRow}
                    >
                        {addRowButtonTitle}
                    </Button>
                </div>
            </div>
            <SimpleTable
                data={searchQuery?.length ? filteredData : data}
                headers={headers}
                rowData={rowData}
                renderHeader={renderHeader}
                renderTableRow={renderTableRow}
            />
        </div>
    );
};

Table.propTypes = {
    doesRowMatchQuery: PropTypes.func.isRequired,
    tableTitle: PropTypes.string,
    addRowButtonTitle: PropTypes.string.isRequired,
    onCreateRow: PropTypes.func.isRequired,
    headers: PropTypes.arrayOf(TableHeaderType).isRequired,
    renderHeader: PropTypes.func.isRequired,
    renderTableRow: PropTypes.func.isRequired,
    data: PropTypes.arrayOf(PropTypes.object),
    rowData: PropTypes.arrayOf(TableRowType).isRequired,
};

export default Table;
