import { useCallback, useContext } from 'react'

import { ReducerActionType } from '../store/Reducer'
import { Context } from '../store/Store'

/**
 * Custom hook that creates an error wrapper. If an error is thrown in the
 * error wrapper, then the global error is set and the error modal automatically
 * appears over the screen. There is a callback for when a request is successfully completed,
 * and a callback when a request errors out.
 */

const defaultSuccessCallback = () => {}
const defaultErrorCallback = () => {}

export const useErrorWrap = () => {
    const dispatch = useContext(Context)[1]
    const errorWrapper = useCallback(
        async (
            func: () => Promise<void> | void,
            successCallback = defaultSuccessCallback,
            errorCallback = defaultErrorCallback
        ) => {
            try {
                if (func) await func()
                await successCallback()
            } catch (error) {
                console.error(error)
                dispatch({
                    type: ReducerActionType.SET_ERROR,
                    error: (error as any)?.message || 'An error occurred',
                })
                await errorCallback()
            }
        },
        [dispatch]
    )

    return errorWrapper
}
