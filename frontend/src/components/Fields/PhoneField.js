import React from 'react';
import { TextField as Text } from '@material-ui/core';
import PropTypes from 'prop-types';
import { AsYouType, isValidPhoneNumber } from 'libphonenumber-js';

const PhoneField = ({
    displayName,
    isDisabled,
    fieldId,
    value = '',
    onChange,
}) => {
    const asYouType = new AsYouType();

    const sendChanges = (e) => {
        const phoneNumber = e.target.value;
        onChange(fieldId, phoneNumber);
    };

    return (
        <div>
            <h3>{displayName}</h3>
            <p>Format: +1 234 567 8910</p>
            <Text
                type="tel"
                disabled={isDisabled}
                className={!isDisabled ? 'active-input' : 'input-field'}
                variant="outlined"
                onChange={sendChanges}
                error={!isValidPhoneNumber(value)}
                value={asYouType.input(value)}
            />
        </div>
    );
};

PhoneField.propTypes = {
    displayName: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    fieldId: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default PhoneField;
