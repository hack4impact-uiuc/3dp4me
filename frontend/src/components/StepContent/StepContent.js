import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import './StepContent.scss';
import swal from 'sweetalert';
import {
    CircularProgress,
    Backdrop,
    Button,
    Select,
    MenuItem,
} from '@material-ui/core';

import { STEP_STATUS, FIELD_TYPES } from '../../utils/constants';
import { formatDate } from '../../utils/date';
import { downloadFile, uploadFile, deleteFile } from '../../api/api';
import StepField from '../../components/StepField/StepField';
import BottomBar from '../../components/BottomBar/BottomBar';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import { useTranslations } from '../../hooks/useTranslations';

const StepContent = ({
    patientId,
    metaData,
    loading,
    stepData,
    onDataSaved,
}) => {
    const [edit, setEdit] = useState(false);
    const [updatedData, setUpdatedData] = useState(_.cloneDeep(stepData));
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [singleQuestionFormat, setSingleQuestionFormat] = useState(false);
    const [translations, selectedLang] = useTranslations();
    const errorWrap = useErrorWrap();

    useEffect(() => {
        setUpdatedData(_.cloneDeep(stepData));
    }, [stepData]);

    const handleSimpleUpdate = (fieldKey, value) => {
        setUpdatedData((data) => {
            const dataCopy = _.cloneDeep(data);
            _.set(dataCopy, fieldKey, value);
            return dataCopy;
        });
    };

    const handleFileDelete = async (fieldKey, file) => {
        errorWrap(async () => {
            await deleteFile(patientId, metaData.key, fieldKey, file.filename);
            if (!updatedData[fieldKey]) return;

            let updatedFiles = _.cloneDeep(updatedData[fieldKey]);
            updatedFiles = updatedFiles.filter(
                (f) => f.filename !== file.filename,
            );

            handleSimpleUpdate(fieldKey, updatedFiles);
        });
    };

    const handleFileDownload = (fieldKey, filename) => {
        errorWrap(async () => {
            await downloadFile(patientId, metaData.key, fieldKey, filename);
        });
    };

    const handleFileUpload = async (fieldKey, file) => {
        errorWrap(async () => {
            const res = await uploadFile(
                patientId,
                metaData.key,
                fieldKey,
                file.name,
                file,
            );

            const newFile = {
                filename: res.data.name,
                uploadedBy: res.data.uploadedBy,
                uploadDate: res.data.uploadDate,
            };

            let files = _.cloneDeep(updatedData[fieldKey]);
            if (files) files = files.concat(newFile);
            else files = [newFile];

            handleSimpleUpdate(fieldKey, files);
        });
    };

    const saveData = () => {
        onDataSaved(metaData.key, updatedData);
        setEdit(false);
        swal(
            translations.components.bottombar.savedMessage.patientInfo,
            '',
            'success',
        );
    };

    const handleQuestionFormatSelect = (e) => {
        setSingleQuestionFormat(e.target.value);
    };

    const discardData = () => {
        swal({
            title: translations.components.button.discard.question,
            text: translations.components.button.discard.warningMessage,
            icon: 'warning',
            dangerMode: true,
            buttons: [
                translations.components.button.discard.cancelButton,
                translations.components.button.discard.confirmButton,
            ],
        }).then((isDeleteConfirmed) => {
            if (isDeleteConfirmed) {
                swal({
                    title: translations.components.button.discard.success,
                    icon: 'success',
                    buttons:
                        translations.components.button.discard.confirmButton,
                });
                // TODO: Nonexistent values don't get reset.
                setUpdatedData(_.cloneDeep(stepData));
                setEdit(false);
            }
        });
    };

    const generateHeader = () => {
        if (metaData == null || metaData.displayName == null) return null;

        return <h1>{metaData.displayName[selectedLang]}</h1>;
    };

    const genereateFields = () => {
        if (metaData == null || metaData.fields == null) return null;
        // if displaying a single question per page, only return the right numbered question
        return metaData.fields.map((field) => {
            const stepField = (
                <div className="step-field">
                    <StepField
                        displayName={field.displayName[selectedLang]}
                        metadata={field}
                        value={updatedData ? updatedData[field.key] : null}
                        key={field.key}
                        langKey={selectedLang}
                        isDisabled={!edit}
                        patientId={patientId}
                        stepKey={metaData.key}
                        handleSimpleUpdate={handleSimpleUpdate}
                        handleFileDownload={handleFileDownload}
                        handleFileUpload={handleFileUpload}
                        handleFileDelete={handleFileDelete}
                    />
                </div>
            );

            if (singleQuestionFormat) {
                if (currentQuestion === field.fieldNumber) {
                    if (
                        field.fieldType === FIELD_TYPES.HEADER ||
                        field.fieldType === FIELD_TYPES.DIVIDER
                    ) {
                        if (currentQuestion !== metaData.fields.length - 1)
                            setCurrentQuestion(currentQuestion + 1);
                        return null;
                    }
                    return (
                        <div key={`field-${stepData?.key}-${field.key}`}>
                            {stepField}
                            <Button
                                onClick={() => {
                                    if (currentQuestion !== 0)
                                        setCurrentQuestion(currentQuestion - 1);
                                }}
                            >
                                {translations.components.button.previous}
                            </Button>
                            <Button
                                onClick={() => {
                                    if (
                                        currentQuestion !==
                                        metaData.fields.length - 1
                                    )
                                        setCurrentQuestion(currentQuestion + 1);
                                }}
                            >
                                {translations.components.button.next}
                            </Button>
                        </div>
                    );
                }
                return null;
            }
            return (
                <div key={`field-${stepData?.key}-${field.key}`}>
                    {' '}
                    {stepField}{' '}
                </div>
            );
        });
    };

    const generateFooter = () => {
        return (
            <BottomBar
                lastEditedBy={stepData?.lastEditedBy}
                lastEdited={stepData?.lastEdited}
                onDiscard={discardData}
                onSave={saveData}
                status={updatedData?.status || STEP_STATUS.UNFINISHED}
                onStatusChange={handleSimpleUpdate}
                isEditing={edit}
                onEdit={() => setEdit(true)}
            />
        );
    };

    return (
        <form className="medical-info">
            <Backdrop className="backdrop" open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {generateHeader()}
            <Select
                MenuProps={{
                    style: { zIndex: 35001 },
                }}
                defaultValue={false}
                onChange={handleQuestionFormatSelect}
            >
                <MenuItem value={false}>
                    {translations.components.selectQuestionFormat.allQuestions}
                </MenuItem>
                <MenuItem value>
                    {
                        translations.components.selectQuestionFormat
                            .singleQuestion
                    }
                </MenuItem>
            </Select>
            <p>{`${translations.components.step.lastEditedBy} ${
                stepData?.lastEditedBy
            } ${translations.components.step.on} ${formatDate(
                new Date(stepData?.lastEdited),
                selectedLang,
            )}`}</p>
            {genereateFields()}
            {generateFooter()}
        </form>
    );
};

StepContent.propTypes = {
    patientId: PropTypes.string.isRequired,
    metaData: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    stepData: PropTypes.object.isRequired,
    onDataSaved: PropTypes.func.isRequired,
};

export default StepContent;