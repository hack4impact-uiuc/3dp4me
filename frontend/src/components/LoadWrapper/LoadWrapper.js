import React from 'react';

const LoadWrapper = ({ loading, children }) => {
    if (loading) {
        return <></>;
    }
    return <>{children}</>;
};

export default LoadWrapper;
