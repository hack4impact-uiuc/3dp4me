import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import Reducer from './Reducer';
import { LANGUAGES } from '../utils/constants';

const initialState = {
    error: '',
    isErrorVisible: false,
    language: LANGUAGES.EN,
};

const Store = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    );
};

export const Context = createContext(initialState);

Store.propTypes = {
    children: PropTypes.element,
};
export default Store;
