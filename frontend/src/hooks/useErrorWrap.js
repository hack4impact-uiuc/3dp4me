import { useContext, useCallback } from 'react';

import { Context } from '../store/Store';
import { REDUCER_ACTIONS } from '../utils/constants';

/**
 * Custom hook that creates an error wrapper. If an error is thrown in the
 * error wrapper, then the global error is set and the error modal automatically
 * appears over the screen
 */
export const useErrorWrap = () => {
    const dispatch = useContext(Context)[1];
    const errorWrapper = useCallback(
        async (func) => {
            try {
                if (func) await func();
            } catch (error) {
                console.error(error);
                dispatch({
                    type: REDUCER_ACTIONS.SET_ERROR,
                    error: error.message,
                });
            }
        },
        [dispatch],
    );

    return errorWrapper;
};
