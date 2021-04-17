import React, { useState } from 'react';

import { LanguageDataType } from '../../utils/custom-proptypes';
import { Modal } from '@material-ui/core';
import TextField from '../Fields/TextField';
import MultiSelectField from '../Fields/MultiSelectField';
import PropTypes from 'prop-types';

const EditRoleModal = ({
    languageData,
    isOpen,
    onClose,
    userName,
    userEmail,
    selectedRoles,
    allRoles,
}) => {
    const [userRoles, setUserRoles] = useState(selectedRoles);

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const onRolesChange = (id, roles) => {
        console.log('SETTING TO' + roles);
        setUserRoles(roles);
        console.log('SET TO' + userRoles);
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div>
                <h2>Edit Account</h2>
                <TextField
                    displayName="Name"
                    type="text"
                    isDisabled={true}
                    value={userName}
                />
                <TextField
                    displayName="Name"
                    type="text"
                    isDisabled={true}
                    value={userEmail}
                />
                <MultiSelectField
                    title="Roles"
                    langKey={key}
                    options={allRoles}
                    selectedOptions={userRoles}
                    onChange={onRolesChange}
                    isDisabled={false}
                />
            </div>
        </Modal>
    );
};

EditRoleModal.propTypes = {
    languageData: LanguageDataType.isRequired,
    handleClose: PropTypes.func.isRequired,
    setLang: PropTypes.func.isRequired,
    username: PropTypes.string,
    userEmail: PropTypes.string,
    anchorEl: PropTypes.elementType,
};

export default EditRoleModal;
