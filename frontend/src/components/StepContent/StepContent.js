import {
    Backdrop,
    Button,
    CircularProgress,
    MenuItem,
    Select,
} from '@material-ui/core';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';
import { trackPromise } from 'react-promise-tracker';

import { deleteFile, downloadFile, uploadFile } from '../../api/api';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import { useTranslations } from '../../hooks/useTranslations';
import { FIELD_TYPES, STEP_STATUS, DIRECTION } from '../../utils/constants';
import { formatDate } from '../../utils/date';
import BottomBar from '../BottomBar/BottomBar';
import StepField from '../StepField/StepField';
import './StepContent.scss';
import { checkBounds } from '../../utils/dashboard-utils';

const StepContent = ({
    patientId,
    metaData,
    loading,
    stepData,
    onDataSaved,
    edit,
    setEdit,
}) => {
    const [updatedData, setUpdatedData] = useState(_.cloneDeep(stepData));
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [singleQuestionFormat, setSingleQuestionFormat] = useState(false);
    const [translations, selectedLang] = useTranslations();
    const errorWrap = useErrorWrap();

    /* 
        Since field numbers don't have to follow an arithmetic progression, ie 0, 1, 2, 3...
        we must check what the smallest field number and set it to currentQuestion.
    */
    useEffect(() => {
        setCurrentQuestion(getSmallestFieldNumber());
    }, [metaData]);

    useEffect(() => {
        setUpdatedData(_.cloneDeep(stepData));
    }, [stepData]);

    useEffect(() => {
        const determinePreventDefault = (e) => {
            // Check if any of the step is being edited
            if (edit) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', determinePreventDefault);
        return () =>
            window.removeEventListener('beforeunload', determinePreventDefault);
    }, [edit]);

    const handleSimpleUpdate = (fieldKey, value) => {
        setUpdatedData((data) => {
            const dataCopy = _.cloneDeep(data);
            _.set(dataCopy, fieldKey, value);
            return dataCopy;
        });
    };

    const handleFileDelete = async (fieldKey, file) => {
        errorWrap(async () => {
            await trackPromise(
                deleteFile(patientId, metaData.key, fieldKey, file.filename),
            );
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
            await trackPromise(
                downloadFile(patientId, metaData.key, fieldKey, filename),
            );
        });
    };

    const handleFileUpload = async (fieldKey, file) => {
        errorWrap(async () => {
            const res = await trackPromise(
                uploadFile(patientId, metaData.key, fieldKey, file.name, file),
            );

            const newFile = {
                filename: res.result.name,
                uploadedBy: res.result.uploadedBy,
                uploadDate: res.result.uploadDate,
            };

            let files = _.cloneDeep(updatedData[fieldKey]);

            if (files) files = files.concat(newFile);
            else files = [newFile];

            handleSimpleUpdate(fieldKey, files);
        });
    };

    const saveData = () => {
        onDataSaved(metaData.key, _.cloneDeep(updatedData));
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

    // Returns the smallest fieldNumber out of all of the fields in metaData
    const getSmallestFieldNumber = () => {

        if (!metaData || metaData.length === 0) return;

        let smallestFieldNumber = metaData.fields[0].fieldNumber;

        for (let i = 1; i < metaData.fields.length; i++) {
            smallestFieldNumber = Math.min(smallestFieldNumber, metaData.fields[i].fieldNumber);
        }

        return smallestFieldNumber;
    };

    const getFieldIndexGivenFieldNumber = (fieldNumber) => {
        return metaData.fields.findIndex((element) => element.fieldNumber === fieldNumber)
    }

    const fieldDoesExist = (fieldNumber) => {
        return getFieldIndexGivenFieldNumber(fieldNumber) >= 0;
    }

    const isAnEditableField = (fieldNumber) => {
        const fieldIndex = getFieldIndexGivenFieldNumber(fieldNumber);

        if (fieldIndex < 0) return false;

        const fieldType = metaData.fields[fieldIndex].fieldType;
        return (fieldType !== FIELD_TYPES.HEADER && fieldType !== FIELD_TYPES.DIVIDER);
    }

    /*
        Since field numbers don't have to follow an arithmetic progression, ie 0, 1, 2, 3...,
        you can't get the next or previous field by adding or subtracting 1. Furthermore,
        when moving onto the next or previous field, we also don't want to stop on a non-editable field,
        like a HEADER field. This function returns the next/previous editable field, given the current field.
    */
    const getAdjacentField = (currFieldNumber, direction) => {
        let adjacentField = currFieldNumber + direction;

        while (
            checkBounds(0, metaData.fields.length, adjacentField) &&
            (!fieldDoesExist(adjacentField) || !isAnEditableField(adjacentField))
        ) {
            adjacentField += direction;
        }

        if (adjacentField < 0 || adjacentField >= metaData.fields.length) {
            return currFieldNumber;
        }
        return adjacentField;
    }

    const generateFields = () => {
        if (metaData == null || metaData.fields == null) return null;
        // if displaying a single question per page, only return the right numbered question
        return metaData.fields.map((field) => {
            const stepField = (
                <div className="step-field">
                    <StepField
                        displayName={field.displayName[selectedLang]}
                        metadata={field}
                        value={
                            updatedData
                                ? _.cloneDeep(updatedData[field.key])
                                : null
                        }
                        initValue={
                            stepData ? _.cloneDeep(stepData[field.key]) : null
                        }
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
                    return (
                        <div key={`field-${stepData?.key}-${field.key}`}>
                            {stepField}
                            <Button
                                onClick={() => {
                                    if (currentQuestion !== 0)
                                        setCurrentQuestion(getAdjacentField(currentQuestion, DIRECTION.UP));
                                }}
                                className="prev-button"
                            >
                                {translations.components.button.previous}
                            </Button>
                            <Button
                                onClick={() => {
                                    if (
                                        currentQuestion !==
                                        metaData.fields.length - 1
                                    )
                                        setCurrentQuestion(getAdjacentField(currentQuestion, DIRECTION.DOWN));
                                }}
                                className="next-button"
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

    const generateLastEditedByAndDate = () => {
        let text = `${translations.components.step.lastEditedBy} ${stepData?.lastEditedBy || translations.components.step.none
            }`;
        if (stepData?.lastEdited) {
            text += ` ${translations.components.step.on} ${formatDate(
                stepData.lastEdited,
                selectedLang,
            )}`;
        }

        return <p className="last-edited-formatting">{text}</p>;
    };

    return (
        <form className="medical-info">
            <Backdrop className="backdrop" open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {generateHeader()}

            <div className={`last-edited-and-view-selection-${selectedLang}`}>
                <div className={`last-edited-${selectedLang}`}>
                    {generateLastEditedByAndDate()}
                </div>

                <div className={`view-selection-${selectedLang}`}>
                    <Select
                        MenuProps={{
                            style: { zIndex: 35001 },
                        }}
                        defaultValue={false}
                        onChange={handleQuestionFormatSelect}
                    >
                        <MenuItem value={false}>
                            {
                                translations.components.selectQuestionFormat
                                    .allQuestions
                            }
                        </MenuItem>
                        <MenuItem value>
                            {
                                translations.components.selectQuestionFormat
                                    .singleQuestion
                            }
                        </MenuItem>
                    </Select>
                </div>
            </div>

            {generateFields()}
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
    edit: PropTypes.bool.isRequired,
    setEdit: PropTypes.func.isRequired,
};

export default StepContent;
