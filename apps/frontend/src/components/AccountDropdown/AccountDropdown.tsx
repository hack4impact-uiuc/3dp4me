import { Language } from '@3dp4me/types'
import { PopoverVirtualElement, styled } from '@mui/material'
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

const MenuWrapper = styled('div')({
    margin: '10px',
    width: 'fit-content',
    display: 'block',
})

const AccountEmail = styled('p')({
    color: 'grey',
    lineHeight: '0px',
})

const LanguageSelector = styled(Select<Language>)({
    height: 50,
})

const SignoutButton = styled(Button)`
    height: '38px';
    fontsize: '1em';
    fontweight: 'bold';
    backgroundcolor: '#ca0909';
    color: 'white';
    margintop: '10px';
    width: '100%';
    '&:hover': {
        background: '#ca0909';
    }
`

const AccountDropdown = ({
    handleClose,
    username = '',
    userEmail = '',
    anchorEl,
}: AccountDropdownProps) => {
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
                <MenuWrapper>
                    <p>{username}</p>
                    <AccountEmail>{userEmail}</AccountEmail>
                    <p>{translations.components.navbar.dropdown.language}</p>
                    <FormControl fullWidth variant="outlined">
                        <LanguageSelector value={selectedLang} onChange={handleLanguageSelect}>
                            <MenuItem value={Language.EN}>
                                {translations.components.navbar.dropdown.EN}
                            </MenuItem>
                            <MenuItem value={Language.AR}>
                                {translations.components.navbar.dropdown.AR}
                            </MenuItem>
                        </LanguageSelector>
                    </FormControl>
                    <SignoutButton onClick={signOut}>
                        {translations.components.login.signOut}
                    </SignoutButton>
                </MenuWrapper>
            </Menu>
        </div>
    )
}

export default AccountDropdown
