import './EditFieldModal.scss'

import { Field, FieldType, Language, TranslatedString, Unsaved } from '@3dp4me/types'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputBase from '@mui/material/InputBase'
import Modal from '@mui/material/Modal'
import NativeSelect from '@mui/material/NativeSelect'
import withStyles from '@mui/styles/withStyles'
import _ from 'lodash'
import React, { ChangeEvent, ReactNode, useEffect, useState } from 'react'
import swal from 'sweetalert'

import { useErrorWrap } from '../../hooks/useErrorWrap'
import { useTranslations } from '../../hooks/useTranslations'
import { ADMIN_ID } from '../../utils/constants'
import { validateField } from '../../utils/fields'
import CustomSwitch from '../CustomSwitch/CustomSwitch'
import { FormOption } from '../Fields/FormOption'
import MultiSelectField from '../Fields/MultiSelectField'
import LanguageInput from '../LanguageInput/LanguageInput'

export interface EditFieldModalProps {
    isOpen: boolean
    initialData: Field
    onModalClose: () => void
    allRoles: FormOption[]
    onEditField: (field: Unsaved<Field>) => void
}

const EditFieldModal = ({
    isOpen,
    initialData,
    onModalClose,
    allRoles,
    onEditField,
}: EditFieldModalProps) => {
    const [translations, selectedLang] = useTranslations()
    const [fieldType, setFieldType] = useState(FieldType.STRING)
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])
    const [isVisibleOnDashboard, setIsVisibleOnDashboard] = useState(false)
    const [displayName, setDisplayName] = useState({ EN: '', AR: '' })
    const [options, setOptions] = useState<TranslatedString[]>([])
    const [isHidden, setIsHidden] = useState(false)

    const errorWrap = useErrorWrap()

    useEffect(() => {
        setFieldType(initialData.fieldType)
        setIsVisibleOnDashboard(initialData.isVisibleOnDashboard)
        setDisplayName(initialData.displayName)
        setIsHidden(initialData.isHidden)

        const initialRoles = initialData.readableGroups

        // Automatically select the admin role
        if (initialRoles.indexOf(ADMIN_ID) === -1) {
            initialRoles.push(ADMIN_ID)
        }

        setSelectedRoles(initialRoles)

        const formattedOptions = initialData.options.map((option) => option.Question)

        setOptions(formattedOptions)
    }, [initialData, isOpen])

    const BootstrapInput = withStyles((theme) => ({
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
            transition: theme.transitions.create(['border-color', 'box-shadow']),
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
    }))(InputBase)

    const onRolesChange = (id: string, roles: string[]) => {
        setSelectedRoles(roles)
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
                        fieldKey="NewOption"
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
            case FieldType.SIGNATURE:
                return (
                    <div className="edit-field-div">
                        <span>{translations.components.swal.field.question}</span>
                        <LanguageInput
                            fieldKey="FieldTitle"
                            fieldValues={displayName}
                            handleFieldChange={(value, language) => {
                                updateDisplayName(value, language)
                            }}
                        />
                    </div>
                )
            case FieldType.RADIO_BUTTON:
                return (
                    <div className="edit-field-div">
                        <span>{translations.components.swal.field.question}</span>
                        <LanguageInput
                            fieldKey="Field Question"
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
                    <div className="edit-field-div">
                        <span>{translations.components.swal.field.dividerTitle}</span>
                        <LanguageInput
                            fieldKey="Field Question"
                            fieldValues={displayName}
                            handleFieldChange={(value, language) => {
                                updateDisplayName(value, language)
                            }}
                        />
                    </div>
                )
            case FieldType.HEADER:
                return (
                    <div className="edit-field-div">
                        <span>{translations.components.swal.field.headerTitle}</span>
                        <LanguageInput
                            fieldKey="Field Question"
                            fieldValues={displayName}
                            handleFieldChange={(value, language) => {
                                updateDisplayName(value, language)
                            }}
                        />
                    </div>
                )
            default:
                return <p>This field is not yet supported</p>
        }
    }

    const generateFieldDropdownOptions = () => {
        const fieldDropdownOptions: ReactNode[] = []
        Object.values(FieldType).forEach((value) => {
            fieldDropdownOptions.push(
                <option key={value} value={value} className="edit-field-option">
                    {value}
                </option>
            )
        })

        return fieldDropdownOptions
    }

    const getUpdatedData = () => {
        const formattedOptions = options.map((option, index) => ({
            Index: index,
            Question: option,
            IsHidden: false,
        }))

        const updatedFieldData: Unsaved<Field> = {
            ...initialData,
            fieldType,
            isVisibleOnDashboard,
            displayName,
            options: formattedOptions,
            readableGroups: selectedRoles,
            writableGroups: selectedRoles,
            subFields: [],
            isHidden,
        }

        // Add sub fields if they exist
        if (initialData.subFields) {
            updatedFieldData.subFields = initialData.subFields
        }

        return updatedFieldData
    }

    const saveField = () => {
        const newFieldData = getUpdatedData()
        editField(newFieldData)
    }

    const editField = (newFieldData: Unsaved<Field>) => {
        errorWrap(
            () => {
                validateField(newFieldData)
            },
            () => {
                onEditField(newFieldData)
                onModalClose()
            }
        )
    }

    const handleIsVisibleOnDashboard = (event: ChangeEvent<HTMLInputElement>) => {
        setIsVisibleOnDashboard(event.target.checked)
    }

    const onDiscard = () => {
        onModalClose()
    }

    const onDelete = () => {
        swal({
            title: translations.components.modal.deleteTitle,
            text: translations.components.modal.deleteFieldConfirmation,
            icon: 'warning',
            buttons: [
                translations.components.button.discard.cancelButton,
                translations.components.button.discard.confirmButton,
            ],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                const deletedFieldData = getUpdatedData()
                deletedFieldData.isDeleted = true
                editField(deletedFieldData)
            }
        })
    }

    const handleHiddenFieldSwitchChange = (isChecked: boolean) => {
        // added the "not" operator because when the switch is on, we want isHidden to be false
        setIsHidden(!isChecked)
    }

    const generateHiddenFieldSwitch = () => (
        <FormControlLabel
            label=""
            className="hidden-field-switch"
            control={
                <CustomSwitch checked={!isHidden} setChecked={handleHiddenFieldSwitchChange} />
            }
        />
    )

    return (
        <Modal open={isOpen} onClose={onModalClose} className="edit-field-modal">
            <div className="edit-field-modal-wrapper">
                <div
                    style={{
                        float: 'right',
                        paddingBottom: '10px',
                    }}
                >
                    <span className="edit-field-title1">
                        {translations.components.swal.field.editFieldTitle}
                    </span>
                    {generateHiddenFieldSwitch()}
                    <br />
                    <br />
                    <span className="edit-field-title2">
                        {translations.components.swal.field.fieldSettings}
                    </span>
                </div>

                <div className="edit-field-title3">
                    <div>
                        <FormControl>
                            <span>{translations.components.swal.field.fieldType}</span>
                            <NativeSelect
                                id="edit-field-type-dropdown"
                                // TODO: Check that this still works
                                // MenuProps={{
                                //     style: { zIndex: 35001 }, // for keeping this component on the top layer
                                // }}
                                defaultValue={fieldType}
                                input={<BootstrapInput />}
                                disabled
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
                <span className="edit-field-title3">
                    {translations.components.swal.field.field}{' '}
                </span>
                {generateFields()}
                <div
                    style={{
                        float: 'right',
                        paddingBottom: '10px',
                    }}
                >
                    <Button onClick={saveField} className="save-field-button">
                        {translations.components.swal.field.buttons.save}
                    </Button>
                    <Button onClick={onDiscard} className="discard-field-button">
                        {translations.components.swal.field.buttons.discard}
                    </Button>
                    <Button onClick={onDelete} className="delete-field-button">
                        {translations.components.swal.field.buttons.delete}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default EditFieldModal
