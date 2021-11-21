import React, { useState } from 'react';
import { Modal, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

import TextField from '../Fields/TextField';
import TextArea from '../Fields/TextField';

import './ManageRoleModal.scss';
import { useTranslations } from '../../hooks/useTranslations';
import { deleteRole, editRole } from '../../api/api';
import { useErrorWrap } from '../../hooks/useErrorWrap';

// TODO: check duplicate roles
// TODO: Do we need to figure out if role is immutable?

const ManageRoleModal = ({ isOpen, onClose, roleInfo }) => {
    // console.log(roleInfo);
    // const [roleToAdd, setRoleToAdd] = useState('');

    const [translations, selectedLang] = useTranslations();
    // TODO: use Effect here?
    // TODO:  how to get initial desc inside
    const [role, setRole] = useState({
        [`roleDescription.${selectedLang}`]: roleInfo?.description,
    });
    const errorWrap = useErrorWrap();

    const onDelete = async () => {
        await errorWrap(async () => deleteRole(roleInfo?.id));
        onClose();
        // onUserEdited(userData.userId, userData.accessLevel, userData.roles);
    };

    const onSave = async () => {
        // TODO: add Edit Role here, input put method
        await errorWrap(async () => editRole(roleInfo?.id, role));
        onClose();
        // onUserEdited(userData.userId, userData.accessLevel, userData.roles);
    };

    const onDescriptionChange = async (fieldId, roleDesc) => {
        // console.log(role);
        // TODO: add Edit Role here, input put method
        setRole((prevState) => ({
            ...prevState,
            [`roleDescription.${selectedLang}`]: roleDesc,
        }));
        // onUserEdited(userData.userId, userData.accessLevel, userData.roles);
    };

    // TODO: General Modal Component

    // TODO: Deleting Roles, Adding Role Descriptions to Table, Adding more roles to edit to table over just adding and removing buttons

    // TODO: onUserEdited, getting the modal to change based on selected lang? or should there be fields to modify values in both languages
    // TODO: Should the role name be able to be modified?

    return (
        <Modal open={isOpen} onClose={onClose} className="manage-role-modal">
            <div className="manage-role-modal-wrapper">
                <h2>{translations.roleManagement.manageRole}</h2>
                <TextField
                    className="text-field"
                    displayName={translations.roleManagement.roleName}
                    type="text"
                    isDisabled
                    value={roleInfo?.name}
                />
                {/* TODO: Text Area isn't any bigger */}
                <TextField
                    className="text-field"
                    displayName={translations.roleManagement.roleDescription}
                    type="text"
                    isDisabled={false}
                    value={role?.[`roleDescription.${selectedLang}`]}
                    onChange={onDescriptionChange}
                />
                <p>{translations.roleManagement.warning}</p>
                <div>
                    <Button className="delete-user-button" onClick={onDelete}>
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
        id: PropTypes.string,
        description: PropTypes.string,
    }),
};

export default ManageRoleModal;
