const { makeStyles } = require('@material-ui/core');

export const useStyles = makeStyles((theme: any) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        boxShadow: '0px 0px 4px 0 rgba(0,0,0,0.25)',
    },
    toolBar: {
        minHeight: '48px',
    },
    navTitle: {
        fontWeight: 'bold',
    },
}));
