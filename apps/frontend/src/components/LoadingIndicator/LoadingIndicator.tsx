import './LoadingIndicator.scss'

import { TailSpin } from 'react-loader-spinner'
import { usePromiseTracker } from 'react-promise-tracker'

const LoadingIndicator = () => {
    const { promiseInProgress } = usePromiseTracker()
    if (!promiseInProgress) return null

    return (
        <div className="loading-indicator">
            <TailSpin color="#323366" height="100" width="100" />
        </div>
    )
}

export default LoadingIndicator
