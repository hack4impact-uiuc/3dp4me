import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button, IconButton, SvgIcon } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Eyecon from '../../icons/view.svg';
import './MainTable.css';
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

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
    cell: {
        borderRight: 'solid #255296 1px',
        fontSize: 17,
        padding: 0,
        paddingLeft: '20px'
    },
    cellRtl: {
        borderRight: 'solid #255296 1px',
        fontSize: 17,
        padding: 0,
        paddingRight: '30px'
    },
    header: {
        borderTop: 'solid #255296 1px',
        borderBottom: 'solid #255296 1px',
        borderRight: 'solid #255296 1px',
        fontWeight: 'bolder',
        fontSize: 20,
        maxWidth: '100px',
        minWidth: '100px',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    container: {
        // maxHeight: '80vh',
        fontFamily: 'Ubuntu',
    },
    arrowSize: {
        fontSize: 25,
    },
    align: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'left',
        marginLeft: '5px'
    },
    alignRtl: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'right',
        marginRight: '5px'
    }
});

const MainTable = (props) => {
    const classes = useStyles();
    const lang = props.lang.data;
    const key = props.lang.key;

    const { items, requestSort, sortConfig } = useSortableData(props.patients);

    return (
        <TableContainer className={classes.container} component={Paper}>
            <Table stickyHeader className={classes.table}>
                <TableHead>
                    <TableRow>
                        {props.headers.map(header => (
                            <StyledTableCell onClick={() => requestSort(header.sortKey)} className={classes.header} align={key === "AR" ? "right" : "left"}>
                                <div className={key === "AR" ? classes.alignRtl : classes.align}>
                                    {header.title}
                                    {sortConfig !== null && sortConfig.key === header.sortKey && sortConfig.direction === "ascending" ? (
                                        <ArrowDropUpIcon className={classes.arrowSize} />
                                    ) : (<></>)}
                                    {sortConfig !== null && sortConfig.key === header.sortKey && sortConfig.direction === "descending" ? (
                                        <ArrowDropDownIcon className={classes.arrowSize} />
                                    ) : (<></>)}
                                </div>
                            </StyledTableCell>
                        ))}
                        <StyledTableCell className={classes.header} align="center"></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((patient) => (
                        <StyledTableRow key={patient.serial}>
                            {props.rowIds.map(id => (
                                <StyledTableCell className={key === "AR" ? classes.cellRtl : classes.cell} align={key === "AR" ? "right" : "left"}>{patient[id]}</StyledTableCell>
                            ))}
                            <StyledTableCell className={classes.cell} align="center">
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