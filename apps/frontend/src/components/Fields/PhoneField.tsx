import PhoneInput from 'react-phone-number-input';

import 'react-phone-number-input/style.css';
import { FLAG_URL } from '../../utils/constants';
import './Fields.scss';

const DEFAULT_COUNTRY = 'JO';

export interface PhoneFieldProps {
    displayName: string;
    isDisabled: boolean;
    fieldId: string;
    value?: string;
    onChange: (field: string, value: string) => void;
}

const PhoneField = ({
    displayName,
    isDisabled,
    fieldId,
    value = '',
    onChange,
}: PhoneFieldProps) => {
    const sendChanges = (phone: string) => {
        onChange(fieldId, phone);
    };

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
    );
};

export default PhoneField;
