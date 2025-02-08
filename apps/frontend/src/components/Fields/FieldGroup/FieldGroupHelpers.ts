import { Field, FieldType } from "@3dp4me/types";

export interface FieldGroupListTableProps {
    isDisabled: boolean
    onSimpleUpdate: (field: string, value: any, idx: number) => void
    onFileDownload: (field: string, value: any, idx: number) => void
    onFileUpload: (field: string, value: any, idx: number) => void
    onFileDelete: (field: string, value: any, idx: number) => void
    onRemoveGroup: (idx: number) => void
    onAddGroup: () => void
    stepKey?: string
    fieldPathPrefix?: string
    patientId?: string
    value?: any
    metadata: Field
}

export function canFieldGroupBeDisplayedInTable(metadata: Field) {
    const invalidSubfield = metadata.subFields.find((field) => {
        return !canFieldBeDisplayedInTable(field)
    })

    return invalidSubfield === undefined
}

function canFieldBeDisplayedInTable(metadata: Field) {
    switch (metadata.fieldType) {
        case FieldType.NUMBER:
        case FieldType.STRING:
        case FieldType.MULTILINE_STRING:
        case FieldType.DATE:
        case FieldType.PHONE:
            return true
        default:
            return false
    }
}

export function getNumFields(value: any): number {
    return value?.length ?? 0
}

export function getKeyBase(metadata: Field, index: number) {
    return `${metadata.key}.${index}`
}

export function getCompleteSubFieldKey(metadata: Field, index: number, subfieldKey: string) {
    return `${getKeyBase(metadata, index)}.${subfieldKey}`
}