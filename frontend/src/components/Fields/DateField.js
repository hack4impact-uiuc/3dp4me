import React from 'react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';
import './Fields.scss';

const DateField = ({
    langKey,
    displayName,
    isDisabled,
    fieldId,
    value,
    onChange,
}) => {
    const sendChanges = (date) => {
        onChange(fieldId, date.toString());
    };

    return (
        <div>
            <h3>{displayName}</h3>
            <DatePicker
                selected={Date.parse(value)}
                disabled={isDisabled}
                locale={langKey}
                className={
                    !isDisabled
                        ? 'active-input datepicker'
                        : 'input-field datepicker'
                }
                onChange={sendChanges}
            />
        </div>
    );
};

DateField.propTypes = {
    langKey: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool.isRequired,
    fieldId: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default DateField;
