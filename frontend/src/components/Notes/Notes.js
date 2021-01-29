import React from 'react';
import './Notes.scss';

const Notes = ({ title, disabled, value, state }) => {
    return (
        <div className="notes-wrapper">
            <div className="notes-header">
                <h3>{title}</h3>
            </div>
            <div>
                <textarea
                    disabled={disabled}
                    onChange={(e) => {
                        state(e.target.value);
                    }}
                    value={value}
                    className={disabled ? 'notes-body' : 'active-body'}
                />
            </div>
        </div>
    );
};

export default Notes;
