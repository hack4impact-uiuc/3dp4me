import PropTypes from 'prop-types';

export const LanguageDataType = PropTypes.shape({
    translations: PropTypes.arrayOf(PropTypes.object),
    selectedLanuage: PropTypes.string,
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
