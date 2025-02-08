/* eslint import/no-cycle: "off" */
// Unfortunately, there has to be an import cycle, because this is by nature, recursive
import { Field } from '@3dp4me/types'
import Button from '@material-ui/core/Button'
import _ from 'lodash'
import swal from 'sweetalert'

import XIcon from '../../../assets/x-icon.png'
import { useTranslations } from '../../../hooks/useTranslations'
import StepField from '../../StepField/StepField'
import { FieldGroupListTableProps, getCompleteSubFieldKey, getKeyBase, getNumFields } from './FieldGroupHelpers'

const FieldGroupList = ({
    isDisabled,
    onSimpleUpdate,
    onFileDownload,
    onFileUpload,
    onFileDelete,
    onRemoveGroup,
    onAddGroup,
    metadata,
    fieldPathPrefix = '',
    stepKey = '',
    patientId = '',
    value = {},
}: FieldGroupListTableProps) => {
    const [translations, selectedLang] = useTranslations()

    const generateSingleGroup = (index: number) =>
        metadata?.subFields?.map((field) => {
            return (
                <div key={`${fieldPathPrefix}${getCompleteSubFieldKey(metadata, index, field.key)}.${index}`}>
                    <div className="step-field">
                        <StepField
                            displayName={field.displayName[selectedLang]}
                            metadata={field}
                            value={value ? value[index][field.key] : null}
                            key={field.key}
                            isDisabled={isDisabled}
                            patientId={patientId}
                            stepKey={stepKey}
                            fieldPathPrefix={getKeyBase(metadata, index)}
                            handleSimpleUpdate={(k, v) => onSimpleUpdate(k, v, index)}
                            handleFileDownload={(k, v) => onFileDownload(k, v, index)}
                            handleFileUpload={(k, v) => onFileUpload(k, v, index)}
                            handleFileDelete={(k, v) => onFileDelete(k, v, index)}
                        />
                    </div>
                </div>
            )
        })

    const generateHeader = (groupNumber: number, displayName: string) => {
        const buttonClass = `button-${isDisabled ? 'disabled' : 'active'}`

        return (
            <div className={`group-title-container-base group-title-container-${selectedLang}`}>
                <img
                    src={XIcon}
                    alt={translations.components.button.discard.title}
                    className={`xicon-base xicon-${selectedLang} ${buttonClass}`}
                    onClick={() => onRemoveGroup(groupNumber)}
                />
                <h3 key={displayName}>{displayName}</h3>
            </div>
        )
    }

    const generateListGroups = () => {
        const numFieldGroups = getNumFields(value)
        const groups = []

        for (let i = 0; i < numFieldGroups; i++) {
            const displayName = `${metadata?.displayName[selectedLang]} ${i + 1}`
            groups.push(generateHeader(i, displayName))
            groups.push(generateSingleGroup(i))
        }

        return groups
    }

    return [
        generateListGroups(),
        <Button className="field-group-button" onClick={onAddGroup} disabled={isDisabled}>
            {`${translations.components.fieldGroup.add} ${metadata?.displayName[selectedLang]}`}
        </Button>
    ]
}

export default FieldGroupList
