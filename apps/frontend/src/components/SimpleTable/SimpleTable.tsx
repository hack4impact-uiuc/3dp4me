import './SimpleTable.scss'

import { Nullish } from '@3dp4me/types'
import Paper from '@mui/material/Paper'
import MaterialUITable from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React, { CSSProperties, useMemo } from 'react'

import useSortableData from '../../hooks/useSortableData'
import { useTranslations } from '../../hooks/useTranslations'
import { PEOPLE_PER_PAGE } from '../../utils/constants'
import {
    ColumnMetadata,
    defaultTableRowLoadingRenderer,
    Header,
    HeaderRenderer,
    RowLoadingRenderer,
    RowRenderer,
} from '../../utils/table-renderers'
import { StyledTableRow } from './SimpleTable.style'

export interface SimpleTableProps<T extends Record<string, any>> {
    data: Nullish<T[]>
    headers: Header<T>[]
    rowData: ColumnMetadata<T>[]
    renderHeader: HeaderRenderer<T>
    renderTableRow: RowRenderer<T>

    numLoaderRows?: number
    isLoading?: boolean
    renderLoadingTableRow?: RowLoadingRenderer
    containerStyle?: React.CSSProperties

    rowStyle?: React.CSSProperties
}

const DEFAULT_CONTAINER_STYLE: CSSProperties = {
    height: '80vh',
    width: '90%',
    margin: 'auto',
    marginTop: '6px',
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
    rowStyle,
    numLoaderRows = PEOPLE_PER_PAGE,
    isLoading = false,
    containerStyle = DEFAULT_CONTAINER_STYLE,
    renderLoadingTableRow = defaultTableRowLoadingRenderer,
}: SimpleTableProps<T>) => {
    const selectedLang = useTranslations()[1]
    const { sortedData, requestSort, sortConfig } = useSortableData(data)

    const renderedHeaders = useMemo(
        () => renderHeader(headers, sortConfig, requestSort, selectedLang),
        [headers, sortConfig, requestSort, selectedLang]
    )

    const renderTableBody = () => {
        if (isLoading) {
            return new Array(numLoaderRows).fill(0).map((_, i) => (
                <StyledTableRow key={`row-${i}`} style={rowStyle}>
                    {renderLoadingTableRow(renderedHeaders.length, selectedLang)}
                </StyledTableRow>
            ))
        }

        if (!sortedData || !rowData) return null
        return sortedData.map((patient) => (
            <StyledTableRow key={patient._id} style={rowStyle}>
                {renderTableRow(rowData, patient, selectedLang)}
            </StyledTableRow>
        ))
    }

    return (
        <div>
            <TableContainer component={Paper} style={containerStyle}>
                <MaterialUITable stickyHeader className="table3dp4me">
                    <TableHead>
                        <TableRow style={rowStyle}>{renderedHeaders}</TableRow>
                    </TableHead>
                    <TableBody className="table-body">{renderTableBody()}</TableBody>
                </MaterialUITable>
            </TableContainer>
        </div>
    )
}

export default SimpleTable
