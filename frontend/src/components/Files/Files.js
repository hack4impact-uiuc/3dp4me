import React from 'react';
import './Files.scss';
import { Button, Typography } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import { LanguageDataType } from '../../utils/custom-proptypes';

const Files = (props) => {
    const key = props.languageData.selectedLanguage;
    const lang = props.languageData.translations[key];

    return (
        <div className="files-wrapper">
            <div className="files-header">
                <h3>{props.title}</h3>
            </div>
            <div className="files-table">
                {props.fileNames.map((fileName) => (
                    <div className="file-row-wrapper" key={fileName}>
                        <Button
                            className="file-button"
                            onClick={() => {
                                props.handleDownload(fileName);
                            }}
                        >
                            <div className="file-info-wrapper">
                                <ArrowDownwardIcon />
                                <div>
                                    <Typography align="left">
                                        {`${fileName}`}
                                    </Typography>
                                    <p id="file-upload-timestamp">
                                        10/14/2020 at 12:34PM
                                    </p>
                                </div>
                            </div>
                        </Button>
                        <button
                            className="file-close-button"
                            type="button"
                            onClick={() => props.handleDelete(fileName)}
                        >
                            <CloseIcon />
                        </button>
                    </div>
                ))}

                <label htmlFor={`upload-file-input-${props.title}`}>
                    <input
                        id={`upload-file-input-${props.title}`}
                        className="upload-file-input"
                        type="file"
                        onChange={props.handleUpload}
                    />
                    <Button className="file-button" component="span">
                        <AddIcon />
                        <Typography align="left">
                            <b>{lang.components.file.addAnother}</b>
                        </Typography>
                    </Button>
                </label>
            </div>
        </div>
    );
};

Files.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default Files;
