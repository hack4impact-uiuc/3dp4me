import { AccessLevel } from "@3dp4me/types";

export const isAccessLevel = (maybeAccess: unknown): maybeAccess is AccessLevel => {
    return Object.values(AccessLevel).includes(maybeAccess as AccessLevel);
}