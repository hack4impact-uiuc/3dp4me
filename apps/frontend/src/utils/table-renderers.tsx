import { IconButton } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import Eyecon from '../assets/view.svg';
import { StyledTableCell } from '../components/SimpleTable/SimpleTable.style';
import translations from '../translations.json';
import { fieldToJSX } from './fields';
import { Path, resolveObjPath } from './object';
import { AccessLevel, FieldType, Language, Nullish, Patient, Step } from '@3dp4me/types';
import { SortDirection } from './constants';
import { SortConfig } from '../hooks/useSortableData';

/**
 * Given item data, a field key, and a field type, this function finds
 * the data and formats it accordingly.
 * @param {Object} data The data
 * @param {String} fieldKey The field key. Can be nested with '.' (i.e. 'medicalInfo.data.options')
 * @param {*} fieldType The field type of the data that will be retrieved
 * @returns A stringified, formated version of the data.
 */
const getField = <T extends Record<string, any>, P extends Path<T>>(data: T, fieldKey: P, fieldType: FieldType, selectedLang: Language): ReactNode => {
    // Need to cast as any, TS can't resolve recursive generic
    const fieldData = resolveObjPath<T, P>(data, fieldKey);
    return fieldToJSX(fieldData, fieldType, selectedLang);
};

/**
 * Renders a sort arrow. Will either be up or down depending on the direction in the config.
 * @param {Object} sortConfig The config object. Must have the key for the selected column and the direction.
 * @param {Object} sortKey The key for this column. This is compared with sortConfig key to only make the arrow
 *                         visible when this column is being sorted.
 * @returns The arrow
 */
const renderSortArrow = (sortConfig: Nullish<SortConfig>, sortKey: string) => {
    if (!sortConfig || sortConfig.key !== sortKey) return null;

    switch (sortConfig.direction) {
        case SortDirection.Ascending:
            return <ArrowDropUpIcon className="dropdown-arrow" />;
        case SortDirection.Descending:
            return <ArrowDropDownIcon className="dropdown-arrow" />;
        case SortDirection.None:
            return null;
        default:
            console.error(`Invalid sort direction: '${sortConfig.direction}'`);
    }

    return null;
};

// Represents the data type and the id used to index the data for this column in a row
export interface ColumnMetadata<T extends Record<string, any>> {
    id: Path<T>,
    dataType: FieldType
}

/**
 * Given data, constructs an array of cells for the row. By placing each
 * header item into it's own cell
 * @param {Array} rowData An array containing the id and type of each column in a row.
 * @param {Array} itemData An array containing the data of the row entry.
 * @param {String} selectedLang The currently selected language.
 * @returns Array of cells
 */
export const defaultTableRowRenderer = <T extends Record<string, any>>(rowData: ColumnMetadata<T>[], itemData: T, selectedLang: Language) => {
    const cellClassName = selectedLang === Language.AR ? 'cell-rtl' : 'cell';
    const cellAlign = selectedLang === Language.AR ? 'right' : 'left';

    // Construct a cell for each piece of data
    const row = rowData.map(({ id, dataType }) => (
        <StyledTableCell
            className={cellClassName}
            key={`${itemData._id}-${id}`}
            align={cellAlign}
        >
            {getField(itemData, id, dataType, selectedLang)}
        </StyledTableCell>
    ));

    return row;
};

export type HeaderRenderer = (
    headers: Header[],
    sortConfig: Nullish<SortConfig>,
    onRequestSort: (key: string) => void,
    selectedLang: Language,
) => ReactNode[];

export interface Header {
    title: string
    sortKey: string
}

/**
 * Given data, constructs an array of cells for the header of a table.
 * @param {Array} headers An array containing a `title` and unique `sortKey` for each header
 * @param {Object} sortConfig Contains `key` of the selected column and its `direction`.
 * @param {function} onRequestSort Calls this function with the selected column sortKey when sort is requested.
 * @param {String} selectedLang The currently selected language.
 * @returns Array of cells
 */
export const defaultTableHeaderRenderer: HeaderRenderer = (
    headers,
    sortConfig,
    onRequestSort,
    selectedLang,
) => {
    const cellAlign = selectedLang === Language.AR ? 'right' : 'left';
    const cellClassName =
        selectedLang === Language.AR ? 'cell-align-rtl' : 'cell-align';

    const headerCells = headers.map((header) => (
        <StyledTableCell
            onClick={() => onRequestSort(header.sortKey)}
            className="header"
            key={header.title}
            align={cellAlign}
        >
            <div className={cellClassName}>
                {header.title}
                {renderSortArrow(sortConfig, header.sortKey)}
            </div>
        </StyledTableCell>
    ));

    return headerCells;
};

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
    stepKey: string,
) => {
    // Construct the base row
    const row = defaultTableRowRenderer(rowData, patient, selectedLang);
    const link = stepKey
        ? `/patient-info/${patient._id}?stepKey=${stepKey}`
        : `/patient-info/${patient._id}`;

    // Add a link to the patient's page
    row.push(
        <StyledTableCell
            key="view-patient-data"
            className="cell"
            align="center"
        >
            <Link className="table-view-link" to={link}>
                <IconButton>
                    <img alt="status icon" width="18px" src={Eyecon} />
                </IconButton>{' '}
                {translations[selectedLang].components.table.view}
            </Link>
        </StyledTableCell>,
    );

    return row;
};

/**
 * Renders header for patient data. Uses the default render and adds a column
 * at the end for the 'view patient' link
 */
export const patientTableHeaderRenderer: HeaderRenderer = (
    headers, 
    sortConfig,
    onRequestSort,
    selectedLang,
) => {
    const headerCells = defaultTableHeaderRenderer(
        headers,
        sortConfig,
        onRequestSort,
        selectedLang,
    );
    headerCells.push(
        <StyledTableCell
            key="view-patient"
            className="header"
            align="center"
        />,
    );
    return headerCells;
};

export interface UserRowData {
    Username: string,
    Name: string,
    Email: string,
    Roles: string,
    Access: AccessLevel,
}

type OnUserSelected = (user: UserRowData) => void;

/**
 * This is an object instead of a function because we need to bind onSelected. See generateUserTableRowRenderer.
 */
const userTableRowRenderer = {
    /**
     * Function called when a user is selected
     */
    onSelected: undefined as (OnUserSelected | undefined),

    /**
     * Renders a single row of user data. Uses the default render and adds a column
     * at the end that links to user editing modal
     */
    Renderer(rowData: ColumnMetadata<UserRowData>[], user: UserRowData, selectedLang: Language) {
        // Construct the base row
        const row = defaultTableRowRenderer(rowData, user, selectedLang);

        // Add the edit button
        row.push(
            <StyledTableCell
                key="view-user-data"
                className="cell cell-right"
                align="center"
            >
                <IconButton onClick={() => this.onSelected?.(user)}>
                    <img
                        alt="status icon view-icon"
                        width="18px"
                        src={Eyecon}
                    />
                </IconButton>{' '}
                {translations[selectedLang].components.table.edit}
            </StyledTableCell>,
        );

        return row;
    },
};

/**
 * Creates a userTableRowRenderer with onSelected bound
 * @param {Function} onSelected The function to bind to onSelected
 * @returns The bound renderer
 */
export const generateUserTableRowRenderer = (onSelected: OnUserSelected) =>
    userTableRowRenderer.Renderer.bind({
        onSelected,
    });

/**
 * Renders header for user data. Uses the default render and adds a column
 * at the end for the 'view user' button
 */
export const userTableHeaderRenderer: HeaderRenderer = (
    headers,
    sortConfig,
    onRequestSort,
    selectedLang,
) => {
    const headerCells = defaultTableHeaderRenderer(
        headers,
        sortConfig,
        onRequestSort,
        selectedLang,
    );
    headerCells.push(
        <StyledTableCell key="view-user" className="header" align="center" />,
    );
    return headerCells;
};
