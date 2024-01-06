import { Signature } from "typescript"
import { File } from "./file"
import { TranslatedString } from "./translatedString"
import { MapPoint } from "./map"

export enum FieldType {
    STRING = 'String',
    MULTILINE_STRING = 'MultilineString',
    FILE ='File',
    NUMBER =  'Number',
    DATE = 'Date',
    PHONE =  'Phone',
    DIVIDER =  'Divider',
    HEADER = 'Header',
    RADIO_BUTTON = 'RadioButton',
    MULTI_SELECT = 'MultiSelect',
    AUDIO = 'Audio',
    SIGNATURE = 'Signature',
    PHOTO =  'Photo',
    FIELD_GROUP ='FieldGroup',
    MAP = 'Map',
};

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
}

export interface Field {
    fieldNumber: number,
    key: string,
    fieldType: FieldType,
    options: QuestionOption[],
    isVisibleOnDashboard: boolean,
    displayName: TranslatedString,
    readableGroups: string[],
    writableGroups: string[],
    isHidden: boolean,
    isDeleted: boolean,
    additionalData: any
    subFields: Field[]
}

export interface QuestionOption {
    _id: string
    Index: number,
    IsHidden: boolean,
    Question: TranslatedString
}