// Disabled because we need the role updates to happen sequentially
/* eslint-disable no-await-in-loop */
// More readable without this
/* eslint-disable no-lonely-if */
import './EditRoleModal.scss'

import { AccessLevel, Nullish } from '@3dp4me/types'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Modal from '@mui/material/Modal'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { trackPromise } from 'react-promise-tracker'
import swal from 'sweetalert'

import { addUserRole, deleteUser, removeUserRole, setUserAccess } from '../../api/api'
import { useErrorWrap } from '../../hooks/useErrorWrap'
import { useTranslations } from '../../hooks/useTranslations'
import { isAccessLevel } from '../../utils/access'
import { FormOption } from '../Fields/FormOption'
import MultiSelectField from '../Fields/MultiSelectField'
import TextField from '../Fields/TextField'

export interface RoleModalUser {
    accessLevel: AccessLevel
    userId: Nullish<string>
    userName: string
    userEmail: string
    roles: string[]
}

export interface EditRoleModalProps {
    isOpen: boolean
    onUserEdited: (userId: string, accessLevel: AccessLevel, roles: string[]) => void
    onUserDeleted: (username: string) => void
    onClose: () => void
    userInfo: RoleModalUser
    allRoles: FormOption[]
}

const EditRoleModal = ({
    isOpen,
    onUserEdited,
    onUserDeleted,
    onClose,
    userInfo,
    allRoles,
}: EditRoleModalProps) => {
    const [translations, selectedLang] = useTranslations()
    const [userData, setUserData] = useState(_.cloneDeep(userInfo))
    const errorWrap = useErrorWrap()

    useEffect(() => {
        setUserData(_.cloneDeep(userInfo))
    }, [userInfo])

    const onRolesChange = (id: string, roles: string[]) => {
        setUserData({ ...userData, roles })
    }

    const onAccessChange = (event: SelectChangeEvent<AccessLevel>) => {
        if (isAccessLevel(event.target.value))
            setUserData({ ...userData, accessLevel: event.target.value })
    }

    const onSave = async () => {
        // Update users roles
        for (let i = 0; i < allRoles.length; i++) {
            const role = allRoles[i]
            // If user has role
            if (userData.roles.find((r) => r === role._id)) {
                // If user didn't have role before, make request to backend
                if (!userInfo.roles.find((r) => r === role._id)) {
                    await errorWrap(async () => {
                        if (userData.userId) trackPromise(addUserRole(userData.userId, role._id))
                    })
                }
            } else {
                // If user did have role before, make request to backend
                if (userInfo.roles.find((r) => r === role._id)) {
                    await errorWrap(async () => {
                        if (userData.userId) trackPromise(removeUserRole(userData.userId, role._id))
                    })
                }
            }
        }

        // Update user access level
        await errorWrap(async () => {
            if (userData.userId) trackPromise(setUserAccess(userData.userId, userData.accessLevel))
        })

        // Close modal and update local data
        onClose()
        if (userData.userId) onUserEdited(userData.userId, userData.accessLevel, userData.roles)
    }

    const onDelete = async () => {
        swal({
            title: translations.components.modal.deleteTitle,
            text: translations.components.modal.deleteUserConfirmation,
            icon: 'warning',
            buttons: [
                translations.components.button.discard.cancelButton,
                translations.components.button.discard.confirmButton,
            ],
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                await errorWrap(async () => {
                    if (userData.userId) trackPromise(deleteUser(userData?.userId))
                })
                onClose()

                if (userData.userId) onUserDeleted(userData.userId)
            }
        })
    }

    const renderAccessDropdown = () => (
        <Select
            native
            value={userData?.accessLevel}
            onChange={onAccessChange}
            className="access-dropdown"
        >
            <option value={AccessLevel.GRANTED}>{translations.accountManagement.Approved}</option>
            <option value={AccessLevel.REVOKED}>{translations.accountManagement.Revoked}</option>
            <option value={AccessLevel.PENDING}>{translations.accountManagement.Pending}</option>
        </Select>
    )

    return (
        <Modal open={isOpen} onClose={onClose} className="edit-role-modal">
            <div className="edit-role-modal-wrapper">
                <h2>{translations.accountManagement.editAccount}</h2>
                <TextField
                    fieldId="username"
                    className="text-field"
                    displayName={translations.accountManagement.username}
                    type="text"
                    isDisabled
                    value={userData?.userName}
                />
                <TextField
                    fieldId="email"
                    className="text-field"
                    displayName={translations.accountManagement.email}
                    type="text"
                    isDisabled
                    value={userData?.userEmail}
                />
                <MultiSelectField
                    title="Roles"
                    langKey={selectedLang}
                    options={allRoles}
                    selectedOptions={userData?.roles}
                    onChange={onRolesChange}
                    isDisabled={false}
                />
                <FormControl variant="standard">
                    <InputLabel className="access-label">
                        {translations.accountManagement.Access}
                    </InputLabel>
                    {renderAccessDropdown()}
                </FormControl>
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
                            {translations.accountManagement.deleteUser}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default EditRoleModal
