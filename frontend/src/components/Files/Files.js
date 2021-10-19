import { Button, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import React from 'react';

import { useTranslations } from '../../hooks/useTranslations';
import './Files.scss';

const Files = ({
    title,
    files = [],
    fieldKey,
    handleDownload,
    handleDelete,
    handleUpload,
}) => {
    const translations = useTranslations()[0];

    const RenderExistingFiles = () => {
        if (files == null) return null;

        return files.map((file) => (
            <div className="file-row-wrapper" key={file.filename}>
                <Button
                    className="file-button"
                    onClick={() => {
                        handleDownload(fieldKey, file.filename);
                    }}
                >
                    <div className="file-info-wrapper">
                        <ArrowDownwardIcon />
                        <div>
                            <Typography align="left">
                                {`${file.filename}`}
                            </Typography>
                            <p id="file-upload-timestamp">
                                {file.uploadDate.toString()}
                            </p>
                        </div>
                    </div>
                </Button>
                <button
                    className="file-close-button"
                    type="button"
                    onClick={() => {
                        handleDelete(fieldKey, file);
                    }}
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
                            handleUpload(fieldKey, e.target.files[0]);
                        }}
                    />
                    <Button className="file-button" component="span">
                        <AddIcon />
                        <Typography align="left">
                            <b>{translations.components.file.addAnother}</b>
                        </Typography>
                    </Button>
                </label>
            </div>
        </div>
    );
};

Files.propTypes = {
    title: PropTypes.string.isRequired,
    fieldKey: PropTypes.string.isRequired,
    handleDownload: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleUpload: PropTypes.func.isRequired,
    files: PropTypes.arrayOf(
        PropTypes.shape({
            filename: PropTypes.string.isRequired,
            uploadDate: PropTypes.instanceOf(Date).isRequired,
        }),
    ),
};

export default Files;
