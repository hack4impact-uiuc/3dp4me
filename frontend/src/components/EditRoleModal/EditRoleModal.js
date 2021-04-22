import React, { useState } from 'react';
import _ from 'lodash';
import { LanguageDataType } from '../../utils/custom-proptypes';
import {
    Modal,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@material-ui/core';
import TextField from '../Fields/TextField';
import MultiSelectField from '../Fields/MultiSelectField';
import PropTypes from 'prop-types';
import { ACCESS_LEVELS } from '../../utils/constants.js';

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
        setUserData({ ...userData, roles: roles });
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div style={{ display: 'flex', 'flex-direction': 'column' }}>
                <h2>Edit Account</h2>
                <TextField
                    displayName="Name"
                    type="text"
                    isDisabled={true}
                    value={userData?.userName}
                />
                <TextField
                    displayName="Name"
                    type="text"
                    isDisabled={true}
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
                    <InputLabel>Access</InputLabel>
                    <Select
                        native
                        value={userData?.accessLevel}
                        // onChange={handleChange}
                    >
                        <option value={ACCESS_LEVELS.GRANTED}>Approved</option>
                        <option value={ACCESS_LEVELS.REVOKED}>Revoked</option>
                        <option value={ACCESS_LEVELS.PENDING}>Pending</option>
                    </Select>
                </FormControl>
            </div>
        </Modal>
    );
};

EditRoleModal.propTypes = {
    languageData: LanguageDataType.isRequired,
    handleClose: PropTypes.func.isRequired,
    setLang: PropTypes.func.isRequired,
    anchorEl: PropTypes.elementType,
    userData: PropTypes.shape({
        username: PropTypes.string,
        userEmail: PropTypes.string,
        roles: PropTypes.arrayOf(PropTypes.String),
    }),
};

export default EditRoleModal;
