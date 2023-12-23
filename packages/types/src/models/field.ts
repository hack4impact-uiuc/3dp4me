import { TranslatedString } from "./translatedString"

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
    Index: number,
    IsHidden: boolean,
    Question: TranslatedString
}