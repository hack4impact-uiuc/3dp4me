import React, { useState } from 'react';
import { Modal, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

import TextField from '../Fields/TextField';
import './AddRoleModal.scss';
import { useTranslations } from '../../hooks/useTranslations';

// TODO: check duplicate roles
// TODO: Do we need to figure out if role is immutable?

const AddRoleModal = ({ isOpen, onClose }) => {
    const [roleToAdd, setRoleToAdd] = useState('');
    const translations = useTranslations()[0];

    const onSave = async () => {
        onClose();
        // onUserEdited(userData.userId, userData.accessLevel, userData.roles);
    };

    // TODO: General Modal Component

    const onFieldUpdate = (key, value) => {
        setRoleToAdd(value);
    };

    return (
        <Modal open={isOpen} onClose={onClose} className="add-role-modal">
            <div className="add-role-modal-wrapper">
                <h2>{translations.accountManagement.addRole}</h2>
                <TextField
                    value={roleToAdd}
                    className="text-field"
                    displayName={translations.roleManagement.roleName}
                    onChange={onFieldUpdate}
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
