import React, { ChangeEvent, ReactElement, ReactNode, useContext } from 'react';
import Menu from '@material-ui/core/Menu';
import { Button } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';

import { saveLanguagePreference, signOut } from '../../aws/aws-helper';
import { useTranslations } from '../../hooks/useTranslations';
import { Context } from '../../store/Store';

import { useStyles } from './AccountDropdown.styles';
import { isLanguageValid } from '../../utils/language';
import { ReducerActionType } from '../../store/Reducer';
import { Language } from '@3dp4me/types';

export interface AccountDropdownProps {
    anchorEl: Element | ((element: Element) => Element) | null | undefined
    handleClose: () => void,
    username: string,
    userEmail: string
}

const AccountDropdown = ({
    anchorEl,
    handleClose,
    username = '',
    userEmail = '',
}: AccountDropdownProps) => {
    const styles = useStyles();
    const dispatch = useContext(Context)[1];
    const [translations, selectedLang] = useTranslations();

    const handleLanguageSelect = (e: ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>,) => {
        if (typeof e.target.value !== 'string') return;
        if (!isLanguageValid(e.target.value)) return;

        saveLanguagePreference(e.target.value);
        dispatch({
            type: ReducerActionType.SET_LANGUAGE,
            language: e.target.value,
        });
    };

    return (
        <div>
            <Menu
                id="account-dropdown-menu"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
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
    );
};

AccountDropdown.propTypes = {
    handleClose: PropTypes.func.isRequired,
    username: PropTypes.string,
    userEmail: PropTypes.string,
    anchorEl: PropTypes.elementType,
};

export default AccountDropdown;
