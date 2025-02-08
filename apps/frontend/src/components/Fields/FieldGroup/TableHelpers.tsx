import { Field, Language } from '@3dp4me/types'

import { Header } from '../../../utils/table-renderers'

export const RENDER_PLUS_ICON = 'RENDER_PLUS_ICON'

export type HasGroupNumber<T> = T & { groupNum: number }

export function getTableData(value: any, isDisabled: boolean): HasGroupNumber<any>[] {
    let data = []
    if (Array.isArray(value)) {
        data = value.map(addGroupNumberToTableRowData)
    }

    if (isDisabled) {
        return data
    }

    // Special indication to render a row-wide plus icon
    return data.concat([RENDER_PLUS_ICON])
}

function addGroupNumberToTableRowData<T>(data: T, idx: number): HasGroupNumber<T> {
    if (typeof data !== 'object') throw new Error(`Invalid value type ${data} at index ${idx}`)

    return {
        ...data,
        groupNum: idx,
    }
}

export function getTableHeaders(
    metadata: Field,
    selectedLang: Language,
    isDisabled: boolean
): Header<any>[] {
    const fieldHeaders = metadata?.subFields?.map((field) => ({
        title: field.displayName[selectedLang],
        sortKey: field.key,
    }))

    if (isDisabled) return fieldHeaders

    // Add empty heaader for the X button
    return fieldHeaders.concat({
        title: '',
        sortKey: '',
    })
}
