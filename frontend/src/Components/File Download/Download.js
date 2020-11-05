import React from 'react'
import './Download.scss'
import { Button, Typography } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const Download = (props) => {
    const lang = props.lang.data;
    const key = props.lang.key;

    return (
        <div className="download-section">
            <div className="download-header">
                <h3>{props.title}</h3>
            </div>
            <div>
                <Button className="download-button" onClick={props.state}>
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