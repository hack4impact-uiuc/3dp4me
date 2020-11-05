import React, { useState } from 'react';
<<<<<<< HEAD
import { Button, Typography } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import './Files.scss'

const Files = (props) => {
    return (
        <div className="files-section">
            <div className="files-header">
                <h3>{props.title}</h3>
            </div>
            <div className="files-button">
                {props.files.map(file => (
                    <Button className="download-button">
=======
import { Button, makeStyles, Typography } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import './Files.css'

const useStyles = makeStyles((theme) => ({
    downloadBtn: {
        '&:hover': {
            backgroundColor: '#e5f0ff'
        }
    }
}));

const Files = (props) => {
    const classes = useStyles();

    return (
        <div className="files-section">
            <div className="files-header">
                <h3 style={{ fontWeight: 100 }}>{props.title}</h3>
            </div>
            <div className="files-button">
                {props.files.map(file => (
                    <Button className={classes.downloadBtn}>
>>>>>>> origin/aws-backend-auth
                        <ArrowDownwardIcon />
                        <Typography align="left">
                            <b>Download</b>{` ${file}`}
                        </Typography>
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default Files;