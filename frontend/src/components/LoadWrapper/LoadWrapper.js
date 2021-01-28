import React from 'react';

const LoadWrapper = (props) => {
    if (props.loading) {
        return <></>;
    } else {
        return <>{props.children}</>;
    }
};

export default LoadWrapper;
