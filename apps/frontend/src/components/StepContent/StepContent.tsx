import './StepContent.scss'

import { FieldType, File as FileModel, Step, StepStatus } from '@3dp4me/types'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { trackPromise } from 'react-promise-tracker'
import swal from 'sweetalert'

import { deleteFile, downloadFile, uploadFile } from '../../api/api'
import { useErrorWrap } from '../../hooks/useErrorWrap'
import { useTranslations } from '../../hooks/useTranslations'
import { formatDate } from '../../utils/date'
import { resolveMixedObjPath } from '../../utils/object'
import BottomBar from '../BottomBar/BottomBar'
import StepField from '../StepField/StepField'

// TODO: Break this wayy down
// TODO: Type step data?
export interface StepContentProps {
    patientId: string
    metaData: Step
    loading: boolean
    stepData: Record<string, any>
    edit: boolean
    setEdit: (edit: boolean) => void
    onDataSaved: (key: string, value: any) => void
}

enum questionDisplayMode {
    ALL = 'all',
    SINGLE = 'single',
}

const StepContent = ({
    patientId,
    metaData,
    loading,
    stepData,
    onDataSaved,
    edit,
    setEdit,
}: StepContentProps) => {
    const [updatedData, setUpdatedData] = useState(_.cloneDeep(stepData))
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [singleQuestionFormat, setSingleQuestionFormat] = useState(false)
    const [translations, selectedLang] = useTranslations()
    const errorWrap = useErrorWrap()

    useEffect(() => {
        setUpdatedData(_.cloneDeep(stepData))
    }, [stepData])

    useEffect(() => {
        const determinePreventDefault = (e: BeforeUnloadEvent) => {
            // Check if any of the step is being edited
            if (edit) {
                e.preventDefault()
                e.returnValue = ''
            }
        }
        window.addEventListener('beforeunload', determinePreventDefault)
        return () => window.removeEventListener('beforeunload', determinePreventDefault)
    }, [edit])

    const handleSimpleUpdate = (fieldKey: string, value: any) => {
        setUpdatedData((data) => {
            const dataCopy = _.cloneDeep(data)
            _.set(dataCopy, fieldKey, value)
            return dataCopy
        })
    }

    const handleFileDelete = async (fieldKey: string, file: FileModel) => {
        errorWrap(async () => {
            await trackPromise(deleteFile(patientId, metaData.key, fieldKey, file.filename))
            if (!updatedData[fieldKey]) return

            let updatedFiles = _.cloneDeep(updatedData[fieldKey]) as FileModel[]
            updatedFiles = updatedFiles.filter((f) => f.filename !== file.filename)

            handleSimpleUpdate(fieldKey, updatedFiles)
        })
    }

    const handleFileDownload = (fieldKey: string, filename: string) => {
        errorWrap(async () => {
            await trackPromise(downloadFile(patientId, metaData.key, fieldKey, filename))
        })
    }

    const handleFileUpload = async (fieldKey: string, file: File) => {
        errorWrap(async () => {
            const res = await trackPromise(
                uploadFile(patientId, metaData.key, fieldKey, file.name, file)
            )

            const newFile = {
                filename: res.result.name,
                uploadedBy: res.result.uploadedBy,
                uploadDate: res.result.uploadDate,
            }

            const oldFiles = resolveMixedObjPath(updatedData, fieldKey)
            let files = _.cloneDeep(oldFiles || [])

            if (files) files = files.concat(newFile)
            else files = [newFile]

            handleSimpleUpdate(fieldKey, files)
        })
    }

    const saveData = () => {
        onDataSaved(metaData.key, _.cloneDeep(updatedData))
        setEdit(false)
        swal(translations.components.bottombar.savedMessage.patientInfo, '', 'success')
    }

    const handleQuestionFormatSelect = (e: SelectChangeEvent<questionDisplayMode>) => {
        setSingleQuestionFormat(e.target.value === questionDisplayMode.SINGLE)
    }

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
                    buttons: [translations.components.button.discard.confirmButton],
                })
                // TODO: Nonexistent values don't get reset.
                setUpdatedData(_.cloneDeep(stepData))
                setEdit(false)
            }
        })
    }

    const generateHeader = () => {
        if (metaData == null || metaData.displayName == null) return null

        return <h1>{metaData.displayName[selectedLang]}</h1>
    }

    const generateFields = () => {
        if (metaData == null || metaData.fields == null) return null
        // if displaying a single question per page, only return the right numbered question
        return metaData.fields.map((field) => {
            const stepField = (
                <div className="step-field">
                    <StepField
                        displayName={field.displayName[selectedLang]}
                        metadata={field}
                        value={updatedData ? _.cloneDeep(updatedData[field.key]) : null}
                        key={field.key}
                        isDisabled={!edit}
                        patientId={patientId}
                        stepKey={metaData.key}
                        handleSimpleUpdate={handleSimpleUpdate}
                        handleFileDownload={handleFileDownload}
                        handleFileUpload={handleFileUpload}
                        handleFileDelete={handleFileDelete}
                    />
                </div>
            )

            if (singleQuestionFormat) {
                if (currentQuestion === field.fieldNumber) {
                    if (
                        field.fieldType === FieldType.HEADER ||
                        field.fieldType === FieldType.DIVIDER
                    ) {
                        if (currentQuestion !== metaData.fields.length - 1)
                            setCurrentQuestion(currentQuestion + 1)
                        return null
                    }
                    return (
                        <div key={`field-${stepData?.key}-${field.key}`}>
                            {stepField}
                            <Button
                                onClick={() => {
                                    if (currentQuestion !== 0)
                                        setCurrentQuestion(currentQuestion - 1)
                                }}
                            >
                                {translations.components.button.previous}
                            </Button>
                            <Button
                                onClick={() => {
                                    if (currentQuestion !== metaData.fields.length - 1)
                                        setCurrentQuestion(currentQuestion + 1)
                                }}
                            >
                                {translations.components.button.next}
                            </Button>
                        </div>
                    )
                }
                return null
            }
            return <div key={`field-${stepData?.key}-${field.key}`}> {stepField} </div>
        })
    }

    const generateFooter = () => (
        <BottomBar
            onDiscard={discardData}
            onSave={saveData}
            status={updatedData?.status || StepStatus.UNFINISHED}
            onStatusChange={handleSimpleUpdate}
            isEditing={edit}
            onEdit={() => setEdit(true)}
        />
    )

    const generateLastEditedByAndDate = () => {
        let text = `${translations.components.step.lastEditedBy} ${
            stepData?.lastEditedBy || translations.components.step.none
        }`
        if (stepData?.lastEdited) {
            text += ` ${translations.components.step.on} ${formatDate(new Date(), selectedLang)}`
        }

        return <p className="last-edited-formatting">{text}</p>
    }

    return (
        <form className="medical-info">
            <Backdrop className="backdrop" open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {generateHeader()}

            <div className={`last-edited-and-view-selection-${selectedLang}`}>
                <div className={`last-edited-${selectedLang}`}>{generateLastEditedByAndDate()}</div>

                <div className={`view-selection-${selectedLang}`}>
                    <Select
                        MenuProps={{
                            style: { zIndex: 35001 },
                        }}
                        defaultValue={questionDisplayMode.ALL}
                        onChange={handleQuestionFormatSelect}
                    >
                        <MenuItem value={questionDisplayMode.ALL}>
                            {translations.components.selectQuestionFormat.allQuestions}
                        </MenuItem>
                        <MenuItem value={questionDisplayMode.SINGLE}>
                            {translations.components.selectQuestionFormat.singleQuestion}
                        </MenuItem>
                    </Select>
                </div>
            </div>

            {generateFields()}
            {generateFooter()}
        </form>
    )
}

export default StepContent
