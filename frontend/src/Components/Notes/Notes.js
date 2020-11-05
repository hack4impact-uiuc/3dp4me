import React from 'react'
<<<<<<< HEAD
import './Notes.scss';

const Notes = (props) => {
    return (
        <div className="notes-wrapper">
            <div className="notes-header">
                <h3>{props.title}</h3>
=======
import { makeStyles } from '@material-ui/core/styles'
import colors from '../../colors.json'

const useStyles = makeStyles((theme) => ({
    noteSection: {
        width: '350px',
        marginTop: '50px',
        marginBottom: '25px'
    },
    noteHeader: {
        backgroundColor: colors.secondary,
        color: 'black',
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
        background: '#eeeffc'
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
>>>>>>> origin/aws-backend-auth
            </div>
            <div>
                <textarea
                    disabled={props.disabled}
                    onChange={(e) => {
                        props.state(e.target.value)
                    }}
                    value={props.value}
<<<<<<< HEAD
                    className={props.disabled ? "notes-body" : "active-body"}
=======
                    className={props.disabled ? classes.noteBody : classes.activeBody}
>>>>>>> origin/aws-backend-auth
                />
            </div>
        </div>
    )
}

export default Notes;