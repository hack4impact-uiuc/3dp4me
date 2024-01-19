import 'react-phone-number-input/style.css'
import './Fields.scss'

import PhoneInput from 'react-phone-number-input'

import { FLAG_URL } from '../../utils/constants'

const DEFAULT_COUNTRY = 'JO'

export interface PhoneFieldProps {
    displayName: string
    isDisabled: boolean
    fieldId: string
    value?: string
    onChange: (field: string, value: string) => void
}

const PhoneField = ({
    displayName,
    isDisabled,
    fieldId,
    value = '',
    onChange,
}: PhoneFieldProps) => {
    const sendChanges = (phone: string) => {
        onChange(fieldId, phone)
    }

    return (
        <div>
            <h3>{displayName}</h3>
            <PhoneInput
                flagUrl={FLAG_URL}
                className="phone-input-container"
                defaultCountry={DEFAULT_COUNTRY}
                disabled={isDisabled}
                onChange={sendChanges}
                value={value}
            />
        </div>
    )
}

export default PhoneField
