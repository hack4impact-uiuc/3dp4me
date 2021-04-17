import React from 'react';

import { LanguageDataType } from '../../utils/custom-proptypes';
import { Modal } from '@material-ui/core';
import TextField from '../Fields/TextField';

const EditRoleModal = ({
    languageData,
    isOpen,
    onClose,
    userName,
    userEmail,
}) => {
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

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
