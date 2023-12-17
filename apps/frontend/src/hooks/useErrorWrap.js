import { useContext, useCallback } from 'react';

import { Context } from '../store/Store';
import { REDUCER_ACTIONS } from '../utils/constants';

/**
 * Custom hook that creates an error wrapper. If an error is thrown in the
 * error wrapper, then the global error is set and the error modal automatically
 * appears over the screen. There is a callback for when a request is successfully completed,
 * and a callback when a request errors out.
 */

const defaultSuccessCallback = () => {};
const defaultErrorCallback = () => {};

export const useErrorWrap = () => {
    const dispatch = useContext(Context)[1];
    const errorWrapper = useCallback(
        async (
            func,
            successCallback = defaultSuccessCallback,
            errorCallback = defaultErrorCallback,
        ) => {
            try {
                if (func) await func();
                successCallback();
            } catch (error) {
                console.error(error);
                dispatch({
                    type: REDUCER_ACTIONS.SET_ERROR,
                    error: error.message,
                });
                errorCallback();
            }
        },
        [dispatch],
    );

    return errorWrapper;
};
