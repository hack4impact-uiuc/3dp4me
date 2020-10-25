import React from 'react'
import './Notes.css'

const Notes = (props) => {

    return (
        <div className="note-section">
            <div className="note-header">
                <h3 style={{ fontWeight: 100 }}>{props.title}</h3>
            </div>
            <div>
                <textarea onChange={(e) => props.state(e.target.value)} value={props.value} className="note-body" />
            </div>
        </div>
    )
}

export default Notes;