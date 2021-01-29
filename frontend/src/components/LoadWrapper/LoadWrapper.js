import React from 'react';

const LoadWrapper = (props) => {
    if (props.loading) {
        return <></>;
    }
    return <>{props.children}</>;
};

export default LoadWrapper;
