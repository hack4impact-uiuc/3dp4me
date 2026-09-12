import './SimpleTable.scss'

import { Nullish } from '@3dp4me/types'
import Paper from '@mui/material/Paper'
import MaterialUITable from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React, { CSSProperties, useMemo } from 'react'

import useSortableData, { SortConfig } from '../../hooks/useSortableData'
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

    // When provided, sorting is controlled by the parent (e.g. the data was
    // already sorted server-side) instead of being sorted locally.
    sortConfig?: Nullish<SortConfig<T>>
    onRequestSort?: (key: any) => void
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
    sortConfig: controlledSortConfig,
    onRequestSort,
}: SimpleTableProps<T>) => {
    const selectedLang = useTranslations()[1]
    const localSort = useSortableData(data)

    // If the parent controls sorting (e.g. server-side sort), use the data
    // as-is and defer to the parent's sort state/handler instead of sorting locally.
    const isControlled = onRequestSort !== undefined
    const sortedData = isControlled ? data : localSort.sortedData
    const sortConfig = isControlled ? controlledSortConfig : localSort.sortConfig
    const requestSort = isControlled ? onRequestSort : localSort.requestSort

    const renderedHeaders = useMemo(
        () => renderHeader(headers, sortConfig, requestSort, selectedLang),
        [headers, sortConfig, requestSort, selectedLang]
    )

    const renderTableBody = () => {
        if (isLoading) {
            return new Array(numLoaderRows).fill(0).map((_, i) => (
                <TableRow key={`row-${i}`} style={rowStyle} hover>
                    {renderLoadingTableRow(renderedHeaders.length, selectedLang)}
                </TableRow>
            ))
        }

        if (!sortedData || !rowData) return null
        return sortedData.map((patient) => (
            <TableRow key={patient._id} style={rowStyle} hover>
                {renderTableRow(rowData, patient, selectedLang)}
            </TableRow>
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
