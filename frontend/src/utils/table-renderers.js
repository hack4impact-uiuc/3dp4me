import { IconButton } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import React from 'react';
import { Link } from 'react-router-dom';

import Eyecon from '../assets/view.svg';
import { StyledTableCell } from '../components/SimpleTable/SimpleTable.style';
import translations from '../translations.json';

import { LANGUAGES, SORT_DIRECTIONS } from './constants';
import { fieldToJSX } from './fields';
import { resolveObjPath } from './object';

/**
 * Given item data, a field key, and a field type, this function finds
 * the data and formats it accordingly.
 * @param {Object} data The data
 * @param {String} fieldKey The field key. Can be nested with '.' (i.e. 'medicalInfo.data.options')
 * @param {*} fieldType The field type of the data that will be retrieved
 * @returns A stringified, formated version of the data.
 */
const getField = (data, fieldKey, fieldType, selectedLang) => {
    const fieldData = resolveObjPath(data, fieldKey);
    return fieldToJSX(fieldData, fieldType, selectedLang);
};

/**
 * Renders a sort arrow. Will either be up or down depending on the direction in the config.
 * @param {Object} sortConfig The config object. Must have the key for the selected column and the direction.
 * @param {Object} sortKey The key for this column. This is compared with sortConfig key to only make the arrow
 *                         visible when this column is being sorted.
 * @returns The arrow
 */
const renderSortArrow = (sortConfig, sortKey) => {
    if (!sortConfig || sortConfig.key !== sortKey) return null;

    switch (sortConfig.direction) {
        case SORT_DIRECTIONS.AESC:
            return <ArrowDropUpIcon className="dropdown-arrow" />;
        case SORT_DIRECTIONS.DESC:
            return <ArrowDropDownIcon className="dropdown-arrow" />;
        case SORT_DIRECTIONS.NONE:
            return null;
        default:
            console.error(`Invalid sort direction: '${sortConfig.direction}'`);
    }

    return null;
};

/**
 * Given data, constructs an array of cells for the row. By placing each
 * header item into it's own cell
 * @param {Array} rowData An array containing the id and type of each column in a row.
 * @param {Array} itemData An array containing the data of the row entry.
 * @param {String} selectedLang The currently selected language.
 * @returns Array of cells
 */
export const defaultTableRowRenderer = (rowData, itemData, selectedLang) => {
    const cellClassName = selectedLang === LANGUAGES.AR ? 'cell-rtl' : 'cell';
    const cellAlign = selectedLang === LANGUAGES.AR ? 'right' : 'left';

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
/**
 * Given data, constructs an array of cells for the header of a table.
 * @param {Array} headers An array containing a `title` and unique `sortKey` for each header
 * @param {Object} sortConfig Contains `key` of the selected column and its `direction`.
 * @param {function} onRequestSort Calls this function with the selected column sortKey when sort is requested.
 * @param {String} selectedLang The currently selected language.
 * @returns Array of cells
 */
export const defaultTableHeaderRenderer = (
    headers,
    sortConfig,
    onRequestSort,
    selectedLang,
) => {
    const cellAlign = selectedLang === LANGUAGES.AR ? 'right' : 'left';
    const cellClassName =
        selectedLang === LANGUAGES.AR ? 'cell-align-rtl' : 'cell-align';

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

/**
 * Renders a single row of patient data. Uses the default render and adds a column
 * at the end that links to patient data
 */
export const patientTableRowRenderer = (
    rowData,
    patient,
    selectedLang,
    stepKey,
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
export const patientTableHeaderRenderer = (
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

/**
 * This is an object instead of a function because we need to bind onSelected. See generateUserTableRowRenderer.
 */
const userTableRowRenderer = {
    /**
     * Function called when a user is selected
     */
    onSelected: undefined,

    /**
     * Renders a single row of user data. Uses the default render and adds a column
     * at the end that links to user editing modal
     */
    Renderer(rowData, user, selectedLang) {
        // Construct the base row
        const row = defaultTableRowRenderer(rowData, user, selectedLang);

        // Add the edit button
        row.push(
            <StyledTableCell
                key="view-user-data"
                className="cell cell-right"
                align="center"
            >
                <IconButton onClick={() => this.onSelected(user)}>
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
export const generateUserTableRowRenderer = (onSelected) =>
    userTableRowRenderer.Renderer.bind({
        onSelected,
    });

/**
 * Renders header for user data. Uses the default render and adds a column
 * at the end for the 'view user' button
 */
export const userTableHeaderRenderer = (
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
