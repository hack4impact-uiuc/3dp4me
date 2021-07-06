// Disabled because we need the role updates to happen sequentially
/* eslint-disable no-await-in-loop */
// More readabe without this
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

import { LanguageDataType } from '../../utils/custom-proptypes';
import TextField from '../Fields/TextField';
import MultiSelectField from '../Fields/MultiSelectField';
import { ACCESS_LEVELS } from '../../utils/constants';
import './EditRoleModal.scss';
import { addUserRole, removeUserRole, setUserAccess } from '../../utils/api';
import { useErrorWrap } from '../../hooks/useErrorWrap';

const EditRoleModal = ({
    languageData,
    isOpen,
    onClose,
    onUserEdited,
    userInfo,
    allRoles,
}) => {
    const [userData, setUserData] = useState(_.cloneDeep(userInfo));
    const errorWrap = useErrorWrap();
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

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
        for (let i = 0; i < allRoles.length; i += 1) {
            const role = allRoles[i];

            // If user has role
            if (userData.roles.find((r) => r === role._id)) {
                // If user didn't have role before, make request to backend
                if (!userInfo.roles.find((r) => r === role._id)) {
                    await errorWrap(async () =>
                        addUserRole(userData.userName, role._id),
                    );
                }
            } else {
                // If user did have role before, make request to backend
                if (userInfo.roles.find((r) => r === role._id)) {
                    await errorWrap(async () =>
                        removeUserRole(userData.userName, role._id),
                    );
                }
            }
        }

        // Update user access level
        await errorWrap(async () =>
            setUserAccess(userData.userName, userData.accessLevel),
        );

        // Close modal and update local data
        onClose();
        onUserEdited(userData.userName, userData.accessLevel, userData.roles);
    };

    return (
        <Modal open={isOpen} onClose={onClose} className="edit-role-modal">
            <div className="edit-role-modal-wrapper">
                <h2>{lang.accountManagement.editAccount}</h2>
                <TextField
                    className="text-field"
                    displayName={lang.accountManagement.username}
                    type="text"
                    isDisabled
                    value={userData?.userName}
                />
                <TextField
                    className="text-field"
                    displayName={lang.accountManagement.email}
                    type="text"
                    isDisabled
                    value={userData?.userEmail}
                />
                <MultiSelectField
                    title="Roles"
                    langKey={key}
                    options={allRoles}
                    selectedOptions={userData?.roles}
                    onChange={onRolesChange}
                    isDisabled={false}
                />
                <FormControl>
                    <InputLabel>{lang.accountManagement.access}</InputLabel>
                    <Select
                        native
                        value={userData?.accessLevel}
                        onChange={onAccessChange}
                    >
                        <option value={ACCESS_LEVELS.GRANTED}>
                            {lang.accountManagement.Approved}
                        </option>
                        <option value={ACCESS_LEVELS.REVOKED}>
                            {lang.accountManagement.Revoked}
                        </option>
                        <option value={ACCESS_LEVELS.PENDING}>
                            {lang.accountManagement.Pending}
                        </option>
                    </Select>
                </FormControl>
                <div>
                    <Button className="save-user-button" onClick={onSave}>
                        {lang.accountManagement.Save}
                    </Button>
                    <Button className="discard-user-button" onClick={onClose}>
                        {lang.accountManagement.Discard}
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
    allRoles: PropTypes.arrayOf(PropTypes.string),
    languageData: LanguageDataType.isRequired,
    userInfo: PropTypes.shape({
        username: PropTypes.string,
        userEmail: PropTypes.string,
        roles: PropTypes.arrayOf(PropTypes.String),
    }),
};

export default EditRoleModal;
