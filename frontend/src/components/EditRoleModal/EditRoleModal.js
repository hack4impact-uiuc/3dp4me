// Disabled because we need the role updates to happen sequentially
/* eslint-disable no-await-in-loop */
// More readable without this
/* eslint-disable no-lonely-if */
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import {
    Modal,
    FormControl,
    InputLabel,
    Select,
    Button,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { trackPromise } from 'react-promise-tracker';

import { useErrorWrap } from '../../hooks/useErrorWrap';
import TextField from '../Fields/TextField';
import MultiSelectField from '../Fields/MultiSelectField';
import { ACCESS_LEVELS } from '../../utils/constants';
import './EditRoleModal.scss';
import { useTranslations } from '../../hooks/useTranslations';
import {
    removeUserRole,
    setUserAccess,
    addUserRole,
    deleteUser,
} from '../../api/api';

const EditRoleModal = ({
    isOpen,
    onUserEdited,
    onUserDeleted,
    onClose,
    userInfo,
    allRoles,
}) => {
    const [translations, selectedLang] = useTranslations();
    const [userData, setUserData] = useState(_.cloneDeep(userInfo));
    const errorWrap = useErrorWrap();

    useEffect(() => {
        setUserData(_.cloneDeep(userInfo));
    }, [userInfo]);

    const onRolesChange = (id, roles) => {
        setUserData({ ...userData, roles });
    };

    const onAccessChange = (event) => {
        setUserData({ ...userData, accessLevel: event.target.value });
    };

    const onSave = async () => {
        // Update users roles
        for (let i = 0; i < allRoles.length; i++) {
            const role = allRoles[i];

            // If user has role
            if (userData.roles.find((r) => r === role._id)) {
                // If user didn't have role before, make request to backend
                if (!userInfo.roles.find((r) => r === role._id)) {
                    await errorWrap(async () =>
                        trackPromise(addUserRole(userData.userId, role._id)),
                    );
                }
            } else {
                // If user did have role before, make request to backend
                if (userInfo.roles.find((r) => r === role._id)) {
                    await errorWrap(async () =>
                        trackPromise(removeUserRole(userData.userId, role._id)),
                    );
                }
            }
        }

        // Update user access level
        await errorWrap(async () =>
            trackPromise(setUserAccess(userData.userId, userData.accessLevel)),
        );

        // Close modal and update local data
        onClose();
        onUserEdited(userData.userId, userData.accessLevel, userData.roles);
    };

    const onDelete = async () => {
        await errorWrap(async () => trackPromise(deleteUser(userData?.userId)));
        onClose();
        onUserDeleted(userData.userId);
    };

    const renderAccessDropdown = () => {
        return (
            <Select
                native
                value={userData?.accessLevel}
                onChange={onAccessChange}
            >
                <option value={ACCESS_LEVELS.GRANTED}>
                    {translations.accountManagement.Approved}
                </option>
                <option value={ACCESS_LEVELS.REVOKED}>
                    {translations.accountManagement.Revoked}
                </option>
                <option value={ACCESS_LEVELS.PENDING}>
                    {translations.accountManagement.Pending}
                </option>
            </Select>
        );
    };

    return (
        <Modal open={isOpen} onClose={onClose} className="edit-role-modal">
            <div className="edit-role-modal-wrapper">
                <h2>{translations.accountManagement.editAccount}</h2>
                <TextField
                    className="text-field"
                    displayName={translations.accountManagement.username}
                    type="text"
                    isDisabled
                    value={userData?.userName}
                />
                <TextField
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
                <FormControl>
                    <InputLabel>
                        {translations.accountManagement.access}
                    </InputLabel>
                    {renderAccessDropdown()}
                </FormControl>
                <div>
                    <Button className="delete-user-button" onClick={onDelete}>
                        {translations.accountManagement.deleteUser}
                    </Button>
                </div>
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
    );
};

EditRoleModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUserEdited: PropTypes.func.isRequired,
    onUserDeleted: PropTypes.func.isRequired,
    allRoles: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string,
            IsHidden: PropTypes.bool,
            Question: PropTypes.shape({
                EN: PropTypes.string,
                AR: PropTypes.string,
            }),
        }),
    ),
    userInfo: PropTypes.shape({
        userId: PropTypes.string,
        userName: PropTypes.string,
        userEmail: PropTypes.string,
        roles: PropTypes.arrayOf(PropTypes.string),
    }),
};

export default EditRoleModal;
