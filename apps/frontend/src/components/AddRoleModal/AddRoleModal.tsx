import './AddRoleModal.scss'

import { Language, Role } from '@3dp4me/types'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import { useState } from 'react'
import { trackPromise } from 'react-promise-tracker'

import { addRole } from '../../api/api'
import { useErrorWrap } from '../../hooks/useErrorWrap'
import { useTranslations } from '../../hooks/useTranslations'
import { ERR_ROLE_INPUT_VALIDATION_FAILED } from '../../utils/constants'
import TextArea from '../Fields/TextArea'
import TextField from '../Fields/TextField'

export interface AddRoleModalProps {
    isOpen: boolean
    onClose: () => void
    onRoleAdded: (role: Role) => void
}

const AddRoleModal = ({ isOpen, onClose, onRoleAdded }: AddRoleModalProps) => {
    const [role, setRole] = useState<Partial<Role>>({})
    const translations = useTranslations()[0]
    const errorWrap = useErrorWrap()

    const onSave = async () => {
        errorWrap(async () => {
            validateRole()
            const res = await trackPromise(addRole(role))
            onRoleAdded(res.result)
            onClose()
        })
    }

    const handleRoleUpdate = (
        key: 'roleName' | 'roleDescription',
        value: string,
        lang: Language
    ) => {
        setRole((prevState) => ({
            ...prevState,
            [key]: { ...prevState?.[key], [lang]: value },
        }))
    }

    const validateRole = () => {
        if (
            !role?.roleName ||
            !role?.roleDescription ||
            role?.roleName?.[Language.EN]?.trim() === '' ||
            role?.roleName?.[Language.AR]?.trim() === '' ||
            role?.roleDescription?.[Language.EN]?.trim() === '' ||
            role?.roleDescription?.[Language.AR]?.trim() === ''
        ) {
            throw new Error(ERR_ROLE_INPUT_VALIDATION_FAILED)
        }
    }

    return (
        <Modal open={isOpen} onClose={onClose} className="add-role-modal">
            <div className="add-role-modal-wrapper">
                <h2>{translations.roleManagement.addRole}</h2>
                <TextField
                    value={role?.roleName?.[Language.EN]}
                    className="text-field"
                    displayName={`${translations.roleManagement.roleName} (EN)`}
                    onChange={(key, value) => handleRoleUpdate(key, value, Language.EN)}
                    fieldId="roleName"
                />
                <TextField
                    value={role?.roleName?.[Language.AR]}
                    className="text-field"
                    displayName={`${translations.roleManagement.roleName} (AR)`}
                    onChange={(key, value) => handleRoleUpdate(key, value, Language.AR)}
                    fieldId="roleName"
                />
                <TextArea
                    value={role?.roleDescription?.[Language.EN]}
                    title={`${translations.roleManagement.roleDescription} (EN)`}
                    onChange={(key, value) => handleRoleUpdate(key, value, Language.EN)}
                    fieldId="roleDescription"
                    disabled={false}
                />
                <TextArea
                    value={role?.roleDescription?.[Language.AR]}
                    title={`${translations.roleManagement.roleDescription} (AR)`}
                    onChange={(key, value) => handleRoleUpdate(key, value, Language.AR)}
                    fieldId="roleDescription"
                    disabled={false}
                />

                <div>
                    <Button className="save-user-button" onClick={onSave}>
                        {translations.accountManagement.Save}
                    </Button>
                    <Button className="discard-user-button" onClick={onClose}>
                        {translations.accountManagement.Discard}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default AddRoleModal
