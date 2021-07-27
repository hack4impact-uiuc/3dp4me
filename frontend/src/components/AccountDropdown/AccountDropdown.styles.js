import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
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
