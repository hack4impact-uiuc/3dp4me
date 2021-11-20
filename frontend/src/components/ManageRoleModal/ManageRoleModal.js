import React from 'react';
import { Modal, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

import TextField from '../Fields/TextField';
import './ManageRoleModal.scss';
import { useTranslations } from '../../hooks/useTranslations';

// TODO: check duplicate roles
// TODO: Do we need to figure out if role is immutable?

const ManageRoleModal = ({ isOpen, onClose, roleInfo }) => {
    // const [roleToAdd, setRoleToAdd] = useState('');
    const translations = useTranslations()[0];

    const onSave = async () => {
        onClose();
        // onUserEdited(userData.userId, userData.accessLevel, userData.roles);
    };

    // TODO: General Modal Component

    // TODO: Deleting Roles, Adding Role Descriptions to Table, Adding more roles to edit to table over just adding and removing buttons

    // TODO: onUserEdited

    return (
        <Modal open={isOpen} onClose={onClose} className="manage-role-modal">
            <div className="manage-role-modal-wrapper">
                <h2>{translations.roleManagement.manageRole}</h2>
                <TextField
                    className="text-field"
                    displayName={translations.accountManagement.roleName}
                    type="text"
                    isDisabled
                    value={roleInfo?.name}
                />
                <p>{translations.roleManagement.warning}</p>
                <div>
                    <Button className="delete-user-button" onClick={onSave}>
                        {translations.roleManagement.deleteRole}
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

ManageRoleModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    roleInfo: PropTypes.shape({
        name: PropTypes.string,
    }),
};

export default ManageRoleModal;
