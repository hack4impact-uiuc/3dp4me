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

import TextField from '../Fields/TextField';
import MultiSelectField from '../Fields/MultiSelectField';
import { ACCESS_LEVELS } from '../../utils/constants';
import './EditRoleModal.scss';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import { useTranslations } from '../../hooks/useTranslations';

const EditRoleModal = ({
    isOpen,
    onClose,
    onUserEdited,
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

    const onSave = () => {
        // TODO: Make post requests and callback to parent
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
                </FormControl>
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
    allRoles: PropTypes.arrayOf(PropTypes.string),
    userInfo: PropTypes.shape({
        username: PropTypes.string,
        userEmail: PropTypes.string,
        roles: PropTypes.arrayOf(PropTypes.String),
    }),
};

export default EditRoleModal;
