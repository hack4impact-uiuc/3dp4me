import { ChangeEvent, HTMLInputTypeAttribute } from 'react';
import { TextField as Text } from '@material-ui/core';

export interface TextFieldProps<T extends string> {
    displayName:  string
    type?: HTMLInputTypeAttribute,
    isDisabled?: boolean
    fieldId: T
    value?: string
    className?: string
    onChange?: (key: T, value: string) => void
}

const TextField = <T extends string>({
    displayName,
    type = '',
    isDisabled,
    value = '',
    className = '',
    fieldId,
    onChange = () => {},
}: TextFieldProps<T>) => {
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
