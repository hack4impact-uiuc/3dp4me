import './LanguageInput.scss'

import { Language, TranslatedString } from '@3dp4me/types'
import TextField from '@mui/material/TextField'
import React from 'react'
import { ChevronDownIcon, ChevronUpIcon, ClearIcon } from '../Icons/Icons'

export interface LanguageInputProps {
    onUpPressed?: (fieldKey: string) => void
    onDownPressed?: (fieldKey: string) => void
    onDelete?: (fieldKey: string) => void
    fieldKey: string
    fieldValues: TranslatedString
    handleFieldChange: (value: string, lang: Language) => void
}

const LanguageInput = ({
    onUpPressed,
    onDownPressed,
    onDelete,
    fieldKey,
    fieldValues,
    handleFieldChange,
}: LanguageInputProps) => {
    const generateArrows = () => {
        const shouldShowArrows = !!onUpPressed && !!onDownPressed

        return (
            <div className="language-col vertical-center">
                <div onClick={() => onUpPressed?.(fieldKey)} className="field-up-button">
                    {shouldShowArrows && <ChevronUpIcon /> }
                </div>
                <div onClick={() => onDownPressed?.(fieldKey)} className="field-down-button">
                    {shouldShowArrows && <ChevronDownIcon /> }
                </div>
            </div>
        )
    }

    const generateDeleteButton = () => {
        const shouldShowDelete = !!onDelete

        return (
            <div className="language-col remove-field-button" onClick={() => onDelete?.(fieldKey)}>
                { shouldShowDelete && <ClearIcon /> }
            </div>
        )
    }

    return (
        <div className="language-input-container">
            {generateArrows()}
            <div className="language-col">
                <span className="language-title">English:</span>
                <span className="language-title">Arabic:</span>
            </div>

            <div className="language-col">
                <TextField
                    className="language-input"
                    size="small"
                    fullWidth
                    variant="outlined"
                    InputProps={{ className: 'lang-input' }}
                    value={fieldValues.EN}
                    onChange={(event) => {
                        handleFieldChange(event.target.value, Language.EN)
                    }}
                />
                <TextField
                    className="language-input"
                    size="small"
                    fullWidth
                    variant="outlined"
                    InputProps={{ className: 'lang-input' }}
                    value={fieldValues.AR}
                    onChange={(event) => {
                        handleFieldChange(event.target.value, Language.AR)
                    }}
                />
            </div>
            {generateDeleteButton()}
        </div>
    )
}

export default LanguageInput
