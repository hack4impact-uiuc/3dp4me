import React from 'react';

import './StyledButton.scss';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';

import { LANGUAGES } from '../../utils/constants';
import { useTranslations } from '../../hooks/useTranslations';

const StyledButton = ({
    onClick,
    primary,
    danger,
    children,
    isDisabled = false,
}) => {
    const selectedLang = useTranslations()[1];
    const saveBtnClassName =
        selectedLang === LANGUAGES.AR ? 'save-button-ar' : 'save-button';

    let className = primary
        ? 'button-wrapper-primary'
        : 'button-wrapper-secondary';

    if (danger) {
        className = 'button-wrapper-danger';
    }

    return (
        <div className={className}>
            <Button
                className={saveBtnClassName}
                onClick={onClick}
                disabled={isDisabled}
            >
                {children}
            </Button>
        </div>
    );
};

StyledButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    primary: PropTypes.bool,
    danger: PropTypes.bool,
    children: PropTypes.node,
    isDisabled: PropTypes.bool,
};

export { StyledButton };
