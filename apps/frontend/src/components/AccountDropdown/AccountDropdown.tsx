import { Language } from '@3dp4me/types'
import { PopoverVirtualElement } from '@mui/material'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import React, { useContext } from 'react'

import { saveLanguagePreference, signOut } from '../../aws/aws-helper'
import { useTranslations } from '../../hooks/useTranslations'
import { ReducerActionType } from '../../store/Reducer'
import { Context } from '../../store/Store'
import { isLanguageValid } from '../../utils/language'
import { useStyles } from './AccountDropdown.styles'

export interface AccountDropdownProps {
    handleClose: () => void
    username: string
    userEmail: string
    anchorEl:
        | Element
        | (() => Element)
        | PopoverVirtualElement
        | (() => PopoverVirtualElement)
        | null
        | undefined
}

const AccountDropdown = ({
    handleClose,
    username = '',
    userEmail = '',
    anchorEl,
}: AccountDropdownProps) => {
    const styles = useStyles()
    const dispatch = useContext(Context)[1]
    const [translations, selectedLang] = useTranslations()

    const handleLanguageSelect = (e: SelectChangeEvent<Language>) => {
        if (typeof e.target.value !== 'string') return
        if (!isLanguageValid(e.target.value)) return

        saveLanguagePreference(e.target.value)
        dispatch({
            type: ReducerActionType.SET_LANGUAGE,
            language: e.target.value,
        })
    }

    return (
        <div>
            <Menu
                id="account-dropdown-menu"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorEl={anchorEl}
            >
                <div className={styles.menuWrapper}>
                    <p>{username}</p>
                    <p className={styles.accountEmail}>{userEmail}</p>
                    <p>{translations.components.navbar.dropdown.language}</p>
                    <FormControl fullWidth variant="outlined">
                        <Select
                            value={selectedLang}
                            onChange={handleLanguageSelect}
                            className={styles.languageSelector}
                        >
                            <MenuItem value={Language.EN}>
                                {translations.components.navbar.dropdown.EN}
                            </MenuItem>
                            <MenuItem value={Language.AR}>
                                {translations.components.navbar.dropdown.AR}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <Button onClick={signOut} className={styles.signOutButton}>
                        {translations.components.login.signOut}
                    </Button>
                </div>
            </Menu>
        </div>
    )
}

export default AccountDropdown
