import './SimpleTable.scss'

import Paper from '@material-ui/core/Paper'
import MaterialUITable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import React from 'react'

import useSortableData from '../../hooks/useSortableData'
import { useTranslations } from '../../hooks/useTranslations'
import { ColumnMetadata, Header, HeaderRenderer, RowRenderer } from '../../utils/table-renderers'
import { StyledTableRow } from './SimpleTable.style'

export interface SimpleTableProps<T extends Record<string, any>> {
    data: T[]
    headers: Header<T>[]
    rowData: ColumnMetadata<T>[]
    renderHeader: HeaderRenderer<T>
    renderTableRow: RowRenderer<T>
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
}: SimpleTableProps<T>) => {
    const selectedLang = useTranslations()[1]
    const { sortedData, requestSort, sortConfig } = useSortableData(data)

    const renderTableBody = () => {
        if (!sortedData || !rowData) return null

        return sortedData.map((patient) => (
            <StyledTableRow key={patient._id}>
                {renderTableRow(rowData, patient, selectedLang)}
            </StyledTableRow>
        ))
    }

    return (
        <div className="table-container">
            <TableContainer className="table-container" component={Paper}>
                <MaterialUITable stickyHeader className="table">
                    <TableHead>
                        <TableRow>
                            {renderHeader(headers, sortConfig, requestSort, selectedLang)}
                        </TableRow>
                    </TableHead>
                    <TableBody className="table-body">{renderTableBody()}</TableBody>
                </MaterialUITable>
            </TableContainer>
        </div>
    )
}

export default SimpleTable
