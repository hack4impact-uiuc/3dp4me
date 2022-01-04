import React, { useState, useEffect } from 'react';
import { Modal, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { trackPromise } from 'react-promise-tracker';

import TextField from '../Fields/TextField';
import TextArea from '../Fields/TextArea';
import './ManageRoleModal.scss';
import { useTranslations } from '../../hooks/useTranslations';
import { deleteRole, editRole } from '../../api/api';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import {
    ERR_ROLE_INPUT_VALIDATION_FAILED,
    ERR_ROLE_IS_IMMUTABLE,
} from '../../utils/constants';

const ManageRoleModal = ({
    isOpen,
    onClose,
    onRoleDeleted,
    onRoleEdited,
    roleInfo,
}) => {
    const [translations, selectedLang] = useTranslations();
    const [role, setRole] = useState({});
    const errorWrap = useErrorWrap();

    useEffect(() => {
        setRole(_.cloneDeep(roleInfo));
    }, [roleInfo]);

    const onDelete = async () => {
        errorWrap(async () => {
            if (roleInfo?.isMutable) {
                await errorWrap(async () =>
                    trackPromise(deleteRole(roleInfo?._id)),
                );
                onRoleDeleted(roleInfo?._id);
                onClose();
            } else {
                throw new Error(ERR_ROLE_IS_IMMUTABLE);
            }
        });
    };

    const validateRole = () => {
        if (
            role.roleName[selectedLang].trim() === '' ||
            role.roleDescription[selectedLang].trim() === ''
        ) {
            throw new Error(ERR_ROLE_INPUT_VALIDATION_FAILED);
        }
    };

    const onSave = async () => {
        errorWrap(async () => {
            validateRole();
            if (roleInfo?.isMutable) {
                await errorWrap(async () =>
                    trackPromise(editRole(roleInfo?._id, role)),
                );
                onRoleEdited(roleInfo?._id, role);
                onClose();
            } else {
                throw new Error(ERR_ROLE_IS_IMMUTABLE);
            }
        });
    };

    const onRoleChange = async (fieldId, value) => {
        setRole((prevState) => ({
            ...prevState,
            [fieldId]: { ...prevState?.[fieldId], [selectedLang]: value },
        }));
    };

    return (
        <Modal open={isOpen} onClose={onClose} className="manage-role-modal">
            <div className="manage-role-modal-wrapper">
                <h2>{translations.roleManagement.manageRole}</h2>
                <TextField
                    className="text-field"
                    displayName={translations.roleManagement.roleName}
                    type="text"
                    isDisabled={!role?.isMutable}
                    value={role?.roleName?.[selectedLang]}
                    onChange={onRoleChange}
                    fieldId="roleName"
                />
                <TextArea
                    title={translations.roleManagement.roleDescription}
                    disabled={!role?.isMutable}
                    fieldId="roleDescription"
                    value={role?.roleDescription?.[selectedLang]}
                    onChange={onRoleChange}
                />
                <p>{translations.roleManagement.warning}</p>

                <div className="button-div">
                    <div>
                        <Button className="save-user-button" onClick={onSave}>
                            {translations.accountManagement.Save}
                        </Button>
                        <Button className="discard-user-button" onClick={onClose}>
                            {translations.accountManagement.Discard}
                        </Button>
                    </div>

                    <div>
                        <Button className="delete-user-button" onClick={onDelete}>
                            {translations.roleManagement.deleteRole}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

ManageRoleModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onRoleDeleted: PropTypes.func.isRequired,
    onRoleEdited: PropTypes.func.isRequired,
    roleInfo: PropTypes.shape({
        roleName: PropTypes.string,
        _id: PropTypes.string,
        roleDescription: PropTypes.string,
        isMutable: PropTypes.bool,
    }),
};

export default ManageRoleModal;
