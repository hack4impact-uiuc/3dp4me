import { styled } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
}))

export const StyledTableRow = styled(TableRow)`
    '&:hover': {
        backgroundColor: '#f0f0f0';
    }
`
