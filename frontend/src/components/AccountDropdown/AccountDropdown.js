import React, { useContext } from 'react';
import Menu from '@material-ui/core/Menu';
import { Button, makeStyles } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';

import { LanguageDataType } from '../../utils/custom-proptypes';
import { saveLanguagePreference, signOut } from '../../aws/aws-helper';
import { useTranslations } from '../../hooks/useTranslations';
import { LANGUAGES, REDUCER_ACTIONS } from '../../utils/constants';
import { Context } from '../../store/Store';

const useStyles = makeStyles({
    menuWrapper: {
        margin: '10px',
        width: 'fit-content',
    },
    accountEmail: {
        color: 'grey',
        lineHeight: '0px',
    },
    languageSelectorWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    languageSelector: {
        height: '35px',
        marginLeft: '5px',
    },
    signOutButton: {
        padding: '8px 0px 0px 0px',
    },
});

const AccountDropdown = ({
    setLang,
    anchorEl,
    handleClose,
    username = '',
    userEmail = '',
}) => {
    const styles = useStyles();
    const dispatch = useContext(Context)[1];
    const [translations, selectedLang] = useTranslations();

    const handleLanguageSelect = (e) => {
        setLang(e.target.value);
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
                anchorOrigin={{ vertical: 'bottom' }}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <div className={styles.menuWrapper}>
                    <p>{username}</p>
                    <p className={styles.accountEmail}>{userEmail}</p>
                    <div className={styles.languageSelectorWrapper}>
                        {/* TODO: ARABIC BOIIIII */}
                        <p>Language</p>
                        <FormControl
                            variant="outlined"
                            className={styles.languageSelector}
                        >
                            <Select
                                value={selectedLang}
                                onChange={handleLanguageSelect}
                            >
                                <MenuItem value={LANGUAGES.EN}>EN</MenuItem>
                                <MenuItem value={LANGUAGES.AR}>AR</MenuItem>
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
    setLang: PropTypes.func.isRequired,
    username: PropTypes.string,
    userEmail: PropTypes.string,
    anchorEl: PropTypes.elementType,
};

export default AccountDropdown;
