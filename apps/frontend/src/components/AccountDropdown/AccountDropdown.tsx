import React, { ReactElement, ReactNode, useContext } from 'react';
import Menu from '@material-ui/core/Menu';
import { Button } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';

import { saveLanguagePreference, signOut } from '../../aws/aws-helper';
import { useTranslations } from '../../hooks/useTranslations';
import { LANGUAGES, REDUCER_ACTIONS } from '../../utils/constants';
import { Context } from '../../store/Store';

import { useStyles } from './AccountDropdown.styles';

export interface AccountDropdownProps {
    anchorEl: ReactNode,
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

    const handleLanguageSelect = (e) => {
        saveLanguagePreference(e.target.value);
        dispatch({
            type: REDUCER_ACTIONS.SET_LANGUAGE,
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
                            <MenuItem value={LANGUAGES.EN}>
                                {translations.components.navbar.dropdown.EN}
                            </MenuItem>
                            <MenuItem value={LANGUAGES.AR}>
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
