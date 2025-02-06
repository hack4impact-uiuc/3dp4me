/* eslint import/no-cycle: "off" */
// Unfortunately, there has to be an import cycle, because this is by nature, recursive
import { Field, Language } from '@3dp4me/types'
import Button from '@material-ui/core/Button'
import _ from 'lodash'
import swal from 'sweetalert'

import XIcon from '../../../assets/x-icon.png'
import AddIcon from '@material-ui/icons/Add';
import { useTranslations } from '../../../hooks/useTranslations'
import SimpleTable from '../../SimpleTable/SimpleTable'
import { ColumnMetadata, defaultTableHeaderRenderer, defaultTableRowRenderer } from '../../../utils/table-renderers'
import { StyledTableCell } from '../../SimpleTable/SimpleTable.style'
import { TableCell } from '@material-ui/core'

const RENDER_PLUS_ICON = "RENDER_PLUS_ICON"

export interface FieldGroupProps {
    isDisabled: boolean
    handleSimpleUpdate: (field: string, value: any) => void
    handleFileDownload: (field: string, value: any) => void
    handleFileUpload: (field: string, value: any) => void
    handleFileDelete: (field: string, value: any) => void
    stepKey?: string
    fieldPathPrefix?: string
    patientId?: string
    value?: any
    metadata: Field
}

const FieldGroupTable = ({
    isDisabled,
    handleSimpleUpdate,
    handleFileDownload,
    handleFileUpload,
    handleFileDelete,
    metadata,
    fieldPathPrefix = '',
    stepKey = '',
    patientId = '',
    value = {},
}: FieldGroupProps) => {
    // TODO: Need to use field path prefix
    const [translations, selectedLang] = useTranslations()

    const getNumFields = () => value?.length ?? 0
    const getKeyBase = (index: number) => `${metadata.key}.${index}`

    const onAddGroup = () => {
        handleSimpleUpdate(getKeyBase(getNumFields()), {})
    }

    const onRemoveGroup = (groupNumber: number) => {
        if (isDisabled) return

        swal({
            title: translations.components.button.discard.question,
            text: translations.components.button.discard.warningMessage,
            icon: 'warning',
            dangerMode: true,
            buttons: [
                translations.components.button.discard.cancelButton,
                translations.components.button.discard.confirmButton,
            ],
        }).then((isDeleteConfirmed) => {
            if (isDeleteConfirmed) doRemoveGroup(groupNumber)
        })
    }

    const doRemoveGroup = (groupNumber: number) => {
        const newData = _.cloneDeep(value)
        newData.splice(groupNumber, 1)
        handleSimpleUpdate(metadata.key, newData)
    }

    const getTableData = () => {
        if (Array.isArray(value)) {
            return value.concat([RENDER_PLUS_ICON])
        }

        return [RENDER_PLUS_ICON]
    }

    const getTableColumnMetadata = () => {
        return metadata?.subFields?.map((field => ({
            id: field.key, // TODO: Need to index further?
            dataType: field.fieldType,
        }))) 
    }

    const getTableHeaders = () => {
        return metadata?.subFields?.map((field => ({
            title: field.displayName[selectedLang],
            sortKey: field.key,
        })))
    }

    const tableRenderer = <T extends Record<string, any>>(
        rowData: ColumnMetadata<T>[],
        itemData: T,
        selectedLang: Language
    ) =>  {
        if (itemData as any === RENDER_PLUS_ICON) {
        return (
            <StyledTableCell colSpan={metadata?.subFields?.length || 1}>
                <AddIcon />
            </StyledTableCell>
        )
        }

        return defaultTableRowRenderer(rowData, itemData, selectedLang)
    }

    // TODO: Change the defaultTableRenderer to add a row for editing a new item

    return (
        <SimpleTable<any>
            data={getTableData()}
            headers={getTableHeaders()}
            rowData={getTableColumnMetadata()}
            renderHeader={defaultTableHeaderRenderer}
            renderTableRow={tableRenderer}
            containerStyle={{ 
                marginTop: '6px', 
                width: 'calc(95vw - 240px - 50px)', // 95 - sidebar width - left padding
            }}
        />
    )
    // return [
    //         generateTableGroups(),
    //         <Button className="field-group-button" onClick={onAddGroup} disabled={isDisabled}>
    //             {`${translations.components.fieldGroup.add} ${metadata?.displayName[selectedLang]}`}
    //         </Button>
    // ]
}

export default FieldGroupTable
