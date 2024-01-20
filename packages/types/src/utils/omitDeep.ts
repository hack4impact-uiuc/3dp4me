/* eslint-disable @typescript-eslint/no-explicit-any */
export type OmitDeep<T, K extends keyof any> = {
    [P in keyof T as P extends K ? never : P]: T[P] extends object ? OmitDeep<T[P], K> : T[P]
}
