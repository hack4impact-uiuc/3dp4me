import { Request } from 'express'

type QueryParam = string | Request['query'] | (string | Request['query'])[]

export const queryParamToString = (param: QueryParam): string => {
    if (typeof param === 'string') {
        return param
    }

    throw new Error('Invalid query param')
}

export const queryParamToBool = (param: QueryParam): boolean => {
    const str = queryParamToString(param)
    return stringToBool(str)
}

export const queryParamToNum = (param: QueryParam | number): number => {
    if (typeof param === 'number') {
        return param
    }

    const str = queryParamToString(param)
    return parseInt(str, 10)
}

const stringToBool = (value: string) => {
    const trimmedValue = value.toString().trim().toLowerCase()
    return !(trimmedValue === 'false' || trimmedValue === '0' || trimmedValue === '')
}
