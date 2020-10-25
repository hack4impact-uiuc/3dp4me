import React from 'react'
import './Download.css'
import { Button, Typography } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    downloadBtn: {
        '&:hover': {
            backgroundColor: '#e5f0ff'
        }
    }
}));

const Download = (props) => {
    const classes = useStyles();

    return (
        <div className="download-section">
            <div className="download-header">
                <h3 style={{ fontWeight: 100 }}>{props.title}</h3>
            </div>
            <div className="download-button">
                <Button className={classes.downloadBtn} onClick={props.state}>
                    <ArrowDownwardIcon />
                    <Typography align="left">
                        <b>Download</b>{` ${props.fileName}`}
                    </Typography>
                </Button>
            </div>
        </div>
    );
}

export default Download;