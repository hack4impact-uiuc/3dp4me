import { useContext } from 'react';
import { Context } from '../store/Store';
import { REDUCER_ACTIONS } from '../utils/constants';

export const useErrorWrap = (func) => {
    if (!func) return;

    const [state, dispatch] = useContext(Context);

    try {
        func();
    } catch (error) {
        dispatch({ type: REDUCER_ACTIONS.SET_ERROR, error: message });
    }
};
