import './EditStepModal.scss'

import { Language, Step, TranslatedString } from '@3dp4me/types'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Modal from '@mui/material/Modal'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import swal from 'sweetalert'

import { useErrorWrap } from '../../hooks/useErrorWrap'
import { useTranslations } from '../../hooks/useTranslations'
import { ADMIN_ID, ERR_LANGUAGE_VALIDATION_FAILED } from '../../utils/constants'
import CustomSwitch from '../CustomSwitch/CustomSwitch'
import { FormOption } from '../Fields/FormOption'
import MultiSelectField from '../Fields/MultiSelectField'
import LanguageInput from '../LanguageInput/LanguageInput'

export interface EditStepModalProps {
    isOpen: boolean
    onModalClose: () => void
    allRoles: FormOption[]
    initialData: Step
    onEditStep: (step: Step) => void
}

const EditStepModal = ({
    isOpen,
    onModalClose,
    allRoles,
    initialData,
    onEditStep,
}: EditStepModalProps) => {
    const [translations, selectedLang] = useTranslations()
    const [selectedRoles, setSelectedRoles] = useState([ADMIN_ID])
    const [displayName, setDisplayName] = useState<TranslatedString>({ EN: '', AR: '' })
    const [isHidden, setIsHidden] = useState(false)

    const errorWrap = useErrorWrap()

    useEffect(() => {
        setDisplayName(initialData.displayName)
        setIsHidden(initialData.isHidden)

        const initialRoles = initialData.readableGroups

        // Automatically select the admin role
        if (initialRoles.indexOf(ADMIN_ID) === -1) {
            initialRoles.push(ADMIN_ID)
        }

        setSelectedRoles(initialRoles)
    }, [initialData, isOpen])

    const onRolesChange = (id: string, roles: string[]) => {
        setSelectedRoles(roles)
    }
    const updateDisplayName = (value: string, language: Language) => {
        const updatedDisplayName = _.clone(displayName)
        updatedDisplayName[language] = value

        setDisplayName(updatedDisplayName)
    }

    const validateStep = (stepData: Step) => {
        if (stepData.displayName.EN.trim() === '' || stepData.displayName.AR.trim() === '') {
            throw new Error(ERR_LANGUAGE_VALIDATION_FAILED)
        }
    }

    const generateFields = () => (
        <div className="create-step-modal-field-container">
            <span>{translations.components.swal.step.createStepHeader}</span>
            <LanguageInput
                fieldKey="displayName"
                fieldValues={displayName}
                handleFieldChange={(value, language) => {
                    updateDisplayName(value, language)
                }}
            />
        </div>
    )

    const clearState = () => {
        setSelectedRoles([ADMIN_ID])
        setDisplayName({ EN: '', AR: '' })
    }

    const onDiscard = () => {
        clearState()
        onModalClose()
    }

    const getUpdatedData = () => {
        const editStepData = {
            ...initialData,
            readableGroups: selectedRoles,
            writableGroups: selectedRoles,
            displayName,
            isHidden,
        }

        return editStepData
    }

    const saveField = () => {
        const newFieldData = getUpdatedData()
        updateStep(newFieldData)
    }

    const updateStep = (editStepData: Step) => {
        errorWrap(
            () => {
                validateStep(editStepData)
            },
            () => {
                onEditStep(editStepData)
                onModalClose()
                clearState()
            }
        )
    }

    const onDelete = () => {
        swal({
            title: translations.components.modal.deleteTitle,
            text: translations.components.modal.deleteStepConfirmation,
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
                updateStep(deletedFieldData)
            }
        })
    }

    const handleHiddenFieldSwitchChange = (isChecked: boolean) => {
        // added the "not" operator because when the switch is on, we want isHidden to be false
        setIsHidden(!isChecked)
    }

    const generateHiddenFieldSwitch = () => (
        <FormControlLabel
            // TODO: Make sure this doesn't appear
            label={'is-hidden'}
            className="hidden-field-switch"
            control={
                <CustomSwitch checked={!isHidden} setChecked={handleHiddenFieldSwitchChange} />
            }
        />
    )

    return (
        <Modal open={isOpen} onClose={onModalClose} className="edit-step-modal">
            <div className="edit-step-modal-wrapper">
                <div className="edit-step-modal-title-div">
                    <h2 className="edit-step-modal-title">
                        {translations.components.swal.step.editStepHeader}
                    </h2>
                    {generateHiddenFieldSwitch()}
                </div>

                <div className="edit-step-modal-text">{generateFields()}</div>

                <div className="edit-step-multiselect">
                    <MultiSelectField
                        title={translations.components.swal.step.clearance}
                        langKey={selectedLang}
                        options={allRoles}
                        selectedOptions={selectedRoles}
                        onChange={onRolesChange}
                        isDisabled={false}
                        disabledOptions={[ADMIN_ID]}
                    />
                </div>

                <div
                    style={{
                        float: 'right',
                        paddingBottom: '10px',
                    }}
                >
                    <Button onClick={saveField} className="save-step-button">
                        {translations.components.swal.step.buttons.save}
                    </Button>
                    <Button onClick={onDiscard} className="discard-step-button">
                        {translations.components.swal.step.buttons.discard}
                    </Button>
                    <Button onClick={onDelete} className="delete-field-button">
                        {translations.components.swal.field.buttons.delete}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default EditStepModal
