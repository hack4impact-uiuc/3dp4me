import { TextField as Text } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

const TextField = forwardRef(({
    displayName,
    isDisabled,
    onChange = () => {},
    initValue = '',
    type = '',
    className = '',
}, ref) => {
    const inputClassName = !isDisabled ? 'active-input' : 'input-field';
    const [value, setValue] = useState("")

    useEffect(() => {
        setValue(initValue)
    }, [initValue])

    useImperativeHandle(ref,
        () => ({
            value: value
        }),
    )

    return (
        <div>
            <h3>{displayName}</h3>
            <Text
                type={type}
                disabled={isDisabled}
                className={`${inputClassName} ${className}`}
                variant="outlined"
                onChange={e => {setValue(e.target.value); onChange(e.target.value)}}
                value={value}
            />
        </div>
    );
});

TextField.propTypes = {
    displayName: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    type: PropTypes.string,
    className: PropTypes.string,
    initValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default TextField;
