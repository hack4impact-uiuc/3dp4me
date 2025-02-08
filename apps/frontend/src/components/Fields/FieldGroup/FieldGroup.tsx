/* eslint import/no-cycle: "off" */
// Unfortunately, there has to be an import cycle, because this is by nature, recursive
import '../Fields.scss'

import { Field } from '@3dp4me/types'
import _ from 'lodash'
import swal from 'sweetalert'

import { useTranslations } from '../../../hooks/useTranslations'
import {
    canFieldGroupBeDisplayedInTable,
    getCompleteSubFieldKey,
    getKeyBase,
    getNumFields,
} from './FieldGroupHelpers'
import FieldGroupList from './FieldGroupList'
import FieldGroupTable from './FieldGroupTable'

export enum DisplayMode {
    Table = 'table',
    List = 'list',
}

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

const FieldGroup = (props: FieldGroupProps) => {
    const [translations, selectedLang] = useTranslations()

    const onAddGroup = () => {
        props.handleSimpleUpdate(getKeyBase(props.metadata, getNumFields(props.value)), {})
    }

    const onSimpleUpdate = (k: string, v: any, i: number) => {
        props.handleSimpleUpdate(getCompleteSubFieldKey(props.metadata, i, k), v)
    }

    const onFileUpload = (k: string, v: any, i: number) => {
        props.handleFileUpload(getCompleteSubFieldKey(props.metadata, i, k), v)
    }

    const onFileDownload = (k: string, v: any, i: number) => {
        props.handleFileDownload(getCompleteSubFieldKey(props.metadata, i, k), v)
    }

    const onFileDelete = (k: string, v: any, i: number) => {
        props.handleFileDelete(getCompleteSubFieldKey(props.metadata, i, k), v)
    }

    const onRemoveGroup = (groupNumber: number) => {
        if (props.isDisabled) return

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
        const newData = _.cloneDeep(props.value)
        newData.splice(groupNumber, 1)
        props.handleSimpleUpdate(props.metadata.key, newData)
    }

    return (
        <div className="field-container">
            {canFieldGroupBeDisplayedInTable(props.metadata) ? (
                <FieldGroupTable
                    {...props}
                    onAddGroup={onAddGroup}
                    onRemoveGroup={onRemoveGroup}
                    onFileDelete={onFileDelete}
                    onFileDownload={onFileDownload}
                    onFileUpload={onFileUpload}
                    onSimpleUpdate={onSimpleUpdate}
                />
            ) : (
                <FieldGroupList
                    {...props}
                    onAddGroup={onAddGroup}
                    onRemoveGroup={onRemoveGroup}
                    onFileDelete={onFileDelete}
                    onFileDownload={onFileDownload}
                    onFileUpload={onFileUpload}
                    onSimpleUpdate={onSimpleUpdate}
                />
            )}
        </div>
    )
}

export default FieldGroup
