import React, { useState } from 'react';
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