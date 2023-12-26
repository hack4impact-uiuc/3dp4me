import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
} from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import PropTypes from 'prop-types';

import { FieldOptionsType } from '../../utils/custom-proptypes';
import { Language, TranslatedString } from '@3dp4me/types';
import { FormOption } from './FormOption';


export interface MultiSelectFieldProps {
    title: string,
    langKey: Language,
    options: FormOption[],
    selectedOptions: string[],
    fieldId?: string
    isDisabled?: boolean
    disabledOptions?: string[]
    onChange?: (field: string, options: string[]) => void
}

const MultiSelectField = ({
    title,
    langKey,
    options,
    selectedOptions,
    fieldId = '',
    isDisabled = true,
    disabledOptions = [],
    onChange = () => {},
}: MultiSelectFieldProps) => {
    const onSelectionChange = (e: ChangeEvent<HTMLInputElement>) => {
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
            <FormGroup>{generateQuestions()}</FormGroup>
        </FormControl>
    );
};

export default MultiSelectField;
