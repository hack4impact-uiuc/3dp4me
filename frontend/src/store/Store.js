import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

import { LANGUAGES } from '../utils/constants';

import Reducer from './Reducer';

const initialState = {
    error: '',
    isErrorVisible: false,
    language: LANGUAGES.EN,
    isAdmin: false,
    username: '',
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
