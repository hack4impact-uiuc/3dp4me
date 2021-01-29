import React from 'react';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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

const AccountDropdown = (props) => {
    const styles = useStyles();

    const key = props.languageData.selectedLanguage;
    const lang = props.languageData.translations[key];

    const handleLanguageSelect = (e) => {
        props.setLang(e.target.value);
    };

    return (
        <div>
            <Menu
                id="account-dropdown-menu"
                anchorEl={props.anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: 'bottom' }}
                keepMounted
                open={Boolean(props.anchorEl)}
                onClose={props.handleClose}
            >
                <div className={styles.menuWrapper}>
                    <p>{props.username}</p>
                    <p className={styles.accountEmail}>{props.userEmail}</p>
                    <div className={styles.languageSelectorWrapper}>
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

export default AccountDropdown;
