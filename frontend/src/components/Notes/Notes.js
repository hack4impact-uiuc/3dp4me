import React from 'react';
import './Notes.scss';

const Notes = (props) => {
    return (
        <div className="notes-wrapper">
            <div className="notes-header">
                <h3>{props.title}</h3>
            </div>
            <div>
                <textarea
                    disabled={props.disabled}
                    onChange={(e) => {
                        props.state(e.target.value);
                    }}
                    value={props.value}
                    className={props.disabled ? 'notes-body' : 'active-body'}
                />
            </div>
        </div>
    );
};

export default Notes;
