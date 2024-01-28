import './CreatePatientModal.scss'

import { BasePatient } from '@3dp4me/types'
import { Unsaved } from '@3dp4me/types/dist/src/utils/unsaved'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { useTranslations } from '../../hooks/useTranslations'

export interface CreatePatientModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (patient: Unsaved<BasePatient>) => void
    onSaveAndEdit: (patient: Unsaved<BasePatient>) => void
}

const CreatePatientModal = ({
    isOpen,
    onClose,
    onSave,
    onSaveAndEdit,
}: CreatePatientModalProps) => {
    const translations = useTranslations()[0]
    const [firstName, setFirstName] = useState('')
    const [fathersName, setFathersName] = useState('')
    const [grandfathersName, setGrandfathersName] = useState('')
    const [familyName, setFamilyName] = useState('')

    const onSavePatient = (isSaveAndEdit: boolean) => {
        const patientData = {
            firstName,
            fathersName,
            grandfathersName,
            familyName,
        }

        if (isSaveAndEdit) onSaveAndEdit(patientData)
        else onSave(patientData)

        onClose()
    }

    const clearState = () => {
        setFirstName('')
        setFathersName('')
        setGrandfathersName('')
        setFamilyName('')
    }

    const onDiscard = () => {
        clearState()
        onClose()
    }

    return (
        <Modal className="create-patient-modal" open={isOpen} onClose={onClose}>
            <div className="create-patient-modal-wrapper">
                <h2 className="create-patient-header">
                    {translations.components.swal.createPatient.title}
                </h2>
                <div className="create-patient-input-wrapper">
                    <span>{translations.components.swal.createPatient.firstName}</span>
                    <TextField
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="create-patient-text-field"
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                    <span>{translations.components.swal.createPatient.middleName}</span>
                    <div className="create-patient-row">
                        <TextField
                            value={fathersName}
                            onChange={(e) => setFathersName(e.target.value)}
                            className="create-patient-text-field"
                            size="small"
                            variant="outlined"
                            fullWidth
                        />
                        <TextField
                            value={grandfathersName}
                            onChange={(e) => setGrandfathersName(e.target.value)}
                            className="create-patient-text-field"
                            size="small"
                            variant="outlined"
                            fullWidth
                        />
                    </div>
                    <span>{translations.components.swal.createPatient.lastName}</span>
                    <TextField
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                        className="create-patient-text-field"
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                </div>
                <div className="create-patient-button-container">
                    <div>
                        <Button
                            className="create-patient-button create-patient-edit-button"
                            onClick={() => onSavePatient(true)}
                        >
                            {translations.components.swal.createPatient.buttons.edit}
                        </Button>
                    </div>
                    <div className="close-delete-button-container">
                        <Button
                            className="create-patient-button create-patient-close-button"
                            onClick={() => onSavePatient(false)}
                        >
                            {translations.components.swal.createPatient.buttons.noEdit}
                        </Button>

                        <Button
                            className="create-patient-button create-patient-delete-button"
                            onClick={onDiscard}
                        >
                            {translations.components.swal.createPatient.buttons.discard}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

CreatePatientModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onSaveAndEdit: PropTypes.func.isRequired,
}

export default CreatePatientModal
