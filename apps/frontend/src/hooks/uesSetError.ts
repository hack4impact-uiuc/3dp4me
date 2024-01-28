import { useContext, useMemo } from "react"
import { Context } from '../store/Store'
import { ReducerActionType } from "../store/Reducer"

export const useSetError = () => {
    const dispatch = useContext(Context)[1]
    return useMemo(() => (msg?: string) => {
        dispatch({
            type: ReducerActionType.SET_ERROR,
            error: msg || 'An error occurred',
        })

    }, [dispatch])
}