import React from 'react';
import { StyledTableCell } from '../components/Table/MainTable.style';
import { LANGUAGES } from './constants';
import { fieldToJSX } from './fields';
import { resolveObjPath } from './object';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

const SORT_DIRECTIONS = {
    AESC: 'ascending',
    DESC: 'descending',
};

/**
 * Given item data, a field key, and a field type, this function finds
 * the data and formats it accordingly.
 * @param {Object} patient The data
 * @param {String} fieldKey The field key. Can be nested with '.' (i.e. 'medicalInfo.data.options')
 * @param {*} fieldType The field type of the data that will be retrieved
 * @returns A stringified, formated version of the data.
 */
const getField = (patient, fieldKey, fieldType, selectedLang) => {
    const fieldData = resolveObjPath(patient, fieldKey);
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
    if (!sortConfig || sortConfig.key !== sortKey) return;

    if (sortConfig.direction === SORT_DIRECTIONS.AESC)
        return <ArrowDropUpIcon className="dropdown-arrow" />;
    if (sortConfig.direction === SORT_DIRECTIONS.DESC)
        return <ArrowDropDownIcon className="dropdown-arrow" />;

    console.error(`Invalid sort direction: '${sortConfig.direction}'`);
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

    // Construct a cell for each piece of patient data
    let row = rowData.map(({ id, dataType }) => (
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

    let headerCells = headers.map((header) => (
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
