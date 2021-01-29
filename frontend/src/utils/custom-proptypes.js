import PropTypes from 'prop-types';

export const LanguageDataType = PropTypes.shape({
    translations: PropTypes.object,
    selectedLanuage: PropTypes.string,
});

export const BoolGetterSetterType = PropTypes.shape({
    state: PropTypes.bool.isRequired,
    setState: PropTypes.func.isRequired,
});

export const StringGetterSetterType = PropTypes.shape({
    state: PropTypes.bool.isRequired,
    setState: PropTypes.func.isRequired,
});
