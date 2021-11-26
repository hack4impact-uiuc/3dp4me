import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

import { FieldOptionsType } from '../../utils/custom-proptypes';

const MultiSelectField = ({
    title,
    langKey,
    options,
    selectedOptions,
    fieldId = '',
    isDisabled = true,
    disabledOptions = [],
    onChange = () => { },
}) => {
    const onSelectionChange = (e) => {
        let updatedOptions = [];

        if (!e.target.checked) {
            updatedOptions = selectedOptions.filter(
                (option) => option.toString() !== e.target.name.toString(),
            );
        } else {
            updatedOptions = selectedOptions.concat([e.target.name.toString()]);
        }

        onChange(fieldId, updatedOptions);
    };

    const generateQuestions = () => {
        return options.map((option) => {
            const isOptionChecked = selectedOptions.includes(
                option._id.toString(),
            );
            const isOptionDisabled = disabledOptions.includes(
                option._id.toString(),
            );
            if (option.IsHidden && !isOptionChecked) return null;

            return (
                <FormControlLabel
                    key={option._id}
                    value={option._id}
                    control={
                        <Checkbox
                            checked={isOptionChecked}
                            name={option._id}
                            value={option._id}
                            onChange={onSelectionChange}
                        />
                    }
                    label={option.Question[langKey]}
                    disabled={isDisabled || isOptionDisabled}
                />
            );
        });
    };

    return (
        <FormControl>
            <span>{title}</span>
            <FormGroup name={fieldId}>{generateQuestions()}</FormGroup>
        </FormControl>
    );
};

MultiSelectField.propTypes = {
    fieldId: PropTypes.string,
    title: PropTypes.string.isRequired,
    langKey: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    onChange: PropTypes.func,
    selectedOptions: PropTypes.arrayOf(PropTypes.string),
    options: FieldOptionsType,
    disabledOptions: PropTypes.arrayOf(PropTypes.string),
};

export default MultiSelectField;
