import React from 'react';
import './TextArea.scss';
import PropTypes from 'prop-types';

const TextArea = ({ title, disabled, fieldId, onChange, value = '' }) => {
    return (
        <div className="text-area-wrapper">
            <h3>{title}</h3>
            <div>
                <textarea
                    disabled={disabled}
                    onChange={(e) => onChange(fieldId, e.target.value)}
                    value={value}
                    className={
                        disabled
                            ? 'text-area-body'
                            : 'text-area-body active-text-area'
                    }
                />
            </div>
        </div>
    );
};

TextArea.propTypes = {
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    fieldId: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default TextArea;