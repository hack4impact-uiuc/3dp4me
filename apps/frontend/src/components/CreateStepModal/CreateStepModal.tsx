import './CreateStepModal.scss'

import { BaseStep, Field, Language } from '@3dp4me/types'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import _ from 'lodash'
import { useState } from 'react'

import { useErrorWrap } from '../../hooks/useErrorWrap'
import { useTranslations } from '../../hooks/useTranslations'
import { ADMIN_ID, ERR_LANGUAGE_VALIDATION_FAILED } from '../../utils/constants'
import { FormOption } from '../Fields/FormOption'
import MultiSelectField from '../Fields/MultiSelectField'
import LanguageInput from '../LanguageInput/LanguageInput'

export interface CreateStepModalProps {
    isOpen: boolean
    onModalClose: () => void
    allRoles: FormOption[]
    onAddNewStep: (step: BaseStep) => void
}

const CreateStepModal = ({
    isOpen,
    onModalClose,
    allRoles,
    onAddNewStep,
}: CreateStepModalProps) => {
    const [translations, selectedLang] = useTranslations()
    const [selectedRoles, setSelectedRoles] = useState([ADMIN_ID])
    const [displayName, setDisplayName] = useState({ EN: '', AR: '' })

    const errorWrap = useErrorWrap()

    const onRolesChange = (id: string, roleIds: string[]) => {
        setSelectedRoles(roleIds)
    }
    const updateDisplayName = (value: string, language: Language) => {
        const updatedDisplayName = _.clone(displayName)
        updatedDisplayName[language] = value

        setDisplayName(updatedDisplayName)
    }

    const validateStep = (stepData: BaseStep) => {
        if (stepData.displayName.EN.trim() === '' || stepData.displayName.AR.trim() === '') {
            throw new Error(ERR_LANGUAGE_VALIDATION_FAILED)
        }
    }

    const generateFields = () => (
        <div className="create-step-modal-field-container">
            <span>{translations.components.swal.step.stepTitle}</span>
            <LanguageInput
                fieldValues={displayName}
                fieldKey="displayName"
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

    const saveNewStep = () => {
        const newStepData = {
            readableGroups: selectedRoles,
            writableGroups: selectedRoles,
            displayName,
            fields: [] as Field[],
        }

        errorWrap(
            () => {
                validateStep(newStepData)
            },
            () => {
                onAddNewStep(newStepData)
                onModalClose()
                clearState()
            }
        )
    }

    return (
        <Modal open={isOpen} onClose={onModalClose} className="create-step-modal">
            <div className="create-step-modal-wrapper">
                <h2 className="create-step-modal-title">
                    {translations.components.swal.step.createStepHeader}
                </h2>
                <div className="create-step-modal-text">{generateFields()}</div>

                <div className="create-step-multiselect">
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

                <div>
                    <Button onClick={saveNewStep} className="save-step-button">
                        {translations.components.swal.step.buttons.save}
                    </Button>
                    <Button onClick={onDiscard} className="discard-step-button">
                        {translations.components.swal.step.buttons.discard}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default CreateStepModal
