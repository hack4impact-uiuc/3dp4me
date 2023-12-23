import { TranslatedString } from "./translatedString";

export interface Role {
    roleName: {
        type: TranslatedString,
    },
    roleDescription: {
        type: TranslatedString,
    },
    isHidden: boolean,
    isMutable: boolean
}