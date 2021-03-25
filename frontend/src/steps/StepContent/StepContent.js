import React, { useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import './StepContent.scss';
import swal from 'sweetalert';
import { CircularProgress, Backdrop } from '@material-ui/core';
import { formatDate } from '../../utils/date';
import {
    downloadFile,
    uploadFile,
    uploadAudioFile,
    deleteFile,
} from '../../utils/api';
import StepField from '../../components/StepField/StepField';
import BottomBar from '../../components/BottomBar/BottomBar';
import { LanguageDataType } from '../../utils/custom-proptypes';
import { FIELD_TYPES } from '../../utils/constants';

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

    const handleSimpleUpdate = (fieldKey, value) => {
        const dataCopy = _.cloneDeep(updatedData);
        dataCopy[fieldKey] = value;
        setUpdatedData(dataCopy);
    };

    const handleFileDelete = async (fieldKey, file) => {
        deleteFile(patientId, stepData.key, file.fileName);
        let updatedFiles = _.cloneDeep(updatedData[fieldKey]);
        updatedFiles = updatedFiles.filter((f) => f.fileName !== file.fileName);

        handleSimpleUpdate(fieldKey, updatedFiles);
    };

    const handleFileDownload = (fileName) => {
        downloadFile(patientId, stepData.key, fileName);
    };

    const handleFileUpload = async (fileKey, file) => {
        const fieldMetadata = metaData.fields.find((field) => {
            return field.key === fileKey;
        });

        let res = null;
        if (fieldMetadata.fieldType == FIELD_TYPES.AUDIO) {
            res = await uploadAudioFile(
                patientId,
                stepData.key,
                file,
                file.name,
            );
        } else {
            res = await uploadFile(patientId, stepData.key, file, file.name);
        }

        // TODO: Display error if res is null
        let files = _.cloneDeep(stepData[fileKey]);
        let newFile = {
            fileName: res.data.data.name,
            uploadedBy: res.data.data.uploadedBy,
            uploadDate: res.data.data.uploadDate,
        };

        if (files) files = files.concat(newFile);
        else files = [newFile];

        handleSimpleUpdate(fileKey, files);
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
            return (
                <StepField
                    fieldType={field.fieldType}
                    displayName={field.displayName[key]}
                    value={updatedData[field.key]}
                    fieldId={field.key}
                    key={field.key}
                    isDisabled={!edit}
                    handleSimpleUpdate={handleSimpleUpdate}
                    handleFileDownload={handleFileDownload}
                    handleFileUpload={handleFileUpload}
                    handleFileDelete={handleFileDelete}
                    languageData={languageData}
                />
            );
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
    patientId: PropTypes.string.isRequired,
    metaData: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    stepData: PropTypes.object.isRequired,
    onDataSaved: PropTypes.func.isRequired,
};

export default StepContent;
