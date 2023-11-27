import { Request } from 'express';

type QueryParam = string | Request['query'] | string[] | Request['query'][];

export const queryParamToString = (param: QueryParam): string => {
    if (typeof param === 'string') {
        return param;
    }

    throw new Error('Invalid query param');
}

export const queryParamToBool = (param: QueryParam): boolean => {
    const str = queryParamToString(param);
    return stringToBool(str)
}

const stringToBool = (value: string) => {
    const trimmedValue = value.toString().trim().toLowerCase();
    return !(
        trimmedValue === 'false' ||
        trimmedValue === '0' ||
        trimmedValue === ''
    );
};