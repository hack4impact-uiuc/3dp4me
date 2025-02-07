import { Language } from "@3dp4me/types"
import { ColumnMetadata } from "../../../utils/table-renderers"
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
