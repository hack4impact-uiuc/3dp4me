import { Button, TextField } from '@material-ui/core'
import React, { ChangeEvent, useEffect, useState } from 'react'

import search from '../../assets/search.svg'
import { useTranslations } from '../../hooks/useTranslations'
import { LANGUAGES, PATIENT_TABLE_SEARCH_DELAY } from '../../utils/constants'
import { ColumnMetadata, Header, HeaderRenderer, RowRenderer } from '../../utils/table-renderers'
import SimpleTable from '../SimpleTable/SimpleTable'

// T is the type of the data that will be displayed in the table
export interface TableProps<T extends Record<string, any>> {
    tableTitle: string
    addRowButtonTitle: string
    onCreateRow: () => void
    data?: T[]
    headers: Header<T>[]
    renderHeader: HeaderRenderer<T>
    renderTableRow: RowRenderer<T>
    rowData: ColumnMetadata<T>[]
    initialSearchQuery: string
    handleSearchQuery: (query: string) => void
    isLoading?: boolean
}

/**
 * Wraps <SimpleTable />, adding search and the ability to add items
 */
const Table = <T extends Record<string, any>>({
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
    isLoading = false,
}: TableProps<T>) => {
    const [translations, selectedLang] = useTranslations()

    /* The search query is set to an initial value passed down from Dashboard.js. 
       This prevents the search query from resetting after switching the stage/step. */
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery)

    /* This boolean is set to true when the user types in a new search query. 
       This prevents fetching patient twice on load or after swiching the stage/step. */
    const [isSearchQueryUpdated, setIsSearchQueryUpdated] = useState(false)

    useEffect(() => {
        const searchDelay = setTimeout(() => {
            if (isSearchQueryUpdated) {
                handleSearchQuery(searchQuery)
            }
        }, PATIENT_TABLE_SEARCH_DELAY)

        return () => clearTimeout(searchDelay)
    }, [searchQuery, isSearchQueryUpdated])

    const updateSearchQuery = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchQuery(event.target.value)
        setIsSearchQueryUpdated(true)
    }

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
                    <Button className="create-patient-button" onClick={onCreateRow}>
                        {addRowButtonTitle}
                    </Button>
                </div>
            </div>
            <SimpleTable<T>
                isLoading={isLoading}
                data={data}
                headers={headers}
                rowData={rowData}
                renderHeader={renderHeader}
                renderTableRow={renderTableRow}
            />
        </div>
    )
}

export default Table
