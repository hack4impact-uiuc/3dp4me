import { usePromiseTracker } from 'react-promise-tracker';
import { TailSpin } from 'react-loader-spinner';
import './LoadingIndicator.scss';

const LoadingIndicator = () => {
    const { promiseInProgress } = usePromiseTracker();
    if (!promiseInProgress) return null;

    return (
        <div className="loading-indicator">
            <TailSpin
                color="#323366"
                height="100"
                width="100"
            />
        </div>
    );
};

export default LoadingIndicator;
