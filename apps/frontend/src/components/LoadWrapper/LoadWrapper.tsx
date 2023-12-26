import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';

export interface LoadWrapperProps {
    loading: boolean
    children: ReactNode
}

/**
 * Wraps a component. While loading is true, nothing is returned. Once loading is
 * false, all children are rendered
 */
const LoadWrapper = ({ loading, children }: LoadWrapperProps) => {
    if (loading) {
        return <></>;
    }
    return <>{children}</>;
};

export default LoadWrapper;
