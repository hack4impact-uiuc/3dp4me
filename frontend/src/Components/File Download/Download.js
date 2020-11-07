import React from 'react'
import './Download.css'
import { Button, Typography } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { makeStyles } from '@material-ui/core/styles'
import colors from '../../colors.json';

const useStyles = makeStyles((theme) => ({
    downloadBtn: {
        '&:hover': {
            backgroundColor: 'white'
        }
    },
    downloadSection: {
        width: '300px',
        border: 'solid black 1px'
    } ,
    downloadHeader: {
        backgroundColor: colors.secondary,
        color: 'black',
        padding: 1,
        paddingLeft: '10px',
    } ,
    downloadButton: {
        backgroundColor: 'white'
    },
}));

const Download = (props) => {
    const classes = useStyles();
    const lang = props.lang.data;
    const key = props.lang.key;

    return (
        <div className={classes.downloadSection}>
            <div className={classes.downloadHeader}>
                <h3 style={{ fontWeight: 100 }}>{props.title}</h3>
            </div>
            <div className={classes.downloadButton}>
                <Button className={classes.downloadBtn} onClick={props.state}>
                    <ArrowDownwardIcon />
                    <Typography align="left">
                        <b>{lang[key].components.file.download}</b>{` ${props.fileName}`}
                    </Typography>
                </Button>
            </div>
        </div>
    );
}

export default Download;