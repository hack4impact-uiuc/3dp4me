import React, { useState } from 'react';
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

const EditRoleModal = ({
    languageData,
    isOpen,
    onClose,
    userInfo,
    allRoles,
}) => {
    const [userData, setUserData] = useState(_.cloneDeep(userInfo));

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const onRolesChange = (id, roles) => {
        setUserData({ ...userData, roles });
    };

    const onAccessChange = (event) => {
        setUserData({ ...userData, accessLevel: event.target.value });
    };

    const onSave = (event) => {
        // TODO: Make post requests and callback to parent
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className="edit-role-modal-wrapper">
                <h2>{lang.accountManagement.editAccount}</h2>
                <TextField
                    displayName={lang.accountManagement.username}
                    type="text"
                    isDisabled
                    value={userData?.userName}
                />
                <TextField
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
                    <Button onClick={onSave}>
                        {lang.accountManagement.Save}
                    </Button>
                    <Button onClick={onClose}>
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
    allRoles: PropTypes.arrayOf(PropTypes.string),
    languageData: LanguageDataType.isRequired,
    userInfo: PropTypes.shape({
        username: PropTypes.string,
        userEmail: PropTypes.string,
        roles: PropTypes.arrayOf(PropTypes.String),
    }),
};

export default EditRoleModal;
