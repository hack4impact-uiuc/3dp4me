import React from 'react';
import './Notes.scss';
import PropTypes from 'prop-types';

const Notes = ({ title, disabled, fieldId, onChange, value = '' }) => {
    return (
        <div className="notes-wrapper">
            <div className="notes-header">
                <h3>{title}</h3>
            </div>
            <div>
                <textarea
                    disabled={disabled}
                    onChange={(e) => onChange(fieldId, e.target.value)}
                    value={value}
                    className={disabled ? 'notes-body' : 'active-body'}
                />
            </div>
        </div>
    );
};

Notes.propTypes = {
    title: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    fieldId: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

export default Notes;
