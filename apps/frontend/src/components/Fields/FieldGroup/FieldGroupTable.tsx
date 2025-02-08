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
import { getTableData, getTableHeaders, HasGroupNumber, RENDER_PLUS_ICON } from './TableHelpers'
import LanguageInput from '../../LanguageInput/LanguageInput'
import StepField from '../../StepField/StepField'
import styled from 'styled-components'

// TODO: TEST CHROME
const CellEditContainer = styled(StyledTableCell)`
    padding: 0px;

    // Prevent arrows on number input
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield;
    }


    // Remove constraints from text area
    .text-area-wrapper {
        width: unset;
        margin-bottom: unset;
    }

    .text-area-body {
        min-height: 1em;
    }

    // Prevent inputs from blocking the table styling
    .active-input {
        background: none;
    }

    // Remove titles
    .text-title {
        display:none;
    }

    .date-title {
        display: none;
    }

    // Take full width for text
    .MuiTextField-root {
        width: 100%;
    }

    // Take full width for date picker
    .react-datepicker-wrapper {
        width: 100%;
    }

    .date-value {
        width: 100%;
    }

    // Prevent border boxes for text
    .MuiInputBase-root {
        fieldset {
            border: 0;
        }
    }

    // Prevent border boxes for date
    .react-datepicker__input-container {
        input {
            border: 0;
        }
    }
`


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

    const tableData = useMemo(() => {
        return getTableData(value, isDisabled)
    }, [value, isDisabled])

    const tableHeaders = useMemo(() => {
        return getTableHeaders(metadata, selectedLang, isDisabled)
    }, [metadata, selectedLang, isDisabled])

    const tableColumnMetadata = useMemo(() => {
        return metadata?.subFields?.map((field => ({
            id: field.key, // TODO: Need to index further?
            dataType: field.fieldType,
        }))) 
    }, [metadata])

    const onAddGroup = () => {
        handleSimpleUpdate(getKeyBase(getNumFields()), {})
    }

    // TODO: Pull these up into the common component
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

    const onSimpleUpdate = (k: string, v: any, i: number) => {
        handleSimpleUpdate(getCompleteSubFieldKey(i, k), v)
    }

    const onFileUpload = (k: string, v: any, i: number) => {
        handleFileUpload(getCompleteSubFieldKey(i, k), v)
    }

    const onFileDownload = (k: string, v: any, i: number) => {
        handleFileDownload(getCompleteSubFieldKey(i, k), v)
    }

    const onFileDelete = (k: string, v: any, i: number) => {
        handleFileDelete(getCompleteSubFieldKey(i, k), v)
    }

    const getKeyBase = (index: number) => `${metadata.key}.${index}`

    const getCompleteSubFieldKey = (index: number, subfieldKey: string) =>
        `${getKeyBase(index)}.${subfieldKey}`

    const tableRowRenderer = <T extends Record<string, any>>(
        rowData: ColumnMetadata<T>[],
        itemData: T,
        selectedLang: Language
    ) =>  {
        // Only if this is the last row, render the plus icon
        if (itemData as any === RENDER_PLUS_ICON) {
            const numCols = (metadata?.subFields?.length || 1) + 1
            return (
                <StyledTableCell colSpan={numCols}>
                    <AddIcon />
                </StyledTableCell>
            )
        }

        const cols = metadata?.subFields?.map((field) => {
            const rowNumber =  (field as HasGroupNumber<any>).groupNum

            return (
                // <div key={`${getCompleteSubFieldKey(index, field.key)}.${index}`}>
                // TOODO: give a key
                <CellEditContainer>
                    <StepField
                        displayName={""} // No display name since the header already has one
                        metadata={field}
                        value={value ? itemData[field.key] : null}
                        key={field.key}
                        isDisabled={isDisabled}
                        patientId={patientId}
                        stepKey={stepKey}
                        fieldPathPrefix={"TODO"}
                        handleSimpleUpdate={(k, v) => onSimpleUpdate(k, v, rowNumber)}
                        handleFileDownload={(k, v) => onFileDownload(k, v, rowNumber)}
                        handleFileUpload={(k, v) => onFileUpload(k, v, rowNumber)}
                        handleFileDelete={(k, v) => onFileDelete(k, v, rowNumber)}
                    />
                </CellEditContainer>
            )
        })
        // defaultTableRowRenderer(rowData, itemData, selectedLang)

        // Adds the delete button
        cols.push(
            <StyledTableCell>
                <img
                    src={XIcon}
                    alt={translations.components.button.discard.title}
                    className={`xicon-base xicon-${selectedLang}`}
                    onClick={() => onRemoveGroup(itemData.groupNum)}
                    style={{ float: selectedLang === Language.EN ? "right" : "left" }}
                />
            </StyledTableCell>
        )

        return cols
    }

    return (
        <>
            <h3 key={`${metadata.key}-table-title`}>{metadata.displayName[selectedLang]}</h3>
            <SimpleTable<any>
                data={tableData}
                headers={tableHeaders}
                rowData={tableColumnMetadata}
                renderHeader={defaultTableHeaderRenderer}
                renderTableRow={isDisabled ? defaultTableRowRenderer : tableRowRenderer}
                rowStyle={{ height: '50px' }}
                containerStyle={{ 
                    marginTop: '6px', 
                    width: 'calc(95vw - 240px - 50px)', // 95 - sidebar width - left padding
                }}
            />
        </>
    )
}

export default FieldGroupTable
