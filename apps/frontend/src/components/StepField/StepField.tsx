/* eslint import/no-cycle: "off" */

import { Field, FieldType, File as FileModel } from '@3dp4me/types'
import Divider from '@mui/material/Divider'
import React from 'react'

import { useTranslations } from '../../hooks/useTranslations'

const AudioRecorder = React.lazy(() => import('../AudioRecorder/AudioRecorder'))
const DateField = React.lazy(() => import('../Fields/DateField'))
const FieldGroup = React.lazy(() => import('../Fields/FieldGroup/FieldGroup'))
const MapField = React.lazy(() => import('../Fields/MapField/MapField'))
const PhotoField = React.lazy(() => import('../Fields/PhotoField'))
const RadioButtonField = React.lazy(() => import('../Fields/RadioButtonField'))
const SignatureField = React.lazy(() => import('../Fields/SignatureField'))
const TextArea = React.lazy(() => import('../Fields/TextArea'))
const TextField = React.lazy(() => import('../Fields/TextField'))
const Files = React.lazy(() => import('../Files/Files'))
const PhoneField = React.lazy(() => import('../Fields/PhoneField'))

export interface StepFieldProps {
    metadata: Field
    value: any
    patientId: string
    displayName: string
    stepKey: string
    fieldPathPrefix?: string // The prefix to a path if it's in a field group (e.g. "fields.0.")
    isDisabled?: boolean
    handleSimpleUpdate?: (key: string, value: any) => void
    handleFileDownload?: (key: string, name: string) => void
    handleFileUpload?: (key: string, file: File) => void
    handleFileDelete?: (key: string, file: FileModel) => void
}

const StepField = ({
    metadata,
    value,
    patientId = '',
    displayName,
    stepKey,
    fieldPathPrefix = '',
    isDisabled = true,
    handleSimpleUpdate = () => {},
    handleFileDownload = () => {},
    handleFileUpload = () => {},
    handleFileDelete = () => {},
}: StepFieldProps) => {
    const selectedLang = useTranslations()[1]

    const generateField = () => {
        switch (metadata.fieldType) {
            case FieldType.STRING:
                return (
                    <TextField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        type="text"
                        onChange={handleSimpleUpdate}
                        fieldId={metadata.key}
                        value={value}
                    />
                )
            case FieldType.NUMBER:
                return (
                    <TextField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        type="number"
                        onChange={handleSimpleUpdate}
                        fieldId={metadata.key}
                        value={value}
                    />
                )
            case FieldType.PHONE:
                return (
                    <PhoneField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        onChange={handleSimpleUpdate}
                        fieldId={metadata.key}
                        value={value}
                    />
                )
            case FieldType.MULTILINE_STRING:
                return (
                    <div>
                        <TextArea
                            disabled={isDisabled}
                            onChange={handleSimpleUpdate}
                            title={displayName}
                            fieldId={metadata.key}
                            value={value}
                        />
                    </div>
                )
            case FieldType.DATE:
                return (
                    <DateField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        onChange={handleSimpleUpdate}
                        fieldId={metadata.key}
                        value={value}
                    />
                )
            case FieldType.FILE:
                return (
                    <Files
                        title={displayName}
                        files={value}
                        fieldKey={metadata.key}
                        handleDownload={handleFileDownload}
                        handleUpload={handleFileUpload}
                        handleDelete={handleFileDelete}
                        isDisabled={isDisabled}
                    />
                )

            case FieldType.RADIO_BUTTON:
                return (
                    <RadioButtonField
                        fieldId={metadata.key}
                        isDisabled={isDisabled}
                        title={displayName}
                        value={value}
                        options={metadata.options}
                        onChange={handleSimpleUpdate}
                    />
                )

            case FieldType.AUDIO:
                return (
                    <AudioRecorder
                        handleUpload={handleFileUpload}
                        handleDelete={handleFileDelete}
                        selectedLanguage={selectedLang}
                        patientId={patientId}
                        fieldKey={metadata.key}
                        stepKey={stepKey}
                        files={value}
                        title={displayName}
                        isDisabled={isDisabled}
                        key={stepKey}
                    />
                )
            case FieldType.DIVIDER:
                return (
                    <div className="patient-divider-wrapper">
                        <h2>{displayName}</h2>
                        <Divider className="patient-divider" />
                    </div>
                )
            case FieldType.FIELD_GROUP:
                return (
                    <FieldGroup
                        metadata={metadata}
                        patientId={patientId}
                        fieldPathPrefix={fieldPathPrefix}
                        stepKey={stepKey}
                        isDisabled={isDisabled}
                        handleSimpleUpdate={handleSimpleUpdate}
                        handleFileDownload={handleFileDownload}
                        handleFileUpload={handleFileUpload}
                        handleFileDelete={handleFileDelete}
                        value={value}
                    />
                )
            case FieldType.SIGNATURE:
                return (
                    <SignatureField
                        displayName={displayName}
                        isDisabled={isDisabled}
                        onChange={handleSimpleUpdate}
                        fieldId={metadata.key}
                        value={value}
                        documentURL={metadata?.additionalData?.defaultDocumentURL}
                    />
                )
            case FieldType.HEADER:
                return <h3>{displayName}</h3>
            case FieldType.MAP:
                return (
                    <MapField
                        value={value}
                        displayName={displayName}
                        isDisabled={isDisabled}
                        onChange={handleSimpleUpdate}
                        fieldId={metadata.key}
                    />
                )
            case FieldType.PHOTO:
                return (
                    <PhotoField
                        handleFileUpload={handleFileUpload}
                        patientId={patientId}
                        stepKey={stepKey}
                        fieldPathPrefix={fieldPathPrefix}
                        value={value || []}
                        displayName={displayName}
                        fieldId={metadata.key}
                        isDisabled={isDisabled}
                    />
                )
            default:
                return null
        }
    }

    return <div>{generateField()}</div>
}

export default StepField
