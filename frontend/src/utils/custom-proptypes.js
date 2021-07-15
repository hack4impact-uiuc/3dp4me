import PropTypes from 'prop-types';

export const FieldsType = PropTypes.shape({
    fields: PropTypes.array.isRequired,
});

export const TableHeaderType = PropTypes.shape({
    title: PropTypes.string.isRequired,
    sortKey: PropTypes.string.isRequired,
});

export const BoolGetterSetterType = PropTypes.shape({
    state: PropTypes.bool.isRequired,
    setState: PropTypes.func.isRequired,
});

export const StringGetterSetterType = PropTypes.shape({
    state: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
});

export const fieldType = PropTypes.shape({
    state: PropTypes.string.isRequired,
});
