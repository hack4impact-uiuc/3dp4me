import './LanguageInput.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

const LanguageInput = ({
    onUpPressed,
    onDownPressed,
    onDelete,
    fieldKey,
    fieldValues,
    handleEnglishFieldChange,
    handleArabicFieldChange,
}) => {
    const generateArrows = () => {
        const shouldShowArrows = onUpPressed && onDownPressed;

        return (
            <div className="language-col vertical-center">
                <div
                    onClick={() => onUpPressed(fieldKey)}
                    className="field-up-button"
                >
                    <i
                        className={`${
                            shouldShowArrows ? 'chevron up icon' : 'icon'
                        }`}
                    />
                </div>
                <div
                    onClick={() => onDownPressed(fieldKey)}
                    className="field-down-button"
                >
                    <i
                        className={`${
                            shouldShowArrows ? 'chevron down icon' : 'icon'
                        }`}
                    />
                </div>
            </div>
        );
    };

    const generateDeleteButton = () => {
        const shouldShowDelete = onDelete;

        return (
            <div
                className="language-col remove-field-button"
                onClick={() => onDelete(fieldKey)}
            >
                <i className={`${shouldShowDelete ? 'remove icon' : 'icon'}`} />
            </div>
        );
    };

    return (
        <div className="language-input-container">
            {generateArrows()}
            <div className="language-col">
                <span className="language-title">English:</span>
                <span className="language-title">Arabic:</span>
            </div>

            <div className="language-col">
                <TextField
                    className="language-input"
                    size="small"
                    fullWidth
                    variant="outlined"
                    InputProps={{ className: 'lang-input' }}
                    value={fieldValues['EN']}
                    onChange={handleEnglishFieldChange}
                />
                <TextField
                    className="language-input"
                    size="small"
                    fullWidth
                    variant="outlined"
                    InputProps={{ className: 'lang-input' }}
                    value={fieldValues['AR']}
                    onChange={handleArabicFieldChange}
                />
            </div>
            {generateDeleteButton()}
        </div>
    );
};

LanguageInput.propTypes = {
    onUpPressed: PropTypes.func.isRequired,
    onDownPressed: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    fieldKey: PropTypes.string.isRequired,
    fieldValues: PropTypes.object.isRequired,
    handleEnglishFieldChange: PropTypes.func.isRequired,
    handleArabicFieldChange: PropTypes.func.isRequired,
};

export default LanguageInput;
