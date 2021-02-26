import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import './StepContent.scss';
import swal from 'sweetalert';
import { formatDate } from '../../utils/date';
import Files from '../../components/Files/Files';
import {
    CircularProgress,
    Divider,
    Button,
    FormControlLabel,
    Radio,
    RadioGroup,
    Backdrop,
} from '@material-ui/core';
import {
    downloadFile,
    uploadFile,
    deleteFile,
    updateStage,
} from '../../utils/api';
import TextField from '../../components/Fields/TextField';
import Notes from '../../components/Notes/Notes';
import BottomBar from '../../components/BottomBar/BottomBar';
import { LanguageDataType } from '../../utils/custom-proptypes';

const StepContent = ({
    languageData,
    patientId,
    metaData,
    loading,
    stepData,
    onDataSaved,
}) => {
    const [edit, setEdit] = useState(false);
    const [updatedData, setUpdatedData] = useState(_.cloneDeep(stepData));

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const handleFileDelete = async (key, file) => {
        deleteFile(patientId, stepData.key, file.fileName);
        let updatedFiles = _.cloneDeep(stepData[key]);
        updatedFiles = updatedFiles.filter((f) => f.fileName !== file.fileName);

        handleSimpleUpdate(key, updatedFiles);
    };

    const handleFileDownload = (fileName) => {
        downloadFile(patientId, stepData.key, fileName);
    };

    const handleFileUpload = async (key, file) => {
        let filePrefix = '';
        if (metaData.fields[key].prefix != null)
            filePrefix = metaData.fields[key].prefix + '_';

        const formattedFileName = `${filePrefix}${file.name}`;
        const res = await uploadFile(
            patientId,
            stepData.key,
            file,
            formattedFileName,
        );

        // TODO: Display error if res is null
        let files = _.cloneDeep(stepData[key]);
        files = files.concat({
            fileName: res.data.data.name,
            uploadedBy: res.data.data.uploadedBy,
            uploadDate: res.data.data.uploadDate,
        });

        handleSimpleUpdate(key, files);
    };

    const handleSimpleUpdate = (key, value) => {
        let dataCopy = _.cloneDeep(updatedData);
        dataCopy[key] = value;
        setUpdatedData(dataCopy);
    };

    const saveData = () => {
        onDataSaved(stepData.key, updatedData);
        setEdit(false);
        swal(lang.components.bottombar.savedMessage.patientInfo, '', 'success');
    };

    const discardData = () => {
        swal({
            title: lang.components.button.discard.question,
            text: lang.components.button.discard.warningMessage,
            icon: 'warning',
            dangerMode: true,
            buttons: [
                lang.components.button.discard.cancelButton,
                lang.components.button.discard.confirmButton,
            ],
        }).then((isDeleteConfirmed) => {
            if (isDeleteConfirmed) {
                swal({
                    title: lang.components.button.discard.success,
                    icon: 'success',
                    buttons: lang.components.button.discard.confirmButton,
                });
                // TODO: Nonexistent values don't get reset.
                setUpdatedData(_.cloneDeep(stepData));
                setEdit(false);
            }
        });
    };

    const generateHeader = () => {
        if (metaData == null || metaData.displayName == null) return null;

        return <h1>{metaData.displayName[key]}</h1>;
    };

    const genereateFields = () => {
        if (metaData == null || metaData.fields == null) return null;
        if (updatedData == null) return null;

        return metaData.fields.map((field) => {
            if (field.fieldType == 'String') {
                return (
                    <TextField
                        displayName={field.displayName[key]}
                        isDisabled={!edit}
                        onChange={handleSimpleUpdate}
                        key={field.key}
                        fieldId={field.key}
                        value={updatedData[field.key]}
                    />
                );
            } else if (field.fieldType == 'MultilineString') {
                return (
                    <div>
                        <Notes
                            disabled={!edit}
                            onChange={handleSimpleUpdate}
                            title={field.displayName[key]}
                            key={field.key}
                            fieldId={field.key}
                            value={updatedData[field.key]}
                        />
                    </div>
                );
            } else if (field.fieldType == 'Date') {
                return (
                    <TextField
                        displayName={field.displayName[key]}
                        isDisabled={!edit}
                        onChange={handleSimpleUpdate}
                        key={field.key}
                        fieldId={field.key}
                        value={updatedData[field.key]}
                    />
                );
            } else if (field.fieldType == 'Phone') {
                return (
                    <TextField
                        displayName={field.displayName[key]}
                        isDisabled={!edit}
                        onChange={handleSimpleUpdate}
                        fieldId={field.key}
                        key={field.key}
                        value={updatedData[field.key]}
                    />
                );
            } else if (field.fieldType == 'File') {
                return (
                    <Files
                        languageData={languageData}
                        title={field.displayName[key]}
                        files={updatedData[field.key]}
                        fieldKey={field.key}
                        key={field.key}
                        handleDownload={handleFileDownload}
                        handleUpload={handleFileUpload}
                        handleDelete={handleFileDelete}
                    />
                );
            } else if (field.fieldType == 'Divider') {
                return (
                    <div className="patient-divider-wrapper">
                        <h2>{field.displayName[key]}</h2>
                        <Divider className="patient-divider" />
                    </div>
                );
            } else if (field.fieldType == 'Header') {
                return <h3>{field.displayName[key]}</h3>;
            }

            return null;
        });
    };

    const generateFooter = () => {
        if (stepData == null) return null;

        return (
            <BottomBar
                lastEditedBy={stepData?.lastEditedBy}
                lastEdited={stepData?.lastEdited}
                onDiscard={discardData}
                onSave={saveData}
                status={updatedData?.status}
                onStatusChange={handleSimpleUpdate}
                edit={edit}
                setEdit={setEdit}
                languageData={languageData}
            />
        );
    };

    return (
        <form className="medical-info">
            <Backdrop className="backdrop" open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {generateHeader()}
            <p>{`${lang.components.step.lastEditedBy} ${
                stepData?.lastEditedBy
            } ${lang.components.step.on} ${formatDate(
                stepData?.lastEdited,
                key,
            )}`}</p>
            {genereateFields()}
            {generateFooter()}
        </form>
    );
};

StepContent.propTypes = {
    languageData: LanguageDataType.isRequired,
    information: PropTypes.object.isRequired,
    patientId: PropTypes.string.isRequired,
    metaData: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    stepData: PropTypes.object.isRequired,
    onDataSaved: PropTypes.func.isRequired,
};

export default StepContent;
