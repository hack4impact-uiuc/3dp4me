import './ManageRoleModal.scss'

import { Nullish, Role } from '@3dp4me/types'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { trackPromise } from 'react-promise-tracker'
import swal from 'sweetalert'

import { deleteRole, editRole } from '../../api/api'
import { useErrorWrap } from '../../hooks/useErrorWrap'
import { useTranslations } from '../../hooks/useTranslations'
import { ERR_ROLE_INPUT_VALIDATION_FAILED, ERR_ROLE_IS_IMMUTABLE } from '../../utils/constants'
import TextArea from '../Fields/TextArea'
import TextField from '../Fields/TextField'

export interface ManageRoleModalProps {
    isOpen: boolean
    onClose: () => void
    onRoleDeleted: (roleId: string) => void
    onRoleEdited: (roleId: string, data: Role) => void
    roleInfo: Role
}

const ManageRoleModal = ({
    isOpen,
    onClose,
    onRoleDeleted,
    onRoleEdited,
    roleInfo,
}: ManageRoleModalProps) => {
    const [translations, selectedLang] = useTranslations()
    const [role, setRole] = useState<Nullish<Role>>(null)
    const errorWrap = useErrorWrap()

    useEffect(() => {
        setRole(_.cloneDeep(roleInfo))
    }, [roleInfo])

    const onDelete = async () => {
        swal({
            title: translations.components.modal.deleteTitle,
            text: translations.roleManagement.warning,
            icon: 'warning',
            buttons: [
                translations.components.button.discard.cancelButton,
                translations.components.button.discard.confirmButton,
            ],
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                errorWrap(async () => {
                    if (roleInfo?.isMutable) {
                        await errorWrap(async () => trackPromise(deleteRole(roleInfo?._id)))
                        onRoleDeleted(roleInfo?._id)
                        onClose()
                    } else {
                        throw new Error(ERR_ROLE_IS_IMMUTABLE)
                    }
                })
            }
        })
    }

    const validateRole = () => {
        if (
            role?.roleName[selectedLang].trim() === '' ||
            role?.roleDescription[selectedLang].trim() === ''
        ) {
            throw new Error(ERR_ROLE_INPUT_VALIDATION_FAILED)
        }
    }

    const onSave = async () => {
        if (!role) return

        errorWrap(async () => {
            validateRole()
            if (roleInfo?.isMutable) {
                await errorWrap(async () => trackPromise(editRole(roleInfo?._id, role)))
                onRoleEdited(roleInfo?._id, role)
                onClose()
            } else {
                throw new Error(ERR_ROLE_IS_IMMUTABLE)
            }
        })
    }

    const onRoleChange = async (fieldId: 'roleName' | 'roleDescription', value: string) => {
        setRole((prevState) => {
            if (!prevState) {
                return prevState
            }

            return {
                ...prevState,
                [fieldId]: { ...prevState?.[fieldId], [selectedLang]: value },
            }
        })
    }

    return (
        <Modal open={isOpen} onClose={onClose} className="manage-role-modal">
            <div className="manage-role-modal-wrapper">
                <h2>{translations.roleManagement.manageRole}</h2>
                <TextField
                    className="text-field"
                    displayName={translations.roleManagement.roleName}
                    fieldId="roleName"
                    type="text"
                    isDisabled={!role?.isMutable}
                    value={role?.roleName?.[selectedLang]}
                    onChange={onRoleChange}
                />
                <TextArea
                    title={translations.roleManagement.roleDescription}
                    disabled={!role?.isMutable}
                    fieldId="roleDescription"
                    value={role?.roleDescription?.[selectedLang]}
                    onChange={onRoleChange}
                />
                <p>{translations.roleManagement.warning}</p>

                <div className="button-div">
                    <div>
                        <Button className="save-user-button" onClick={onSave}>
                            {translations.accountManagement.Save}
                        </Button>
                        <Button className="discard-user-button" onClick={onClose}>
                            {translations.accountManagement.Discard}
                        </Button>
                    </div>

                    <div>
                        <Button className="delete-user-button" onClick={onDelete}>
                            {translations.roleManagement.deleteRole}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ManageRoleModal
