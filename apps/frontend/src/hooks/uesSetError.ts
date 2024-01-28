import { useContext, useMemo } from 'react'

import { ReducerActionType } from '../store/Reducer'
import { Context } from '../store/Store'

export const useSetError = () => {
    const dispatch = useContext(Context)[1]
    return useMemo(
        () => (msg?: string) => {
            dispatch({
                type: ReducerActionType.SET_ERROR,
                error: msg || 'An error occurred',
            })
        },
        [dispatch]
    )
}
