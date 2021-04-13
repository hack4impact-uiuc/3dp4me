import React from 'react';
import { TextField as Text } from '@material-ui/core';
import PropTypes from 'prop-types';

const TextField = ({
    displayName,
    type = '',
    isDisabled,
    fieldId,
    value = '',
    onChange,
}) => {
    const sendChanges = (e) => {
        onChange(fieldId, e.target.value);
    };
    return (
        <div>
            <h3>{displayName}</h3>
            <Text
                type={type}
                disabled={isDisabled}
                className={!isDisabled ? 'active-input' : 'input-field'}
                variant="outlined"
                onChange={sendChanges}
                value={value}
            />
        </div>
    );
};

TextField.propTypes = {
    displayName: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    fieldId: PropTypes.string.isRequired,
    value: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default TextField;
