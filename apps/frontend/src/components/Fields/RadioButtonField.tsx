import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

import { useTranslations } from '../../hooks/useTranslations';
import { FieldOptionsType } from '../../utils/custom-proptypes';
import { FormOption } from './FormOption';

export interface RadioButtonFieldProps {
    fieldId: string;
    title: string;
    value?: string;
    options: FormOption[];
    isDisabled: boolean;
    onChange: (field: string, value: string) => void;
}

const RadioButtonField = ({
    fieldId,
    title,
    value = '',
    options,
    isDisabled,
    onChange,
}: RadioButtonFieldProps) => {
    const selectedLang = useTranslations()[1];

    const shouldHideOption = (option: FormOption) => {
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
    options: FieldOptionsType,
};

export default RadioButtonField;
