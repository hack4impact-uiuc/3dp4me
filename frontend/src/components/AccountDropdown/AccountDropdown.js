import React, { useContext } from 'react';
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

const AccountDropdown = ({
    anchorEl,
    handleClose,
    username = '',
    userEmail = '',
}) => {
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
                    <div className={styles.languageSelectorWrapper}>
                        <p>
                            {translations.components.navbar.dropdown.language}
                        </p>
                        <FormControl
                            variant="outlined"
                            className={styles.languageSelector}
                        >
                            <Select
                                value={selectedLang}
                                onChange={handleLanguageSelect}
                            >
                                <MenuItem value={LANGUAGES.EN}>
                                    {translations.components.navbar.dropdown.EN}
                                </MenuItem>
                                <MenuItem value={LANGUAGES.AR}>
                                    {translations.components.navbar.dropdown.AR}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.signOutButton}>
                        <Button onClick={signOut}>
                            {translations.components.login.signOut}
                        </Button>
                    </div>
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
