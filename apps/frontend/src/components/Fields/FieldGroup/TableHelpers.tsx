import { Field, Language } from "@3dp4me/types"
import { ColumnMetadata, Header } from "../../../utils/table-renderers"
import { StyledTableCell } from '../../SimpleTable/SimpleTable.style';
import XIcon from '../../../assets/x-icon.png'
import AddIcon from '@material-ui/icons/Add';

export const RENDER_PLUS_ICON = "RENDER_PLUS_ICON"

export function getTableData(value: any, isDisabled: boolean) {
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

function addGroupNumberToTableRowData(data: any, idx: number) {
    if (typeof data !== "object")
        throw new Error(`Invalid value type ${data} at index ${idx}`)

    return {
        ...data,
        groupNum: idx,
    }
}

export function getTableHeaders(metadata: Field, selectedLang: Language, isDisabled: boolean): Header<any>[] {
    const fieldHeaders = metadata?.subFields?.map((field => ({
        title: field.displayName[selectedLang],
        sortKey: field.key,
    })))

    if (isDisabled) return fieldHeaders

    // Add empty heaader for the X button
    return fieldHeaders.concat({
        title: "",
        sortKey: ""
    })
}