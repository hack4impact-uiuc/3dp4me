import 'react-datepicker/dist/react-datepicker.css'
import './Fields.scss'

import { Nullish } from '@3dp4me/types'
import { arSA, enUS } from 'date-fns/locale'
import DatePicker, { registerLocale } from 'react-datepicker'

import { useTranslations } from '../../hooks/useTranslations'
import { LANGUAGES } from '../../utils/constants'

export interface DateFieldProps {
    displayName: string
    isDisabled: boolean
    fieldId: string
    value: Nullish<string>
    onChange: (field: string, value: string) => void
}

// Configure international date library
registerLocale(LANGUAGES.EN, enUS)
registerLocale(LANGUAGES.AR, arSA)

const DateField = ({ displayName, isDisabled, fieldId, value, onChange }: DateFieldProps) => {
    const selectedLang = useTranslations()[1]

    const sendChanges = (date: Date) => {
        onChange(fieldId, date.toString())
    }

    const className = isDisabled ? 'input-field datepicker' : 'active-input datepicker'

    return (
        <div>
            <h3 className="date-title">{displayName}</h3>
            <DatePicker
                selected={value ? new Date(Date.parse(value)) : null}
                disabled={isDisabled}
                locale={selectedLang}
                className={`${className} date-value`}
                onChange={sendChanges}
            />
        </div>
    )
}

export default DateField
