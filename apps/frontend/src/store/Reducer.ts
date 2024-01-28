import { Language, Nullish } from '@3dp4me/types'
import { Reducer as ReducerType } from 'react'

export enum ReducerActionType {
    SET_ERROR = 'SET_ERROR',
    CLEAR_ERROR = 'CLEAR_ERROR',
    SET_LANGUAGE = 'SET_LANGUAGE',
    SET_ADMIN_STATUS = 'SET_ADMIN_STATUS',
}

export interface ReducerState {
    error: Nullish<string>
    isErrorVisible: Nullish<boolean>
    language: Language
    isAdmin: Nullish<boolean>
}

export interface ReducerAction extends Partial<ReducerState> {
    type: ReducerActionType
}

export const Reducer: ReducerType<ReducerState, ReducerAction> = (state, action) => {
    switch (action.type) {
        case ReducerActionType.SET_LANGUAGE:
            return {
                ...state,
                language: action.language || Language.EN,
            }
        case ReducerActionType.SET_ERROR:
            return {
                ...state,
                error: action.error,
                isErrorVisible: true,
            }
        case ReducerActionType.CLEAR_ERROR:
            return {
                ...state,
                isErrorVisible: false,
            }
        case ReducerActionType.SET_ADMIN_STATUS:
            return {
                ...state,
                isAdmin: action.isAdmin,
            }
        default:
            return state
    }
}
