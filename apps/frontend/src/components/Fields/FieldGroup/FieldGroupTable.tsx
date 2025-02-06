/* eslint import/no-cycle: "off" */
// Unfortunately, there has to be an import cycle, because this is by nature, recursive
import { Field } from '@3dp4me/types'
import Button from '@material-ui/core/Button'
import _ from 'lodash'
import swal from 'sweetalert'

import XIcon from '../../../assets/x-icon.png'
import { useTranslations } from '../../../hooks/useTranslations'
import StepField from '../../StepField/StepField'
import SimpleTable from '../../SimpleTable/SimpleTable'
import { defaultTableHeaderRenderer, defaultTableRowRenderer } from '../../../utils/table-renderers'


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

    const generateTableGroups = () => {
        return <SimpleTable<any>
            data={getTableData()}
            headers={getTableHeaders()}
            rowData={getTableColumnMetadata()}
            renderHeader={defaultTableHeaderRenderer}
            renderTableRow={defaultTableRowRenderer}
            containerStyle={{ 
                marginTop: '6px', 
                width: 'calc(95vw - 240px - 50px)', // 95 - sidebar width - left padding
            }}
        />
    }

    const getTableData = () => {
        if (Array.isArray(value)) {
            return value
        }

        return []
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

    // TODO: Change the defaultTableRenderer to add a row for editing a new item

    return (
        <SimpleTable<any>
            data={getTableData()}
            headers={getTableHeaders()}
            rowData={getTableColumnMetadata()}
            renderHeader={defaultTableHeaderRenderer}
            renderTableRow={defaultTableRowRenderer}
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
