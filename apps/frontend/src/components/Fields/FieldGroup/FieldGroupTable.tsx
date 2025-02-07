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
import { useMemo } from 'react'
import { getTableData, RENDER_PLUS_ICON } from './TableHelpers'


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

    const tableData = useMemo(() => {
        return getTableData(value, isDisabled)
    }, [value, isDisabled])

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
        }))).concat({
            // This is an empty heaader for the X button
            title: "",
            sortKey: ""
        })
    }

    const tableRowRenderer = <T extends Record<string, any>>(
        rowData: ColumnMetadata<T>[],
        itemData: T,
        selectedLang: Language
    ) =>  {

        if (itemData as any === RENDER_PLUS_ICON) {
            const numCols = (metadata?.subFields?.length || 1) + 1
            return (
                <StyledTableCell colSpan={numCols}>
                    <AddIcon />
                </StyledTableCell>
            )
        }

        // TODO: If editing, this needs to change
        const cols = defaultTableRowRenderer(rowData, itemData, selectedLang)

        cols.push(
            <StyledTableCell>
                <img
                    src={XIcon}
                    alt={translations.components.button.discard.title}
                    className={`xicon-base xicon-${selectedLang}`}
                    onClick={() => onRemoveGroup(itemData.groupNum)}
                />
            </StyledTableCell>
        )

        return cols
    }

    return (
        <SimpleTable<any>
            data={tableData}
            headers={getTableHeaders()}
            rowData={getTableColumnMetadata()}
            renderHeader={defaultTableHeaderRenderer}
            renderTableRow={tableRowRenderer}
            containerStyle={{ 
                marginTop: '6px', 
                width: 'calc(95vw - 240px - 50px)', // 95 - sidebar width - left padding
            }}
        />
    )
}

export default FieldGroupTable
