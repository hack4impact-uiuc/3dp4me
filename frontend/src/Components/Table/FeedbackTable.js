import React from 'react';
<<<<<<< HEAD
import { withStyles } from '@material-ui/core/styles';
=======
import { withStyles, makeStyles } from '@material-ui/core/styles';
>>>>>>> origin/aws-backend-auth
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, IconButton, SvgIcon } from '@material-ui/core';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import Eyecon from '../../Assets/view.svg';
import './MainTable.scss';
=======
import Eyecon from '../../icons/view.svg';
>>>>>>> origin/aws-backend-auth

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

<<<<<<< HEAD
const FeebackTable = (props) => {
=======
const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
    cell: {
        borderRight: 'solid #255296 1px',
        fontSize: 17,
        padding: 0,
    },
    header: {
        borderTop: 'solid #255296 1px',
        borderBottom: 'solid #255296 1px',
        borderRight: 'solid #255296 1px',
        fontWeight: 'bolder',
        fontSize: 20,
        padding: 5,
    },
    container: {
        // maxHeight: '80vh',
        fontFamily: 'Ubuntu',
    },
});

const FeebackTable = (props) => {
    const classes = useStyles();
>>>>>>> origin/aws-backend-auth
    const lang = props.lang.data;
    const key = props.lang.key

    return (
<<<<<<< HEAD
        <TableContainer component={Paper}>
            <Table stickyHeader className="table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell className="header" align="center">{lang[key].components.table.feedbackHeaders.name}</StyledTableCell>
                        <StyledTableCell className="header" align="center">{lang[key].components.table.feedbackHeaders.serial}</StyledTableCell>
                        <StyledTableCell className="header" align="center">{lang[key].components.table.feedbackHeaders.added}</StyledTableCell>
                        <StyledTableCell className="header" align="center">{lang[key].components.table.feedbackHeaders.feedbackCycle}</StyledTableCell>
                        <StyledTableCell className="header" align="center">{lang[key].components.table.feedbackHeaders.status}</StyledTableCell>
                        <StyledTableCell className="header" align="center"></StyledTableCell>
=======
        <TableContainer className={classes.container} component={Paper}>
            <Table stickyHeader className={classes.table}>
                <TableHead>
                    <TableRow>
                        <StyledTableCell className={classes.header} align="center">{lang[key].components.table.feedbackHeaders.name}</StyledTableCell>
                        <StyledTableCell className={classes.header} align="center">{lang[key].components.table.feedbackHeaders.serial}</StyledTableCell>
                        <StyledTableCell className={classes.header} align="center">{lang[key].components.table.feedbackHeaders.added}</StyledTableCell>
                        <StyledTableCell className={classes.header} align="center">{lang[key].components.table.feedbackHeaders.feedbackCycle}</StyledTableCell>
                        <StyledTableCell className={classes.header} align="center">{lang[key].components.table.feedbackHeaders.status}</StyledTableCell>
                        <StyledTableCell className={classes.header} align="center"></StyledTableCell>
>>>>>>> origin/aws-backend-auth
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.patients.map((patient) => (
                        <StyledTableRow  key={patient.serial}>
<<<<<<< HEAD
                            <StyledTableCell className="cell" align="center">{patient.name}</StyledTableCell>
                            <StyledTableCell className="cell" align="center">{patient.serial}</StyledTableCell>
                            <StyledTableCell className="cell" align="center">{patient.createdDate}</StyledTableCell>
                            <StyledTableCell className="cell" align="center">{patient.cycle}</StyledTableCell>
                            <StyledTableCell className="cell" align="center">{patient.status}</StyledTableCell>
                            <StyledTableCell className="cell" align="center">
=======
                            <StyledTableCell className={classes.cell} align="center">{patient.name}</StyledTableCell>
                            <StyledTableCell className={classes.cell} align="center">{patient.serial}</StyledTableCell>
                            <StyledTableCell className={classes.cell} align="center">{patient.createdDate}</StyledTableCell>
                            <StyledTableCell className={classes.cell} align="center">{patient.cycle}</StyledTableCell>
                            <StyledTableCell className={classes.cell} align="center">{patient.status}</StyledTableCell>
                            <StyledTableCell className={classes.cell} align="center">
>>>>>>> origin/aws-backend-auth
                                <Link to={`/patient-info/${patient.serial}`}>
                                    <IconButton>
                                        {/* <VisibilityIcon /> */}
                                        <img width={20} src={Eyecon} />
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

export default FeebackTable;