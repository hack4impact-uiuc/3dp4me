import { TranslatedString } from './translatedString'

export interface Role {
    roleName: TranslatedString
    roleDescription: TranslatedString
    isHidden: boolean
    isMutable: boolean
    _id: string
}
