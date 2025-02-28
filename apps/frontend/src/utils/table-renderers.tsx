import { AccessLevel, FieldType, Language, Nullish, Path, Patient } from '@3dp4me/types'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import IconButton from '@mui/material/IconButton'
import React, { ReactNode } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Link } from 'react-router-dom'

import Eyecon from '../assets/view.svg'
import { StyledTableCell } from '../components/SimpleTable/SimpleTable.style'
import { SortConfig } from '../hooks/useSortableData'
import translations from '../translations.json'
import { DisplayFieldType, SortDirection } from './constants'
import { fieldToJSX } from './fields'
import { resolveObjPath } from './object'

/**
 * Given item data, a field key, and a field type, this function finds
 * the data and formats it accordingly.
 * @param {Object} data The data
 * @param {String} fieldKey The field key. Can be nested with '.' (i.e. 'medicalInfo.data.options')
 * @param {*} fieldType The field type of the data that will be retrieved
 * @returns A stringified, formated version of the data.
 */
const getField = <T extends Record<string, any>, P extends Path<T>>(
    data: T,
    fieldKey: P,
    fieldType: FieldType | DisplayFieldType,
    selectedLang: Language
): ReactNode => {
    // Need to cast as any, TS can't resolve recursive generic
    const fieldData = resolveObjPath<T, P>(data, fieldKey)
    return fieldToJSX(fieldData, fieldType, selectedLang)
}

/**
 * Renders a sort arrow. Will either be up or down depending on the direction in the config.
 * @param {Object} sortConfig The config object. Must have the key for the selected column and the direction.
 * @param {Object} sortKey The key for this column. This is compared with sortConfig key to only make the arrow
 *                         visible when this column is being sorted.
 * @returns The arrow
 */
const renderSortArrow = (sortConfig: Nullish<SortConfig<any>>, sortKey: string) => {
    if (!sortConfig || sortConfig.key !== sortKey) return null

    switch (sortConfig.direction) {
        case SortDirection.Ascending:
            return <ArrowDropUpIcon className="dropdown-arrow" />
        case SortDirection.Descending:
            return <ArrowDropDownIcon className="dropdown-arrow" />
        case SortDirection.None:
            return null
        default:
            console.error(`Invalid sort direction: '${sortConfig.direction}'`)
    }

    return null
}

// Represents the data type and the id used to index the data for this column in a row
export interface ColumnMetadata<T extends Record<string, any>> {
    id: Path<T>
    dataType: DisplayFieldType | FieldType
}

/**
 * Given data, constructs an array of cells for the row. By placing each
 * header item into it's own cell
 * @param {Array} rowData An array containing the id and type of each column in a row.
 * @param {Array} itemData An array containing the data of the row entry.
 * @param {String} selectedLang The currently selected language.
 * @returns Array of cells
 */
export const defaultTableRowRenderer = <T extends Record<string, any>>(
    rowData: ColumnMetadata<T>[],
    itemData: T,
    selectedLang: Language
) => {
    const cellClassName = selectedLang === Language.AR ? 'cell-rtl' : 'cell'
    const cellAlign = selectedLang === Language.AR ? 'right' : 'left'

    // Construct a cell for each piece of data
    const row = rowData.map(({ id, dataType }) => (
        <StyledTableCell
            className={cellClassName}
            key={`${itemData._id}-${id}`}
            align={cellAlign}
            variant="body"
        >
            {getField(itemData, id, dataType, selectedLang)}
        </StyledTableCell>
    ))

    return row
}

export const defaultTableRowLoadingRenderer = (numCols: number, selectedLang: Language) => {
    const row = []
    const loadDirection = selectedLang === Language.AR ? 'rtl' : 'ltr'

    for (let i = 0; i < numCols; i++) {
        row.push(
            <StyledTableCell variant="body">
                <Skeleton direction={loadDirection} inline={true} />
            </StyledTableCell>
        )
    }

    return row
}

export type RowLoadingRenderer = (numCols: number, selectedLang: Language) => ReactNode

export type HeaderRenderer<T> = (
    headers: Header<T>[],
    sortConfig: Nullish<SortConfig<T>>,
    onRequestSort: (key: Path<T>) => void,
    selectedLang: Language
) => ReactNode[]

export interface Header<T> {
    title: string
    sortKey: Path<T>
}

/**
 * Given data, constructs an array of cells for the header of a table.
 * @param {Array} headers An array containing a `title` and unique `sortKey` for each header
 * @param {Object} sortConfig Contains `key` of the selected column and its `direction`.
 * @param {function} onRequestSort Calls this function with the selected column sortKey when sort is requested.
 * @param {String} selectedLang The currently selected language.
 * @returns Array of cells
 */
export const defaultTableHeaderRenderer = <T extends Record<string, any>>(
    headers: Header<T>[],
    sortConfig: Nullish<SortConfig<T>>,
    onRequestSort: (key: Path<T>) => void,
    selectedLang: Language
) => {
    const cellAlign = selectedLang === Language.AR ? 'right' : 'left'
    const cellClassName = selectedLang === Language.AR ? 'cell-align-rtl' : 'cell-align'

    const headerCells = headers.map((header) => (
        <StyledTableCell
            onClick={() => onRequestSort(header.sortKey)}
            key={header.title}
            align={cellAlign}
            variant="head"
            className="header"
        >
            <div className={cellClassName}>
                {header.title}
                {renderSortArrow(sortConfig, header.sortKey)}
            </div>
        </StyledTableCell>
    ))

    return headerCells
}

export type RowRenderer<T extends Record<string, any>> = (
    columns: ColumnMetadata<T>[],
    rowData: T,
    selectedLang: Language
) => ReactNode

/**
 * Renders a single row of patient data. Uses the default render and adds a column
 * at the end that links to patient data
 */
export const patientTableRowRenderer = (
    rowData: ColumnMetadata<Patient>[],
    patient: Patient,
    selectedLang: Language,
    stepKey: string
) => {
    // Construct the base row
    const row = defaultTableRowRenderer(rowData, patient, selectedLang)
    const link = stepKey
        ? `/patient-info/${patient._id}?stepKey=${stepKey}`
        : `/patient-info/${patient._id}`

    // Add a link to the patient's page
    row.push(
        <StyledTableCell key="view-patient-data" className="cell" align="center" variant="body">
            <Link className="table-view-link" to={link}>
                <IconButton size="large">
                    <img alt="status icon" width="18px" src={Eyecon} />
                </IconButton>{' '}
                {translations[selectedLang].components.table.view}
            </Link>
        </StyledTableCell>
    )

    return row
}

/**
 * Renders header for patient data. Uses the default render and adds a column
 * at the end for the 'view patient' link
 */
export const patientTableHeaderRenderer = <T extends Record<string, any>>(
    headers: Header<T>[],
    sortConfig: Nullish<SortConfig<T>>,
    onRequestSort: (key: Path<T>) => void,
    selectedLang: Language
) => {
    const headerCells = defaultTableHeaderRenderer(headers, sortConfig, onRequestSort, selectedLang)
    headerCells.push(
        <StyledTableCell key="view-patient" align="center" variant="head" className="header" />
    )
    return headerCells
}

export interface UserRowData {
    Username: string
    Name: string
    Email: string
    Roles: string
    Access: AccessLevel
}

/**
 * Creates a userTableRowRenderer with onSelected bound
 * @param {Function} onSelected The function to bind to onSelected
 * @returns The bound renderer
 */
export const generateSelectableRenderer =
    <T extends Record<string, any>>(onSelected: (item: T) => void): RowRenderer<T> =>
    (rowData, user, selectedLang) => {
        // Construct the base row
        const row = defaultTableRowRenderer(rowData, user, selectedLang)

        // Add the edit button
        row.push(
            <StyledTableCell
                key="view-user-data"
                className="cell cell-right"
                align="center"
                variant="body"
            >
                <IconButton onClick={() => onSelected(user)} size="large">
                    <img alt="status icon view-icon" width="18px" src={Eyecon} />
                </IconButton>{' '}
            </StyledTableCell>
        )

        return row
    }
/**
 * Renders header for user data. Uses the default render and adds a column
 * at the end for the 'view user' button
 */
export const userTableHeaderRenderer = <T extends Record<string, any>>(
    headers: Header<T>[],
    sortConfig: Nullish<SortConfig<T>>,
    onRequestSort: (key: Path<T>) => void,
    selectedLang: Language
) => {
    const headerCells = defaultTableHeaderRenderer(headers, sortConfig, onRequestSort, selectedLang)
    headerCells.push(
        <StyledTableCell key="view-user" align="center" variant="head" className="header" />
    )
    return headerCells
}
