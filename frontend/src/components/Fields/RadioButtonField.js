import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

import { useTranslations } from '../../hooks/useTranslations';

const RadioButtonField = ({
    fieldId,
    title,
    value = '',
    options,
    isDisabled,
    onChange,
}) => {
    const selectedLang = useTranslations()[1];

    const shouldHideOption = (option) => {
        return option.IsHidden && value?.toString() !== option._id.toString();
    };

    const generateQuestions = () => {
        return options.map((option) => {
            if (shouldHideOption(option)) return null;

            return (
                <FormControlLabel
                    key={option._id}
                    value={option._id}
                    control={<Radio />}
                    label={option.Question[selectedLang]}
                    disabled={isDisabled}
                />
            );
        });
    };

    return (
        <div>
            <h3>{title}</h3>
            <RadioGroup
                name={fieldId}
                onChange={(e) => onChange(fieldId, e.target.value)}
                value={value}
            >
                {generateQuestions()}
            </RadioGroup>
        </div>
    );
};

RadioButtonField.propTypes = {
    fieldId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string,
    isDisabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            IsHidden: PropTypes.bool.isRequired,
            _id: PropTypes.string.isRequired,
            Question: PropTypes.shape({
                EN: PropTypes.string.isRequired,
                AR: PropTypes.string.isRequired,
            }),
        }),
    ),
};

export default RadioButtonField;
