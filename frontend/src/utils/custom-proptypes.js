import PropTypes from 'prop-types';

export const FieldsType = PropTypes.shape({
    fields: PropTypes.array.isRequired,
});

export const TableHeaderType = PropTypes.shape({
    title: PropTypes.string.isRequired,
    sortKey: PropTypes.string.isRequired,
});

export const TableRowType = PropTypes.shape({
    id: PropTypes.string,
    dataType: PropTypes.string,
});

export const fieldType = PropTypes.shape({
    state: PropTypes.string.isRequired,
});

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
