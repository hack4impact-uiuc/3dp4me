import { TranslatedString } from '@3dp4me/types'

export interface FormOption {
    _id: string
    IsHidden: boolean
    Question: TranslatedString
}

export interface TagOption {
    _id: string
    IsHidden: boolean
    TagTitle: TranslatedString
}
