/* eslint import/no-cycle: "off" */
// Unfortunately, there has to be an import cycle, because this is by nature, recursive
import '../Fields.scss'

import { Field } from '@3dp4me/types'
import _ from 'lodash'
import FieldGroupTable from './FieldGroupTable'
import FieldGroupList from './FieldGroupList'

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
    displayMode?: DisplayMode,
    metadata: Field
}

// TODO: Default props?
const FieldGroup = (props: FieldGroupProps) => {
    let { displayMode } = props
    if (!displayMode)
        displayMode = DisplayMode.Table
    // TODO: Add a toggle for display mode

    return (
        <div className="field-container">
            { displayMode === DisplayMode.Table ? 
                <FieldGroupTable {...props} /> : 
                <FieldGroupList  {...props} />
            }
        </div>
    )
}

export default FieldGroup
