import { useContext, useCallback } from 'react';

import { Context } from '../store/Store';
import { REDUCER_ACTIONS } from '../utils/constants';

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
                    error: error.toString(),
                });
            }
        },
        [dispatch],
    );

    return errorWrapper;
};
