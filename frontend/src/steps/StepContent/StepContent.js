import React, { useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import './StepContent.scss';
import swal from 'sweetalert';
import { CircularProgress, Backdrop, Button } from '@material-ui/core';

import { formatDate } from '../../utils/date';
import { downloadFile, uploadFile, deleteFile } from '../../utils/api';
import StepField from '../../components/StepField/StepField';
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
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const handleSimpleUpdate = (fieldKey, value) => {
        const dataCopy = _.cloneDeep(updatedData);
        dataCopy[fieldKey] = value;
        setUpdatedData(dataCopy);
    };

    const handleFileDelete = async (fileKey, file) => {
        deleteFile(patientId, stepData.key, file.fileName);
        let updatedFiles = _.cloneDeep(stepData[fileKey]);
        updatedFiles = updatedFiles.filter((f) => f.fileName !== file.fileName);

        handleSimpleUpdate(fileKey, updatedFiles);
    };

    const handleFileDownload = (fileName) => {
        downloadFile(patientId, stepData.key, fileName);
    };

    const handleFileUpload = async (fileKey, file) => {
        let filePrefix = '';
        const fieldMetadata = metaData.fields.find((field) => {
            return field.key === fileKey;
        });
        if (
            fieldMetadata.filePrefix !== null &&
            fieldMetadata.filePrefix !== ''
        )
            filePrefix = `${fieldMetadata.filePrefix}_`;

        const formattedFileName = `${filePrefix}${file.name}`;
        const res = await uploadFile(
            patientId,
            stepData.key,
            file,
            formattedFileName,
        );

        // TODO: Display error if res is null
        let files = _.cloneDeep(stepData[fileKey]);
        files = files.concat({
            fileName: res.data.data.name,
            uploadedBy: res.data.data.uploadedBy,
            uploadDate: res.data.data.uploadDate,
        });

        handleSimpleUpdate(fileKey, files);
    };

    const saveData = () => {
        onDataSaved(metaData.key, updatedData);
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

        // if the current step is a survey step then only return the right numbered question
        return metaData.fields.map((field) => {
            if (stepData.key === 'info') {
                // replace with survey step once complete
                if (currentQuestion === field.fieldNumber) {
                    return (
                        <div>
                            <StepField
                                fieldType={field.fieldType}
                                displayName={field.displayName[key]}
                                value={
                                    updatedData ? updatedData[field.key] : null
                                }
                                fieldId={field.key}
                                key={field.key}
                                isDisabled={!edit}
                                handleSimpleUpdate={handleSimpleUpdate}
                                handleFileDownload={handleFileDownload}
                                handleFileUpload={handleFileUpload}
                                handleFileDelete={handleFileDelete}
                                languageData={languageData}
                            />
                            <Button
                                onClick={() => {
                                    if (currentQuestion !== 0)
                                        setCurrentQuestion(currentQuestion - 1);
                                }}
                            >
                                {lang.components.button.previous}
                            </Button>
                            <Button
                                onClick={() => {
                                    setCurrentQuestion(currentQuestion + 1);
                                }}
                            >
                                {lang.components.button.next}
                            </Button>
                        </div>
                    );
                } else return null;
            } else {
                return (
                    <StepField
                        fieldType={field.fieldType}
                        displayName={field.displayName[key]}
                        value={updatedData ? updatedData[field.key] : null}
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
            }
        });
    };

    const generateFooter = () => {
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
