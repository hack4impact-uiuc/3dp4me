import './StyledButton.scss'

import Button from '@material-ui/core/Button'
import React, { ReactNode } from 'react'

import { useTranslations } from '../../hooks/useTranslations'
import { LANGUAGES } from '../../utils/constants'

export interface StyledButtonProps {
    onClick?: () => void
    primary?: boolean
    danger?: boolean
    children?: ReactNode
    isDisabled?: boolean
}

const StyledButton = ({
    onClick,
    primary,
    danger,
    children,
    isDisabled = false,
}: StyledButtonProps) => {
    const selectedLang = useTranslations()[1]
    const saveBtnClassName = selectedLang === LANGUAGES.AR ? 'save-button-ar' : 'save-button'

    let className = primary ? 'button-wrapper-primary' : 'button-wrapper-secondary'

    if (danger) {
        className = 'button-wrapper-danger'
    }

    return (
        <div className={className}>
            <Button className={saveBtnClassName} onClick={onClick} disabled={isDisabled}>
                {children}
            </Button>
        </div>
    )
}

export { StyledButton }
