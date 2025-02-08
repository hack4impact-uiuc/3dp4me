import { Field, FieldType } from "@3dp4me/types";

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