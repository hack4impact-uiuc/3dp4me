import PropTypes from 'prop-types';

export const FieldsType = PropTypes.shape({
    fields: PropTypes.array.isRequired,
});

/**
 * Format for a single table header.
 * title: A string for the header title.
 * sortKey: A unique identifier for this header.
 */
export const TableHeaderType = PropTypes.shape({
    title: PropTypes.string.isRequired,
    sortKey: PropTypes.string.isRequired,
});

/**
 * Format for a single table row data entry.
 * id: A unique identifier for this column in the row. Should match one of the sortKeys.
 * dataType: The data type of this entry. Should match a field type from constants.js
 */
export const TableRowType = PropTypes.shape({
    id: PropTypes.string,
    dataType: PropTypes.string,
});

// TODO: remove these
export const fieldType = PropTypes.shape({
    state: PropTypes.string.isRequired,
});

/**
 * Format of the 'options' attatched to a field. See the field
 * schema in metadata.js in the backend
 */
export const FieldOptionsType = PropTypes.arrayOf(
    PropTypes.shape({
        IsHidden: PropTypes.bool.isRequired,
        _id: PropTypes.string.isRequired,
        Question: PropTypes.shape({
            EN: PropTypes.string.isRequired,
            AR: PropTypes.string.isRequired,
        }),
    }),
);
