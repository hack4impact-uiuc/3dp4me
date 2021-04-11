import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import React from 'react';

const RadioButtonField = ({
    fieldId,
    title,
    langKey,
    value,
    options,
    onChange,
}) => {
    const generateQuestions = () => {
        return options.map((option) => {
            if (option.IsHidden && value?.toString() !== option._id.toString())
                return null;

            return (
                <FormControlLabel
                    value={value}
                    control={<Radio />}
                    label={option.Question[langKey]}
                />
            );
        });
    };

    // TODO: SOrt

    return (
        <div>
            <h3>{title}</h3>
            <RadioGroup
                name={fieldId}
                onChange={(e) => onChange(fieldId, e.target.value)}
            >
                {generateQuestions()}
            </RadioGroup>
        </div>
    );
};

// TODO: Proptypes

export default RadioButtonField;
