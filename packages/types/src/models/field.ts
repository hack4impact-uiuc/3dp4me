import { Nullish, Unsaved } from '../utils'
import { File } from './file'
import { MapPoint } from './map'
import { Signature } from './signature'
import { TranslatedString } from './translatedString'

export enum FieldType {
    STRING = 'String',
    MULTILINE_STRING = 'MultilineString',
    FILE = 'File',
    NUMBER = 'Number',
    DATE = 'Date',
    PHONE = 'Phone',
    DIVIDER = 'Divider',
    HEADER = 'Header',
    RADIO_BUTTON = 'RadioButton',
    MULTI_SELECT = 'MultiSelect',
    AUDIO = 'Audio',
    SIGNATURE = 'Signature',
    PHOTO = 'Photo',
    FIELD_GROUP = 'FieldGroup',
    MAP = 'Map',
    TAGS = 'Tags',
}

export interface FieldTypeData {
    [FieldType.STRING]: string
    [FieldType.MULTILINE_STRING]: string
    [FieldType.FILE]: File[]
    [FieldType.NUMBER]: number
    [FieldType.DATE]: Date
    [FieldType.PHONE]: string
    [FieldType.DIVIDER]: null
    [FieldType.HEADER]: null
    [FieldType.RADIO_BUTTON]: string
    [FieldType.AUDIO]: File[]
    [FieldType.SIGNATURE]: Signature
    [FieldType.PHOTO]: File[]
    [FieldType.FIELD_GROUP]: [Record<string, FieldTypeData>]
    [FieldType.MAP]: MapPoint
    [FieldType.TAGS]: string[]
}

export interface QuestionOption {
    _id: string
    Index: number
    IsHidden: boolean
    Question: TranslatedString
}

export interface Field {
    fieldNumber: number
    key: string
    fieldType: FieldType
    options: QuestionOption[]
    isVisibleOnDashboard: boolean
    displayName: TranslatedString
    readableGroups: string[]
    writableGroups: string[]
    isHidden: boolean
    isDeleted: boolean
    additionalData: AdditionalFieldData
    subFields: Field[]
}

export type AdditionalFieldData = Nullish<SignatureAdditionalData>
export type _unsavedField = Unsaved<Omit<Field, 'key'>>
export type UnsavedField = Omit<_unsavedField, 'subFields'> & { subFields: UnsavedField[] }

export interface SignatureAdditionalData {
    defaultDocumentURL: TranslatedString
}
