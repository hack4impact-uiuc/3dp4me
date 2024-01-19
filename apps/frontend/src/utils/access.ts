import { AccessLevel } from '@3dp4me/types'

export const isAccessLevel = (maybeAccess: unknown): maybeAccess is AccessLevel =>
    Object.values(AccessLevel).includes(maybeAccess as AccessLevel)
