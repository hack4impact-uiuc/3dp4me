import React from 'react';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';

import { LanguageDataType } from '../../utils/custom-proptypes';
import { saveLanguagePreference } from '../../aws/aws-helper';

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
    languageData,
    setLang,
    anchorEl,
    handleClose,
    username = '',
    userEmail = '',
}) => {
    const styles = useStyles();

    const key = languageData.selectedLanguage;

    const handleLanguageSelect = (e) => {
        setLang(e.target.value);
        saveLanguagePreference(e.target.value);
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
                            <Select value={key} onChange={handleLanguageSelect}>
                                <MenuItem value="EN">EN</MenuItem>
                                <MenuItem value="AR">AR</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.signOutButton}>
                        <AmplifySignOut />
                    </div>
                </div>
            </Menu>
        </div>
    );
};

AccountDropdown.propTypes = {
    languageData: LanguageDataType.isRequired,
    handleClose: PropTypes.func.isRequired,
    setLang: PropTypes.func.isRequired,
    username: PropTypes.string,
    userEmail: PropTypes.string,
    anchorEl: PropTypes.elementType,
};

export default AccountDropdown;
