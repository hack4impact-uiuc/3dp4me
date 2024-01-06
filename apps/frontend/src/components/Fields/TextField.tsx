import { ChangeEvent, HTMLInputTypeAttribute } from 'react';
import { TextField as Text } from '@material-ui/core';
import { Path, PathValue } from '../../utils/object';

export interface TextFieldProps<T extends Record<string, any>> {
    displayName:  string
    type?: HTMLInputTypeAttribute,
    isDisabled?: boolean
    fieldId: Path<T>
    value?: string
    className?: string
    onChange?: (key: Path<T>, value: string) => void
}

const TextField = <T extends Record<string, any>>({
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
