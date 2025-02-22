import withStyles from '@mui/styles/withStyles';
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

export const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black,
    },
}))(TableCell)

export const StyledTableRow = withStyles(() => ({
    root: {
        '&:hover': {
            backgroundColor: '#f0f0f0',
        },
    },
}))(TableRow)
