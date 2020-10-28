import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import './Notes.css'

const useStyles = makeStyles((theme) => ({
    noteSection: {
        width: '350px',
        marginTop: '50px',
        marginBottom: '25px'
    },
    noteHeader: {
        backgroundColor: '#6295e0',
        color: 'white',
        padding: '2px',
        paddingLeft: '10px',
    },
    noteBody: {
        minWidth: '98%',
        maxWidth: '98%',
        fontFamily: "Ubuntu",
        maxHeight: '300px',
        minHeight: '100px',
        fontSize: '16px',
        background: '#e5f0ff'
    },
    activeBody: {
        minWidth: '98%',
        maxWidth: '98%',
        fontFamily: "Ubuntu",
        maxHeight: '300px',
        minHeight: '100px',
        fontSize: '16px',
        background: 'white'
    }
}));

const Notes = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.noteSection}>
            <div className={classes.noteHeader}>
                <h3 style={{ fontWeight: 100 }}>{props.title}</h3>
            </div>
            <div>
                <textarea
                    disabled={props.disabled}
                    onChange={(e) => {
                        props.state(e.target.value)
                    }}
                    value={props.value}
                    className={props.disabled ? classes.noteBody : classes.activeBody}
                />
            </div>
        </div>
    )
}

export default Notes;