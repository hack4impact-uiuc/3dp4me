import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import PhoneInput from 'react-phone-number-input';

import 'react-phone-number-input/style.css';
import { FLAG_URL } from '../../utils/constants';
import './Fields.scss';

const DEFAULT_COUNTRY = 'JO';

const PhoneField = forwardRef(({
    displayName,
    isDisabled,
    initValue
}, ref) => {
    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(initValue)
    }, [initValue])

    useImperativeHandle(ref,
        () => ({
            value
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
    initValue: PropTypes.string,
};

export default PhoneField;
