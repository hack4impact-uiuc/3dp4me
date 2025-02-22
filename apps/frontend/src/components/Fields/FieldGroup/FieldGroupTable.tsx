/* eslint import/no-cycle: "off" */
// Unfortunately, there has to be an import cycle, because this is by nature, recursive
import { Language } from '@3dp4me/types'
import AddIcon from '@mui/icons-material/Add'
import { useMemo } from 'react'
import styled from 'styled-components'

import XIcon from '../../../assets/x-icon.png'
import { useTranslations } from '../../../hooks/useTranslations'
import {
    ColumnMetadata,
    defaultTableHeaderRenderer,
    defaultTableRowRenderer,
} from '../../../utils/table-renderers'
import SimpleTable from '../../SimpleTable/SimpleTable'
import { StyledTableCell } from '../../SimpleTable/SimpleTable.style'
import StepField from '../../StepField/StepField'
import { FieldGroupListTableProps, getCompleteSubFieldKey, getKeyBase } from './FieldGroupHelpers'
import { getTableData, getTableHeaders, HasGroupNumber, RENDER_PLUS_ICON } from './TableHelpers'

const CellEditContainer = styled(StyledTableCell)`
    padding: 5px;

    // Prevent arrows on number input
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input[type='number'] {
        -moz-appearance: textfield;
    }

    // Remove constraints from text area
    .text-area-wrapper {
        width: unset;
        margin-bottom: unset;
    }

    .text-area-body {
        min-height: 1em;
        border: none;
        background: none;
    }

    // Prevent inputs from blocking the table styling
    .active-input {
        background: none;
    }

    // Remove titles
    .text-title {
        display: none;
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
    .MuiInputBase-root:not(.Mui-focused) {
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

    // Prevent border boxes for phone
    .phone-input-container {
        margin-left: 10px;
        input {
            border: 0;
            background: none;
        }
    }
`

const FieldGroupTable = ({
    isDisabled,
    onSimpleUpdate,
    onFileDownload,
    onFileUpload,
    onFileDelete,
    onAddGroup,
    onRemoveGroup,
    metadata,
    fieldPathPrefix = '',
    stepKey = '',
    patientId = '',
    value = {},
}: FieldGroupListTableProps) => {
    const [translations, selectedLang] = useTranslations()

    const tableData = useMemo(() => getTableData(value, isDisabled), [value, isDisabled])

    const tableHeaders = useMemo(
        () => getTableHeaders(metadata, selectedLang, isDisabled),
        [metadata, selectedLang, isDisabled]
    )

    const tableColumnMetadata = useMemo(
        () =>
            metadata?.subFields?.map((field) => ({
                id: field.key, 
                dataType: field.fieldType,
            })),
        [metadata]
    )

    const tableRowRenderer = <T extends Record<string, any>>(
        rowData: ColumnMetadata<T>[],
        itemData: T,
        lang: Language
    ) => {
        // Only if this is the last row, render the plus icon
        if ((itemData as any) === RENDER_PLUS_ICON) {
            const numCols = (metadata?.subFields?.length || 1) + 1
            return (
                <StyledTableCell colSpan={numCols} onClick={onAddGroup}>
                    <AddIcon />
                </StyledTableCell>
            )
        }

        const rowNumber = (itemData as HasGroupNumber<any>).groupNum
        const cols = rowData.map((field, i) => {
            const fieldKey = `${fieldPathPrefix}${getCompleteSubFieldKey(
                metadata,
                rowNumber,
                field.id
            )}`

            return (
                <CellEditContainer key={fieldKey}>
                    <StepField
                        displayName={''} // No display name since the header already has one
                        metadata={metadata.subFields[i]}
                        value={itemData[field.id]}
                        key={field.id}
                        isDisabled={isDisabled}
                        patientId={patientId}
                        stepKey={stepKey}
                        fieldPathPrefix={getKeyBase(metadata, rowNumber)}
                        handleSimpleUpdate={(k, v) => onSimpleUpdate(k, v, rowNumber)}
                        handleFileDownload={(k, v) => onFileDownload(k, v, rowNumber)}
                        handleFileUpload={(k, v) => onFileUpload(k, v, rowNumber)}
                        handleFileDelete={(k, v) => onFileDelete(k, v, rowNumber)}
                    />
                </CellEditContainer>
            )
        })

        // Adds the delete button
        cols.push(
            <StyledTableCell>
                <img
                    src={XIcon}
                    alt={translations.components.button.discard.title}
                    className={`xicon-base xicon-${lang}`}
                    onClick={() => onRemoveGroup(itemData.groupNum)}
                    style={{ float: lang === Language.EN ? 'right' : 'left' }}
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
