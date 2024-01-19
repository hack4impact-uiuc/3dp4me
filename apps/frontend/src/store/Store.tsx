import { Language } from '@3dp4me/types'
import PropTypes from 'prop-types'
import React, { createContext, ReactNode, useReducer } from 'react'

import { Reducer, ReducerAction, ReducerState } from './Reducer'

const initialState: ReducerState = {
    error: '',
    isErrorVisible: false,
    language: Language.EN,
    isAdmin: false,
}

export interface StoreProps {
    children: ReactNode
}

const Store = ({ children }: StoreProps) => {
    const [state, dispatch] = useReducer(Reducer, initialState)
    return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
}

export const Context = createContext(initialState) as any as React.Context<
    [ReducerState, React.Dispatch<ReducerAction>]
>

Store.propTypes = {
    children: PropTypes.element,
}
export default Store
