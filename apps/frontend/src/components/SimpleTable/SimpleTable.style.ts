import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"
import withStyles from "@material-ui/core/styles/withStyles"

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
