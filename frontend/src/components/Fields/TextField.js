import React, { useEffect, useState } from 'react';
import { TextField as Text } from '@material-ui/core';
import PropTypes from 'prop-types';

const TextField = ({ displayName, isDisabled, fieldId, value, onChange }) => {
    const sendChanges = (e) => {
        onChange(fieldId, e.target.value);
    };
    return (
        <div>
            <h3>{displayName}</h3>
            <Text
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
    isDisabled: PropTypes.bool.isRequired,
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default TextField;
