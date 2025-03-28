import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'

import { useTranslations } from '../../hooks/useTranslations'
import { FormOption } from './FormOption'

export interface RadioButtonFieldProps<T extends string> {
    fieldId: T
    title: string
    value?: string
    options: FormOption[]
    isDisabled?: boolean
    onChange?: (field: T, value: string) => void
}

const RadioButtonField = <T extends string>({
    fieldId,
    title,
    value = '',
    options,
    isDisabled = false,
    onChange,
}: RadioButtonFieldProps<T>) => {
    const selectedLang = useTranslations()[1]

    const shouldHideOption = (option: FormOption) =>
        option.IsHidden && value?.toString() !== option._id.toString()

    const generateQuestions = () =>
        options.map((option) => {
            if (shouldHideOption(option)) return null

            return (
                <FormControlLabel
                    key={option._id}
                    value={option._id}
                    control={<Radio />}
                    label={option.Question[selectedLang]}
                    disabled={isDisabled}
                />
            )
        })

    return (
        <div>
            <h3>{title}</h3>
            <RadioGroup
                name={fieldId}
                onChange={(e) => onChange?.(fieldId, e.target.value)}
                value={value}
            >
                {generateQuestions()}
            </RadioGroup>
        </div>
    )
}

export default RadioButtonField
