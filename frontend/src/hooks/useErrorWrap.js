import { useContext } from 'react';
import { Context } from '../store/Store';
import { REDUCER_ACTIONS } from '../utils/constants';

export const useErrorWrap = (func) => {
    const [state, dispatch] = useContext(Context);

    try {
        if (func) func();
    } catch (error) {
        dispatch({ type: REDUCER_ACTIONS.SET_ERROR, error: error.message });
    }
};
