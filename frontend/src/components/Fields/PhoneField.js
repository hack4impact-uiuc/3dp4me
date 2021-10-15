import PropTypes from 'prop-types';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FLAG_URL } from '../../utils/constants';
import './Fields.scss';

const DEFAULT_COUNTRY = 'JO';

const PhoneField = forwardRef(({
    displayName,
    isDisabled,
}, ref) => {
    const [value, setValue] = useState("");

    useImperativeHandle(ref,
        () => ({
            value: value
        }),
    )

    return (
        <div>
            <h3>{displayName}</h3>
            <PhoneInput
                flagUrl={FLAG_URL}
                className="phone-input-container"
                defaultCountry={DEFAULT_COUNTRY}
                disabled={isDisabled}
                onChange={(v) => setValue(v)}
                value={value}
            />
        </div>
    );
});

PhoneField.propTypes = {
    displayName: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    fieldId: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default PhoneField;
