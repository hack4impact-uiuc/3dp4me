import React from 'react'
import './Files.scss'
import { Button, Typography } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AddIcon from '@material-ui/icons/Add';

const Download = (props) => {
    const lang = props.lang.data;
    const key = props.lang.key;

    return (
        <div className="files-wrapper">
            <div className="files-header">
                <h3>{props.title}</h3>
            </div>
            <div className="files-table">
                {props.fileNames.map(fileName => (
                    <Button className="file-button" onClick={props.state}>
                        <ArrowDownwardIcon />
                        <Typography align="left">
                            <b>{lang[key].components.file.download}</b>{` ${fileName}`}
                        </Typography>
                    </Button>
                ))}

                <label htmlFor="upload-file-input">
                    <input
                        id="upload-file-input"
                        type="file"
                    />
                    <Button className="file-button" component="span">
                        <AddIcon />
                        <Typography align="left">
                            <b>{lang[key].components.file.addAnother}</b>
                        </Typography>
                    </Button>
                </label>
            </div>
        </div>
    );
}

export default Download;