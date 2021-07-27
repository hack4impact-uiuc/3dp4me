import 'react-phone-number-input/style.css';
import './Fields.scss';
import React from 'react';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-number-input';

const DEFAULT_COUNTRY = 'JO';

const PhoneField = ({
    displayName,
    isDisabled,
    fieldId,
    value = '',
    onChange,
}) => {
    const sendChanges = (phone) => {
        onChange(fieldId, phone);
    };

    return (
        <div>
            <h3>{displayName}</h3>
            <PhoneInput
                className="phone-input-container"
                defaultCountry={DEFAULT_COUNTRY}
                disabled={isDisabled}
                onChange={sendChanges}
                value={value}
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
