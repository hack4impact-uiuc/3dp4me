import React from 'react';
import PropTypes from 'prop-types';

/**
 * Wraps a component. While loading is true, nothing is returned. Once loading is
 * false, all children are rendered
 */
const LoadWrapper = ({ loading, children }) => {
    if (loading) {
        return <></>;
    }
    return <>{children}</>;
};

LoadWrapper.propTypes = {
    loading: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
};

export default LoadWrapper;
