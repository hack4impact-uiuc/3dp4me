import { Select } from '@material-ui/core';
import React from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import { ACCESS_LEVELS } from '../../utils/constants';

const AccessDropdown = ({ value, onValueChange }) => {
    const translations = useTranslations()[0];

    return (
        <Select native value={value} onChange={onValueChange}>
            <option value={ACCESS_LEVELS.GRANTED}>
                {translations.accountManagement.Approved}
            </option>
            <option value={ACCESS_LEVELS.REVOKED}>
                {translations.accountManagement.Revoked}
            </option>
            <option value={ACCESS_LEVELS.PENDING}>
                {translations.accountManagement.Pending}
            </option>
        </Select>
    );
};

export default AccessDropdown;
