/* eslint import/no-cycle: "off" */
// Unfortunately, there has to be an import cycle, because this is by nature, recursive
import './Fields.scss'

import { Field } from '@3dp4me/types'
import { Button } from '@material-ui/core'
import _ from 'lodash'
import React from 'react'
import swal from 'sweetalert'

import XIcon from '../../assets/x-icon.png'
import { useTranslations } from '../../hooks/useTranslations'
import StepField from '../StepField/StepField'

export interface FieldGroupProps {
    isDisabled: boolean
    handleSimpleUpdate: (field: string, value: any) => void
    handleFileDownload: (field: string, value: any) => void
    handleFileUpload: (field: string, value: any) => void
    handleFileDelete: (field: string, value: any) => void
    stepKey?: string
    patientId?: string
    value?: any
    metadata: Field
}

const FieldGroup = ({
    isDisabled,
    handleSimpleUpdate,
    handleFileDownload,
    handleFileUpload,
    handleFileDelete,
    metadata,
    stepKey = '',
    patientId = '',
    value = {},
}: FieldGroupProps) => {
    const [translations, selectedLang] = useTranslations()

    const getKeyBase = (index: number) => `${metadata.key}.${index}`

    const getCompleteSubFieldKey = (index: number, subfieldKey: string) =>
        `${getKeyBase(index)}.${subfieldKey}`

    const getNumFields = () => value?.length ?? 0

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

    const generateSingleGroup = (index: number) =>
        metadata?.subFields?.map((field) => (
            <div key={`${getCompleteSubFieldKey(index, field.key)}.${index}`}>
                <div className="step-field">
                    <StepField
                        displayName={field.displayName[selectedLang]}
                        metadata={field}
                        value={value ? value[index][field.key] : null}
                        key={field.key}
                        isDisabled={isDisabled}
                        patientId={patientId}
                        stepKey={stepKey}
                        handleSimpleUpdate={(k, v) => onSimpleUpdate(k, v, index)}
                        handleFileDownload={(k, v) => onFileDownload(k, v, index)}
                        handleFileUpload={(k, v) => onFileUpload(k, v, index)}
                        handleFileDelete={(k, v) => onFileDelete(k, v, index)}
                    />
                </div>
            </div>
        ))

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

    const generateAllGroups = () => {
        const numFieldGroups = getNumFields()
        const groups = []

        for (let i = 0; i < numFieldGroups; i++) {
            const displayName = `${metadata?.displayName[selectedLang]} ${i + 1}`
            groups.push(generateHeader(i, displayName))
            groups.push(generateSingleGroup(i))
        }

        return groups
    }

    return (
        <div className="field-container">
            {generateAllGroups()}
            <Button className="field-group-button" onClick={onAddGroup} disabled={isDisabled}>
                {`${translations.components.fieldGroup.add} ${metadata?.displayName[selectedLang]}`}
            </Button>
        </div>
    )
}

export default FieldGroup
