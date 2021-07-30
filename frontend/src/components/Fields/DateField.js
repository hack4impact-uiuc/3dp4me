import React from 'react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import './Fields.scss';
import { useTranslations } from '../../hooks/useTranslations';

const DateField = ({ displayName, isDisabled, fieldId, value, onChange }) => {
    const selectedLang = useTranslations()[1];

    const sendChanges = (date) => {
        onChange(fieldId, date.toString());
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
};

DateField.propTypes = {
    displayName: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    fieldId: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default DateField;
