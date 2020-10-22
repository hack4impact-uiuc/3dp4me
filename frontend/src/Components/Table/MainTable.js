import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@material-ui/icons/Visibility';
import './MainTable.css'

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black,
    }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#e5f0ff'
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
    cell: {
        borderRight: 'solid #255296 1px',
        fontSize: 17,
    },
    header: {
        borderTop: 'solid #255296 1px',
        borderBottom: 'solid #255296 1px',
        borderRight: 'solid #255296 1px',
        fontWeight: 'bolder',
        fontSize: 20
    },
    container: {
        // maxHeight: '80vh',
        fontFamily: 'Ubuntu',
    },
});

const MainTable = (props) => {
    const classes = useStyles();

    return (
        <TableContainer className={classes.container} component={Paper}>
            <Table stickyHeader className={classes.table}>
                <TableHead>
                    <TableRow>
                        <StyledTableCell className={classes.header} align="center">Name</StyledTableCell>
                        <StyledTableCell className={classes.header} align="center">Serial</StyledTableCell>
                        <StyledTableCell className={classes.header} align="center">Date Added</StyledTableCell>
                        <StyledTableCell className={classes.header} align="center">Last Edit By</StyledTableCell>
                        <StyledTableCell className={classes.header} align="center">Status</StyledTableCell>
                        <StyledTableCell className={classes.header} align="center"></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.patients.map((patient) => (
                        <StyledTableRow  key={patient.serial}>
                            <StyledTableCell className={classes.cell} align="center">{patient.name}</StyledTableCell>
                            <StyledTableCell className={classes.cell} align="center">{patient.serial}</StyledTableCell>
                            <StyledTableCell className={classes.cell} align="center">{patient.createdDate}</StyledTableCell>
                            <StyledTableCell className={classes.cell} align="center">{patient.lastEdited}</StyledTableCell>
                            <StyledTableCell className={classes.cell} align="center">{patient.status}</StyledTableCell>
                            <StyledTableCell className={classes.cell} align="center">
                                <Link to={`/patient-info/${patient.serial}`}>
                                    <IconButton>
                                        <VisibilityIcon />
                                    </IconButton>
                                </Link>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default MainTable;