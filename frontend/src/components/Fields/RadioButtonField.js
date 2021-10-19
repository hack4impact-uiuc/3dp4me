import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { useTranslations } from '../../hooks/useTranslations';
import { FieldOptionsType } from '../../utils/custom-proptypes';


const RadioButtonField = forwardRef(({
    fieldId,
    title,
    options,
    isDisabled,
    initValue="",
}, ref) => {
    const selectedLang = useTranslations()[1];
    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(initValue)
    }, [initValue])

    useImperativeHandle(ref,
        () => ({
            value
        }),
    )

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
                onChange={(e) => setValue(e.target.value)}
                value={value}
            >
                {generateQuestions()}
            </RadioGroup>
        </div>
    );
});

RadioButtonField.propTypes = {
    fieldId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    initValue: PropTypes.string,
    isDisabled: PropTypes.bool.isRequired,
    options: FieldOptionsType,
};

export default RadioButtonField;
