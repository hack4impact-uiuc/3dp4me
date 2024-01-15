import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Fields.scss';
import { useTranslations } from '../../hooks/useTranslations';
import { formToJSON } from 'axios';
import { Nullish } from '@3dp4me/types';
import { useMemo } from 'react';

export interface DateFieldProps {
    displayName: string
    isDisabled: boolean
    fieldId: string
    value: Nullish<string>,
    onChange: (field: string, value: string) => void
}

const DateField = ({ displayName, isDisabled, fieldId, value, onChange }: DateFieldProps) => {
    const selectedLang = useTranslations()[1];

    const sendChanges = (date: Date) => {
        onChange(fieldId, date.toString());
    };

    const className = isDisabled
        ? 'input-field datepicker'
        : 'active-input datepicker';


    return (
        <div>
            <h3>{displayName}</h3>
            <DatePicker
                selected={value ? new Date(Date.parse(value)): null}
                disabled={isDisabled}
                locale={selectedLang}
                className={className}
                onChange={sendChanges}
            />
        </div>
    );
};

export default DateField;
