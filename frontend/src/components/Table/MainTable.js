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
import Eyecon from '../../assets/view.svg';
import './MainTable.scss';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import useSortableData from '../../hooks/useSortableData';
import finishedIcon from '../../assets/check.svg';
import partiallyIcon from '../../assets/half-circle.svg';
import unfinishedIcon from '../../assets/exclamation.svg';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black,
    }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        // '&:nth-of-type(odd)': {
        //     backgroundColor: '#e5f0ff'
        // },
        '&:hover': {
            backgroundColor: '#f0f0f0',
        }
    },
}))(TableRow);

const MainTable = (props) => {
    const lang = props.lang.data;
    const key = props.lang.key;

    const { items, requestSort, sortConfig } = useSortableData(props.patients);

    const statusStyle = {
        "Finished": <div><img style={{marginRight: '6px'}} width="16px" src={finishedIcon} />{lang[key].components.bottombar.finished}</div>,
        "Partially Complete": <div style={{color: '#ff9d00'}}><img style={{marginRight: '6px'}} width="16px" src={partiallyIcon} /> {lang[key].components.bottombar.partial}</div>,
        "Unfinished": <div style={{color: 'red'}}><img style={{marginRight: '6px'}} width="16px" src={unfinishedIcon} /> {lang[key].components.bottombar.unfinished}</div>
    }

    return (
        <div className="table-container">
            <TableContainer className="table-container" component={Paper}>
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
                    <TableBody className="table-body">
                        {items.map((patient) => (
                            <StyledTableRow key={patient.serial}>
                                {props.rowIds.map(id => (
                                    <StyledTableCell className={key === "AR" ? "cell-rtl" : "cell"} align={key === "AR" ? "right" : "left"}>
                                        {id === "status" ? (
                                            statusStyle[patient[id]]
                                        ) : (
                                            patient[id]
                                        )}
                                    </StyledTableCell>

                                ))}
                                <StyledTableCell className="cell" align="center">
                                    <Link className="table-view-link" to={`/patient-info/${patient.serial}`}>
                                        <IconButton>
                                            <img width="18px" src={Eyecon} />
                                        </IconButton> {lang[key].components.table.view}
                                    </Link>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    );
}

export default MainTable;