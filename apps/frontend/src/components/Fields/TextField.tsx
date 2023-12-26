import { ChangeEvent, HTMLInputTypeAttribute } from 'react';
import { TextField as Text } from '@material-ui/core';

export interface TextFieldProps {
    displayName:  string
    type?: HTMLInputTypeAttribute,
    isDisabled?: boolean
    fieldId?: string
    value?: string
    className?: string
    onChange?: (fieldId: string, value: string) => void
}

const TextField = ({
    displayName,
    type = '',
    isDisabled,
    fieldId = '',
    value = '',
    className = '',
    onChange = () => {},
}: TextFieldProps) => {
    const inputClassName = !isDisabled ? 'active-input' : 'input-field';

    const sendChanges = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(fieldId, e.target.value);
    };

    return (
        <div>
            <h3>{displayName}</h3>
            <Text
                type={type}
                disabled={isDisabled}
                className={`${inputClassName} ${className}`}
                variant="outlined"
                onChange={sendChanges}
                value={value}
            />
        </div>
    );
};

export default TextField;
