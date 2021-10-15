import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslations } from '../../hooks/useTranslations';
import './Fields.scss';


const DateField = forwardRef(({ displayName, isDisabled, initValue }, ref) => {
    const selectedLang = useTranslations()[1];
    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(initValue)
    }, [initValue])

    useImperativeHandle(ref,
        () => ({
            value: value
        }),
    )

    const sendChanges = (date) => {
        setValue(date.toString());
    };

    const className = isDisabled
        ? 'input-field datepicker'
        : 'active-input datepicker';

    return (
        <div>
            <h3>{displayName}</h3>
            <DatePicker
                selected={Date.parse(value)}
                disabled={isDisabled}
                locale={selectedLang}
                className={className}
                onChange={sendChanges}
            />
        </div>
    );
});

DateField.propTypes = {
    displayName: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    initValue: PropTypes.string,
};

export default DateField;
