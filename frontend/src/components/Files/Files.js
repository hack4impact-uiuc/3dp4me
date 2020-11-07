import React, { useState } from 'react';
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