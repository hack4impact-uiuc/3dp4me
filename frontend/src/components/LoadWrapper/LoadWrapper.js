import React from 'react';
import PropTypes from 'prop-types';

const LoadWrapper = ({ loading, children }) => {
    if (loading) {
        return <></>;
    }
    return <>{children}</>;
};

LoadWrapper.propTypes = {
    loading: PropTypes.bool.isRequired,
    children: PropTypes.elementType,
};

export default LoadWrapper;
