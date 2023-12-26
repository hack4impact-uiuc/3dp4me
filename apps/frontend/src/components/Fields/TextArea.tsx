import React from 'react';
import './TextArea.scss';
import PropTypes from 'prop-types';

export interface TextAreaProps {
    title: string
    disabled: boolean
    fieldId: string
    onChange: (key: string, value: string) => void
    value?: string
}

const TextArea = ({ title, disabled, fieldId, onChange, value = '' }: TextAreaProps) => {
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

export default TextArea;
