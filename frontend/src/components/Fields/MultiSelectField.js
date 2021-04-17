import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Radio,
} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const MultiSelectField = ({
    fieldId = '',
    title,
    langKey,
    options,
    selectedOptions,
    isDisabled = true,
    onChange = () => {},
}) => {
    const onSelectionChange = (e) => {
        let updatedOptions = [];
        console.log('BEFORE' + selectedOptions);

        if (!e.target.checked) {
            updatedOptions = selectedOptions.filter(
                (option) => option.toString() !== e.target.name.toString(),
            );
        } else {
            updatedOptions = selectedOptions.concat(e.target.name.toString());
        }
        console.log('AFTER' + updatedOptions);

        onChange(fieldId, updatedOptions);
    };

    const generateQuestions = () => {
        return options.map((option) => {
            const isChecked = selectedOptions.includes(option._id.toString());
            if (option.IsHidden && !isChecked) return null;

            return (
                <FormControlLabel
                    key={option._id}
                    value={option._id}
                    control={
                        <Checkbox
                            checked={isChecked}
                            name={option._id}
                            onChange={onSelectionChange}
                        />
                    }
                    label={option.Question[langKey]}
                    disabled={isDisabled}
                />
            );
        });
    };

    return (
        <FormControl>
            <h3>{title}</h3>
            <FormGroup
                name={fieldId}
                onChange={(e) => onChange(fieldId, e.target.value)}
            >
                {generateQuestions()}
            </FormGroup>
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

export default MultiSelectField;
