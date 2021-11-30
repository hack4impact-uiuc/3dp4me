import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
    menuWrapper: {
        margin: '10px',
        width: 'fit-content',
        display: 'block',
    },
    accountEmail: {
        color: 'grey',
        lineHeight: '0px',
    },
    languageSelector: {
        height: '50px',
    },
    signOutButton: {
        height: '38px',
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: '#ca0909',
        color: 'white',
        marginTop: '10px',
        width: '100%',
        '&:hover': {
            background: '#ca0909',
        },
    },
});
