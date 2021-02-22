import React from 'react';
import './Files.scss';
import { Button, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import { LanguageDataType } from '../../utils/custom-proptypes';

const Files = ({
    languageData,
    title,
    files,
    fieldKey,
    handleDownload,
    handleDelete,
    handleUpload,
}) => {
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const RenderExistingFiles = () => {
        if (files == null) return null;

        return files.map((file) => (
            <div className="file-row-wrapper" key={file.fileName}>
                <Button
                    className="file-button"
                    onClick={() => {
                        handleDownload(fieldKey, file);
                    }}
                >
                    <div className="file-info-wrapper">
                        <ArrowDownwardIcon />
                        <div>
                            <Typography align="left">
                                {`${file.fileName}`}
                            </Typography>
                            <p id="file-upload-timestamp">
                                {file.uploadedDate.toString()}
                            </p>
                        </div>
                    </div>
                </Button>
                <button
                    className="file-close-button"
                    type="button"
                    onClick={() => handleDelete(fieldKey, file)}
                >
                    <CloseIcon />
                </button>
            </div>
        ));
    };

    return (
        <div className="files-wrapper">
            <div className="files-header">
                <h3>{title}</h3>
            </div>
            <div className="files-table">
                {RenderExistingFiles()}
                <label htmlFor={`upload-file-input-${title}`}>
                    <input
                        id={`upload-file-input-${title}`}
                        className="upload-file-input"
                        type="file"
                        onChange={(e) => {
                            handleUpload(fieldKey, e.target.value);
                        }}
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
    title: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.string).isRequired,
    fieldKey: PropTypes.string.isRequired,
    handleDownload: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleUpload: PropTypes.func.isRequired,
};

export default Files;
