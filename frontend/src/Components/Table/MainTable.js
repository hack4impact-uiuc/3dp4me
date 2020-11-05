import React, { useState, useEffect } from 'react';
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
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import useSortableData from '../../Hooks/useSortableData'

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

const MainTable = (props) => {
    const lang = props.lang.data;
    const key = props.lang.key;

    const { items, requestSort, sortConfig } = useSortableData(props.patients);

    return (
        <TableContainer component={Paper}>
            <Table stickyHeader className="table">
                <TableHead>
                    <TableRow>
                        {props.headers.map(header => (
                            <StyledTableCell onClick={() => requestSort(header.sortKey)} className="header" align={key === "AR" ? "right" : "left"}>
                                <div className={key === "AR" ? "cell-align-rtl" : "cell-align"}>
                                    {header.title}
                                    {sortConfig !== null && sortConfig.key === header.sortKey && sortConfig.direction === "ascending" ? (
                                        <ArrowDropUpIcon className="dropdown-arrow" />
                                    ) : (<></>)}
                                    {sortConfig !== null && sortConfig.key === header.sortKey && sortConfig.direction === "descending" ? (
                                        <ArrowDropDownIcon className="dropdown-arrow" />
                                    ) : (<></>)}
                                </div>
                            </StyledTableCell>
                        ))}
                        <StyledTableCell className="header" align="center"></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((patient) => (
                        <StyledTableRow key={patient.serial}>
                            {props.rowIds.map(id => (
                                <StyledTableCell className={key === "AR" ? "cell-rtl" : "cell"} align={key === "AR" ? "right" : "left"}>{patient[id]}</StyledTableCell>
                            ))}
                            <StyledTableCell className="cell" align="center">
                                <Link to={`/patient-info/${patient.serial}`}>
                                    <IconButton>
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

export default MainTable;