import React, { useState } from 'react';
import { Modal, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

import TextField from '../Fields/TextField';
import './AddRoleModal.scss';
import { useTranslations } from '../../hooks/useTranslations';
import { addRole } from '../../api/api';
import { useErrorWrap } from '../../hooks/useErrorWrap';

// TODO: check duplicate roles
// TODO: Do we need to figure out if role is immutable?
// Should I have isHidden or isMutable?

const AddRoleModal = ({ isOpen, onClose }) => {
    const [role, setRole] = useState(null);
    const translations = useTranslations()[0];
    const errorWrap = useErrorWrap();

    const onSave = async () => {
        await errorWrap(async () => addRole(role));
        onClose();
        // onUserEdited(userData.userId, userData.accessLevel, userData.roles);
    };

    // TODO: General Modal Component

    // TODO: Ask about key param
    // TODO: Should state just be one role object to be updated? Is this best way to write handlers?
    // TODO: onUserEdited
    // TODO: how to make this required or need to make fields required?

    const handleNameENChange = (key, value) => {
        setRole((prevState) => ({
            ...prevState,
            roleName: { ...prevState?.roleName, EN: value },
        }));
    };

    const handleNameARChange = (key, value) => {
        setRole((prevState) => ({
            ...prevState,
            roleName: { ...prevState?.roleName, AR: value },
        }));
    };

    const handleDescENChange = (key, value) => {
        setRole((prevState) => ({
            ...prevState,
            roleDescription: { ...prevState?.roleDescription, EN: value },
        }));
    };

    const handleDescARChange = (key, value) => {
        setRole((prevState) => ({
            ...prevState,
            roleDescription: { ...prevState?.roleDescription, AR: value },
        }));
    };

    return (
        <Modal open={isOpen} onClose={onClose} className="add-role-modal">
            <div className="add-role-modal-wrapper">
                <h2>{translations.roleManagement.addRole}</h2>
                <TextField
                    value={role?.roleName?.EN}
                    className="text-field"
                    displayName={`${translations.roleManagement.roleName} (EN)`}
                    onChange={handleNameENChange}
                />
                <TextField
                    value={role?.roleName?.AR}
                    className="text-field"
                    displayName={`${translations.roleManagement.roleName} (AR)`}
                    onChange={handleNameARChange}
                />
                <TextField
                    value={role?.roleDescription?.EN}
                    className="text-field"
                    displayName={`${translations.roleManagement.roleDescription} (EN)`}
                    onChange={handleDescENChange}
                />
                <TextField
                    value={role?.roleDescription?.AR}
                    className="text-field"
                    displayName={`${translations.roleManagement.roleDescription} (AR)`}
                    onChange={handleDescARChange}
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
    );
};

AddRoleModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default AddRoleModal;
