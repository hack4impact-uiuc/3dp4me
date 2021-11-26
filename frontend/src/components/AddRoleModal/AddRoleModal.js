import React, { useState } from 'react';
import { Modal, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

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
import { trackPromise } from 'react-promise-tracker';

const AddRoleModal = ({ isOpen, onClose, onRoleAdded }) => {
    const [role, setRole] = useState({});
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

    const handleRoleUpdate = (key, value, lang) => {
        setRole((prevState) => ({
            ...prevState,
            [key]: { ...prevState?.[key], [lang]: value },
        }));
    };

    const validateRole = () => {
        if (
            !role?.roleName ||
            !role?.roleDescription ||
            role?.roleName?.[LANGUAGES.EN]?.trim() === '' ||
            role?.roleName?.[LANGUAGES.AR]?.trim() === '' ||
            role?.roleDescription?.[LANGUAGES.EN]?.trim() === '' ||
            role?.roleDescription?.[LANGUAGES.AR]?.trim() === ''
        ) {
            throw new Error(ERR_ROLE_INPUT_VALIDATION_FAILED);
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose} className="add-role-modal">
            <div className="add-role-modal-wrapper">
                <h2>{translations.roleManagement.addRole}</h2>
                <TextField
                    value={role?.roleName?.[LANGUAGES.EN]}
                    className="text-field"
                    displayName={`${translations.roleManagement.roleName} (EN)`}
                    onChange={(key, value) =>
                        handleRoleUpdate(key, value, LANGUAGES.EN)
                    }
                    fieldId="roleName"
                />
                <TextField
                    value={role?.roleName?.[LANGUAGES.AR]}
                    className="text-field"
                    displayName={`${translations.roleManagement.roleName} (AR)`}
                    onChange={(key, value) =>
                        handleRoleUpdate(key, value, LANGUAGES.AR)
                    }
                    fieldId="roleName"
                />
                <TextArea
                    value={role?.roleDescription?.[LANGUAGES.EN]}
                    title={`${translations.roleManagement.roleDescription} (EN)`}
                    onChange={(key, value) =>
                        handleRoleUpdate(key, value, LANGUAGES.EN)
                    }
                    fieldId="roleDescription"
                    disabled={false}
                />
                <TextArea
                    value={role?.roleDescription?.[LANGUAGES.AR]}
                    title={`${translations.roleManagement.roleDescription} (AR)`}
                    onChange={(key, value) =>
                        handleRoleUpdate(key, value, LANGUAGES.AR)
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
