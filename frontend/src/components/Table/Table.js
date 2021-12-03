import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from '@material-ui/core';

import search from '../../assets/search.svg';
import SimpleTable from '../SimpleTable/SimpleTable';
import { TableHeaderType, TableRowType } from '../../utils/custom-proptypes';
import { LANGUAGES, PATIENT_TABLE_SEARCH_DELAY } from '../../utils/constants';
import { useTranslations } from '../../hooks/useTranslations';

/**
 * Wraps <SimpleTable />, adding search and the ability to add items
 */
const Table = ({
    tableTitle,
    addRowButtonTitle,
    onCreateRow,
    data,
    headers,
    rowData,
    renderHeader,
    renderTableRow,
    initialSearchQuery,
    handleSearchQuery,
}) => {
    const [translations, selectedLang] = useTranslations();

    /* The search query is set to an initial value passed down from Dashboard.js. 
       This prevents the search query from resetting after switching the stage/step. */
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

    /* This boolean is set to true when the user types in a new search query. 
       This prevents fetching patient twice on load or after swiching the stage/step. */
    const [isSearchQueryUpdated, setIsSearchQueryUpdated] = useState(false);

    useEffect(() => {
        const searchDelay = setTimeout(() => {
            if (isSearchQueryUpdated) {
                handleSearchQuery(searchQuery);
            }
        }, PATIENT_TABLE_SEARCH_DELAY);

        return () => clearTimeout(searchDelay);
    }, [searchQuery, isSearchQueryUpdated]);

    const updateSearchQuery = (event) => {
        setSearchQuery(event.target.value);
        setIsSearchQueryUpdated(true);
    };

    return (
        <div>
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
                        onChange={updateSearchQuery}
                        value={searchQuery}
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
                data={data}
                headers={headers}
                rowData={rowData}
                renderHeader={renderHeader}
                renderTableRow={renderTableRow}
            />
        </div>
    );
};

Table.propTypes = {
    tableTitle: PropTypes.string,
    addRowButtonTitle: PropTypes.string.isRequired,
    onCreateRow: PropTypes.func.isRequired,
    headers: PropTypes.arrayOf(TableHeaderType).isRequired,
    renderHeader: PropTypes.func.isRequired,
    renderTableRow: PropTypes.func.isRequired,
    data: PropTypes.arrayOf(PropTypes.object),
    rowData: PropTypes.arrayOf(TableRowType).isRequired,
    initialSearchQuery: PropTypes.string.isRequired,
    handleSearchQuery: PropTypes.func.isRequired,
};

export default Table;
