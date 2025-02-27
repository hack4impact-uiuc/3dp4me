import './CreateFieldModal.scss'

import {
    AdditionalFieldData,
    Field,
    FieldType,
    Language,
    TranslatedString,
    Unsaved,
} from '@3dp4me/types'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import InputBase from '@mui/material/InputBase'
import Modal from '@mui/material/Modal'
import NativeSelect from '@mui/material/NativeSelect'
import _ from 'lodash'
import React, { ChangeEventHandler, ReactNode, useState } from 'react'
import { trackPromise } from 'react-promise-tracker'

import { uploadSignatureDocument } from '../../api/api'
import { useErrorWrap } from '../../hooks/useErrorWrap'
import { useTranslations } from '../../hooks/useTranslations'
import { ADMIN_ID, PUBLIC_CLOUDFRONT_URL } from '../../utils/constants'
import { canFieldBeAddedToStep, getFieldName, isFieldType, validateField } from '../../utils/fields'
import { randomAlphaNumericString } from '../../utils/math'
import { FormOption } from '../Fields/FormOption'
import MultiSelectField from '../Fields/MultiSelectField'
import { FileUploadButton } from '../FileUploadButton/FileUploadButton'
import LanguageInput from '../LanguageInput/LanguageInput'
import { styled } from '@mui/material'

export type NewField = Unsaved<Omit<Field, 'fieldNumber' | 'key' | 'isHidden' | 'isDeleted'>>

export interface CreateFieldModalProps {
    isOpen: boolean
    onModalClose: () => void
    allRoles: FormOption[]
    onAddNewField: (field: NewField) => void
    canAddFieldGroup?: boolean
}

const CreateFieldModal = ({
    isOpen,
    onModalClose,
    allRoles,
    onAddNewField,
    canAddFieldGroup = true,
}: CreateFieldModalProps) => {
    const [translations, selectedLang] = useTranslations()
    const [fieldType, setFieldType] = useState(FieldType.STRING)
    const [selectedRoles, setSelectedRoles] = useState([ADMIN_ID]) // automatically select the Admin role
    const [isVisibleOnDashboard, setIsVisibleOnDashboard] = useState(false)
    const [displayName, setDisplayName] = useState({ EN: '', AR: '' })
    const [options, setOptions] = useState<TranslatedString[]>([])
    const [documentURL, setDocumentURL] = useState<string>('')
    const [isUploading, setIsUploading] = useState(false)

    const errorWrap = useErrorWrap()

    const BootstrapInput = styled(InputBase)(({ theme }) => ({
        root: {
            'label + &': {
                marginTop: theme.spacing(3),
            },
        },
        input: {
            borderRadius: 4,
            position: 'relative',
            backgroundColor: '#dedffb',
            border: '1px solid #ced4da',
            fontSize: 16,
            padding: '10px 26px 10px 12px',
            // transition: theme?.transitions?.create(['border-color', 'box-shadow']),
            // Use the system font instead of the default Roboto font.
            '&:focus': {
                borderRadius: 4,
                borderColor: '#80bdff',
                boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
            },
            selected: {
                backgroundColor: '#dedffb',
            },
        },
    }))

    const onRolesChange = (id: string, roles: string[]) => {
        setSelectedRoles(roles)
    }

    const handleFieldTypeSelect: ChangeEventHandler<HTMLSelectElement> = (e) => {
        if (isFieldType(e.target.value)) setFieldType(e.target.value)
    }

    const addOption = () => {
        const updatedOptions = _.cloneDeep(options)
        updatedOptions.push({ EN: '', AR: '' })
        setOptions(updatedOptions)
    }

    const updateOptionField = (index: number, val: string, language: Language) => {
        const updatedOptions = _.cloneDeep(options)
        updatedOptions[index][language] = val
        setOptions(updatedOptions)
    }

    const moveOption = (currIndex: number, newIndex: number) => {
        if (newIndex >= 0 && newIndex < options.length) {
            const updatedOptions = _.cloneDeep(options)
            const removedChoice = updatedOptions.splice(currIndex, 1)[0]
            updatedOptions.splice(newIndex, 0, removedChoice)
            setOptions(updatedOptions)
        }
    }

    const deleteOption = (index: number) => {
        const updatedOptions = _.cloneDeep(options)
        updatedOptions.splice(index, 1)
        setOptions(updatedOptions)
    }

    const generateOptions = () => {
        const choices = []
        for (let i = 0; i < options.length; i++) {
            choices.push(
                <div>
                    <span>{`${translations.components.swal.field.option} ${i + 1}`}</span>
                    <LanguageInput
                        fieldKey={`lang-option-${i}`}
                        fieldValues={{ EN: options[i].EN, AR: options[i].AR }}
                        handleFieldChange={(value, language) => {
                            updateOptionField(i, value, language)
                        }}
                        onDelete={() => {
                            deleteOption(i)
                        }}
                        onUpPressed={() => {
                            moveOption(i, i - 1)
                        }}
                        onDownPressed={() => {
                            moveOption(i, i + 1)
                        }}
                    />
                </div>
            )
        }
        return <div>{choices}</div>
    }

    const updateDisplayName = (value: string, language: Language) => {
        const updatedDisplayName = _.clone(displayName)
        updatedDisplayName[language] = value

        setDisplayName(updatedDisplayName)
    }

    const updateSignatureDocument = async (file: File) => {
        const filename = `${randomAlphaNumericString(32)}.png`
        setIsUploading(true)
        try {
            await trackPromise(
                errorWrap(async () => {
                    await uploadSignatureDocument(filename, file)
                    setDocumentURL(`${PUBLIC_CLOUDFRONT_URL}/${filename}`)
                })
            )
        } finally {
            setIsUploading(false)
        }
    }

    const generateFields = () => {
        switch (fieldType) {
            case FieldType.STRING:
            case FieldType.MULTILINE_STRING:
            case FieldType.DATE:
            case FieldType.PHONE:
            case FieldType.NUMBER:
            case FieldType.FILE:
            case FieldType.AUDIO:
            case FieldType.MAP:
            case FieldType.PHOTO:
            case FieldType.FIELD_GROUP:
                return (
                    <div className="create-field-div">
                        <span>{translations.components.swal.field.question}</span>
                        <LanguageInput
                            fieldKey={`lang-input-${fieldType}`}
                            fieldValues={displayName}
                            handleFieldChange={(value, language) => {
                                updateDisplayName(value, language)
                            }}
                        />
                    </div>
                )
            case FieldType.RADIO_BUTTON:
                return (
                    <div className="create-field-div">
                        <span>{translations.components.swal.field.question}</span>
                        <LanguageInput
                            fieldKey={`lang-input-${fieldType}`}
                            fieldValues={displayName}
                            handleFieldChange={(value, language) => {
                                updateDisplayName(value, language)
                            }}
                        />
                        <Button className="add-option-button" onClick={addOption}>
                            {translations.components.swal.field.buttons.addChoice}
                        </Button>
                        {generateOptions()}
                    </div>
                )
            case FieldType.DIVIDER:
                return (
                    <div className="create-field-div">
                        <span>{translations.components.swal.field.dividerTitle}</span>
                        <LanguageInput
                            fieldKey={`lang-input-${fieldType}`}
                            fieldValues={displayName}
                            handleFieldChange={(value, language) => {
                                updateDisplayName(value, language)
                            }}
                        />
                    </div>
                )
            case FieldType.HEADER:
                return (
                    <div className="create-field-div">
                        <span>{translations.components.swal.field.headerTitle}</span>
                        <LanguageInput
                            fieldKey={`lang-input-${fieldType}`}
                            fieldValues={displayName}
                            handleFieldChange={(value, language) => {
                                updateDisplayName(value, language)
                            }}
                        />
                    </div>
                )
            case FieldType.SIGNATURE:
                return (
                    <div className="create-field-div">
                        <span>{translations.components.swal.field.dividerTitle}</span>
                        <LanguageInput
                            fieldKey={`lang-input-${fieldType}`}
                            fieldValues={displayName}
                            handleFieldChange={(value, language) => {
                                updateDisplayName(value, language)
                            }}
                        />
                        <p>Document to Sign:</p>
                        <FileUploadButton
                            fileTypes="application/pdf"
                            onSelectFile={updateSignatureDocument}
                            style={{ isLoading: isUploading, isDisabled: !!documentURL }}
                        >
                            {documentURL
                                ? 'Document uploaded'
                                : translations.components.button.uploadDocument}
                        </FileUploadButton>
                    </div>
                )
            default:
                return <p>This field is not yet supported</p>
        }
    }

    const generateFieldDropdownOptions = () => {
        const fieldDropdownOptions: ReactNode[] = []
        Object.values(FieldType).forEach((value) => {
            if (!canFieldBeAddedToStep(value)) return

            if (canAddFieldGroup || value !== FieldType.FIELD_GROUP) {
                fieldDropdownOptions.push(
                    <option value={value} className="create-field-option">
                        {getFieldName(value)}
                    </option>
                )
            }
        })

        return fieldDropdownOptions
    }

    const saveNewField = () => {
        const formattedOptions = options.map((option, index) => ({
            Index: index,
            Question: option,
            IsHidden: false,
        }))

        const newFieldData = {
            fieldType,
            isVisibleOnDashboard,
            displayName,
            options: formattedOptions,
            readableGroups: selectedRoles,
            writableGroups: selectedRoles,
            subFields: [],
            additionalData: undefined as AdditionalFieldData,
        }

        if (documentURL) {
            newFieldData.additionalData = {
                defaultDocumentURL: {
                    EN: documentURL,
                    AR: documentURL,
                },
            }
        }

        errorWrap(
            () => {
                validateField(newFieldData)
            },
            () => {
                onAddNewField(newFieldData)
                onModalClose()
                clearState()
            }
        )
    }

    const handleIsVisibleOnDashboard = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsVisibleOnDashboard(event.target.checked)
    }

    const clearState = () => {
        setSelectedRoles([ADMIN_ID])
        setIsVisibleOnDashboard(false)
        setDisplayName({ EN: '', AR: '' })
        setOptions([])
        setFieldType(FieldType.STRING)
        setDocumentURL('')
    }

    const onDiscard = () => {
        clearState()
        onModalClose()
    }

    return (
        <Modal open={isOpen} onClose={onModalClose} className="create-field-modal">
            <div className="create-field-modal-wrapper">
                <span className="create-field-title1">
                    {translations.components.swal.field.createFieldTitle}
                </span>
                <span className="create-field-title2">
                    {translations.components.swal.field.fieldSettings}
                </span>
                <div className="create-field-title3">
                    <div>
                        <FormControl>
                            <span>{translations.components.swal.field.fieldType}</span>
                            <NativeSelect
                                id="create-field-type-dropdown"
                                onChange={handleFieldTypeSelect}
                                defaultValue={fieldType}
                                input={<BootstrapInput />}
                            >
                                {generateFieldDropdownOptions()}
                            </NativeSelect>
                        </FormControl>
                    </div>
                    <div>
                        <MultiSelectField
                            title={translations.components.swal.field.clearance}
                            langKey={selectedLang}
                            options={allRoles}
                            selectedOptions={selectedRoles}
                            onChange={onRolesChange}
                            isDisabled={false}
                            disabledOptions={[ADMIN_ID]}
                        />
                    </div>
                    <span>{translations.components.swal.field.customization}</span>
                    <div>
                        <Checkbox
                            size="medium"
                            checked={isVisibleOnDashboard}
                            onChange={handleIsVisibleOnDashboard}
                        />
                        <span>{translations.components.swal.field.showOnDashBoard}</span>
                    </div>
                </div>
                <span className="create-field-title3">
                    {translations.components.swal.field.field}{' '}
                </span>
                {generateFields()}
                <div
                    style={{
                        float: 'right',
                        paddingBottom: '10px',
                    }}
                >
                    <Button
                        onClick={saveNewField}
                        className="save-field-button"
                        disabled={isUploading}
                    >
                        {translations.components.swal.field.buttons.save}
                    </Button>
                    <Button onClick={onDiscard} className="discard-field-button">
                        {translations.components.swal.field.buttons.discard}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default CreateFieldModal
