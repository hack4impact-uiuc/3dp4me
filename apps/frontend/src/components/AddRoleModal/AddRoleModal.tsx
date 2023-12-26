import React, { useState } from 'react';
import { Modal, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import { trackPromise } from 'react-promise-tracker';

import TextField from '../Fields/TextField';
import TextArea from '../Fields/TextArea';
import './AddRoleModal.scss';
import { useTranslations } from '../../hooks/useTranslations';
import { addRole } from '../../api/api';
import { useErrorWrap } from '../../hooks/useErrorWrap';
import {
    ERR_ROLE_INPUT_VALIDATION_FAILED,
    LANGUAGES,
} from '../../utils/constants';
import { Language, Role } from '@3dp4me/types';

export interface AddRoleModalProps {
    isOpen: boolean
    onClose: () => void
    onRoleAdded: (role: Role) => void
}

const AddRoleModal = ({ isOpen, onClose, onRoleAdded }: AddRoleModalProps) => {
    const [role, setRole] = useState<Role>({});
    const translations = useTranslations()[0];
    const errorWrap = useErrorWrap();

    const onSave = async () => {
        errorWrap(async () => {
            validateRole();
            const res = await trackPromise(addRole(role));
            onRoleAdded(res.result);
            onClose();
        });
    };

    const handleRoleUpdate = (key: "roleName" | "roleDescription", value: string, lang: Language) => {
        setRole((prevState) => ({
            ...prevState,
            [key]: { ...prevState?.[key], [lang]: value },
        }));
    };

    const validateRole = () => {
        if (
            !role?.roleName ||
            !role?.roleDescription ||
            role?.roleName?.[Language.EN]?.trim() === '' ||
            role?.roleName?.[Language.AR]?.trim() === '' ||
            role?.roleDescription?.[Language.EN]?.trim() === '' ||
            role?.roleDescription?.[Language.AR]?.trim() === ''
        ) {
            throw new Error(ERR_ROLE_INPUT_VALIDATION_FAILED);
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose} className="add-role-modal">
            <div className="add-role-modal-wrapper">
                <h2>{translations.roleManagement.addRole}</h2>
                <TextField
                    value={role?.roleName?.[Language.EN]}
                    className="text-field"
                    displayName={`${translations.roleManagement.roleName} (EN)`}
                    onChange={(key, value) =>
                        handleRoleUpdate("roleName", value, Language.EN)
                    }
                    fieldId="roleName"
                />
                <TextField
                    value={role?.roleName?.[Language.AR]}
                    className="text-field"
                    displayName={`${translations.roleManagement.roleName} (AR)`}
                    onChange={(key, value) =>
                        handleRoleUpdate("roleName", value, Language.AR)
                    }
                    fieldId="roleName"
                />
                <TextArea
                    value={role?.roleDescription?.[Language.EN]}
                    title={`${translations.roleManagement.roleDescription} (EN)`}
                    onChange={(key, value) =>
                        handleRoleUpdate(key, value, Language.EN)
                    }
                    fieldId="roleDescription"
                    disabled={false}
                />
                <TextArea
                    value={role?.roleDescription?.[Language.AR]}
                    title={`${translations.roleManagement.roleDescription} (AR)`}
                    onChange={(key, value) =>
                        handleRoleUpdate(key, value, Language.AR)
                    }
                    fieldId="roleDescription"
                    disabled={false}
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
    onRoleAdded: PropTypes.func.isRequired,
};

export default AddRoleModal;