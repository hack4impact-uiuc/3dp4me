import './SimpleTable.scss'

import Paper from '@material-ui/core/Paper'
import MaterialUITable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import React, { useEffect, useMemo } from 'react'

import useSortableData from '../../hooks/useSortableData'
import { useTranslations } from '../../hooks/useTranslations'
import { ColumnMetadata, Header, HeaderRenderer, RowRenderer, RowLoadingRenderer, defaultTableRowLoadingRenderer } from '../../utils/table-renderers';
import { StyledTableRow } from './SimpleTable.style'
import { Nullish } from '@3dp4me/types'
import { PEOPLE_PER_PAGE } from '../../utils/constants'

export interface SimpleTableProps<T extends Record<string, any>> {
    data: Nullish<T[]>
    headers: Header<T>[]
    rowData: ColumnMetadata<T>[]
    renderHeader: HeaderRenderer<T>
    renderTableRow: RowRenderer<T>

    numLoaderRows?: number
    isLoading?: boolean
    renderLoadingTableRow?: RowLoadingRenderer
}

/**
 * Just a normal, old, simple table.
 */
const SimpleTable = <T extends Record<string, any>>({
    data,
    headers,
    rowData,
    renderHeader,
    renderTableRow,
    numLoaderRows = PEOPLE_PER_PAGE,
    isLoading = false,
    renderLoadingTableRow = defaultTableRowLoadingRenderer,
}: SimpleTableProps<T>) => {
    const selectedLang = useTranslations()[1]
    const { sortedData, requestSort, sortConfig } = useSortableData(data)

    const renderedHeaders = useMemo(() => {
        return renderHeader(headers, sortConfig, requestSort, selectedLang)
    }, [headers, sortConfig, requestSort, selectedLang])

    const renderTableBody = () => {
        if (isLoading) {
            return new Array(numLoaderRows).fill(0).map((_, i) => (
                <StyledTableRow key={`row-${i}`}>
                    {renderLoadingTableRow(renderedHeaders.length, selectedLang)}
                </StyledTableRow>
            ))
        }

        if (!sortedData || !rowData) return null
        return sortedData.map((patient) => (
                <StyledTableRow key={patient._id}>
                    {renderTableRow(rowData, patient, selectedLang)}
                </StyledTableRow>
            )
        )
    }

    return (
        <div className="table-container">
            <TableContainer className="table-container" component={Paper}>
                <MaterialUITable stickyHeader className="table">
                    <TableHead>
                        <TableRow>
                            {renderedHeaders}
                        </TableRow>
                    </TableHead>
                    <TableBody className="table-body">{renderTableBody()}</TableBody>
                </MaterialUITable>
            </TableContainer>
        </div>
    )
}

export default SimpleTable
