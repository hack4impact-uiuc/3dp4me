import React from 'react';
import './Files.scss';
import { Button, Typography } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import { LanguageDataType } from '../../utils/custom-proptypes';

const Files = ({
    languageData,
    title,
    fileNames,
    handleDownload,
    handleDelete,
    handleUpload,
}) => {
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    return (
        <div className="files-wrapper">
            <div className="files-header">
                <h3>{title}</h3>
            </div>
            <div className="files-table">
                {fileNames.map((fileName) => (
                    <div className="file-row-wrapper" key={fileName}>
                        <Button
                            className="file-button"
                            onClick={() => {
                                handleDownload(fileName);
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
                            onClick={() => handleDelete(fileName)}
                        >
                            <CloseIcon />
                        </button>
                    </div>
                ))}

                <label htmlFor={`upload-file-input-${title}`}>
                    <input
                        id={`upload-file-input-${title}`}
                        className="upload-file-input"
                        type="file"
                        onChange={handleUpload}
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
