import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, IconButton, SvgIcon } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Eyecon from '../../Assets/view.svg';
import './MainTable.scss';

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

const FeebackTable = (props) => {
    const lang = props.lang.data;
    const key = props.lang.key

    return (
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.patients.map((patient) => (
                        <StyledTableRow  key={patient.serial}>
                            <StyledTableCell className="cell" align="center">{patient.name}</StyledTableCell>
                            <StyledTableCell className="cell" align="center">{patient.serial}</StyledTableCell>
                            <StyledTableCell className="cell" align="center">{patient.createdDate}</StyledTableCell>
                            <StyledTableCell className="cell" align="center">{patient.cycle}</StyledTableCell>
                            <StyledTableCell className="cell" align="center">{patient.status}</StyledTableCell>
                            <StyledTableCell className="cell" align="center">
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