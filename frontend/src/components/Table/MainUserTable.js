import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import './MainTable.scss';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import useSortableData from '../../hooks/useSortableData';
import finishedIcon from '../../assets/check.svg';
import partiallyIcon from '../../assets/half-circle.svg';
import unfinishedIcon from '../../assets/exclamation.svg';
import Eyecon from '../../assets/view.svg';
import {
    LanguageDataType,
    TableHeaderType,
} from '../../utils/custom-proptypes';
import { ACCESS_STATUS } from '../../utils/constants';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black,
    },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
    root: {
        '&:hover': {
            backgroundColor: '#f0f0f0',
        },
    },
}))(TableRow);

const MainUserTable = ({ languageData, users, headers }) => {
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const UNSORTED_DATA = users;
    const { items, requestSort, sortConfig } = useSortableData(
        users,
        UNSORTED_DATA,
    );

    const statusStyle = {
        [ACCESS_STATUS.ACTIVE]: (
            <div style={{ color: '#65d991' }}>
                {lang.components.accountManagement.access.active}
            </div>
        ),
        [ACCESS_STATUS.NOTASSIGNED]: (
            <div style={{ color: 'red' }}>
                <b>{lang.components.accountManagement.access.notAssigned}</b>
            </div>
        ),
        [ACCESS_STATUS.REVOKED]: (
            <div style={{ color: 'red' }}>
                {lang.components.accountManagement.access.revoked}
            </div>
        ),
    };

    const getInfo = (user, atr) => {
        const attr = user.Attributes.find(
            (attribute) => attribute.Name === atr,
        );
        if (attr == undefined) return statusStyle[ACCESS_STATUS.NOTASSIGNED];
        if (attr.Value === 'GRANTED') return statusStyle[ACCESS_STATUS.ACTIVE];
        return attr.Value;
    };

    const getRoles = (user, atr) => {
        const attr = user.Attributes.find(
            (attribute) => attribute.Name === atr,
        );
        if (attr == undefined) return 'Not Assigned';
        const at = attr.Value;
        const att = at.toString();
        return att;
    };
    return (
        <div className="table-container">
            <TableContainer className="table-container" component={Paper}>
                <Table stickyHeader className="table">
                    <TableHead>
                        <TableRow>
                            {headers.map((header) => (
                                <StyledTableCell
                                    onClick={() => requestSort(header.sortKey)}
                                    className="header"
                                    key={header}
                                    align={key === 'AR' ? 'right' : 'left'}
                                >
                                    <div
                                        className={
                                            key === 'AR'
                                                ? 'cell-align-rtl'
                                                : 'cell-align'
                                        }
                                    >
                                        {header}
                                        {sortConfig !== null &&
                                        sortConfig.key === header.sortKey &&
                                        sortConfig.direction === 'ascending' ? (
                                            <ArrowDropUpIcon className="dropdown-arrow" />
                                        ) : (
                                            <></>
                                        )}
                                        {sortConfig !== null &&
                                        sortConfig.key === header.sortKey &&
                                        sortConfig.direction ===
                                            'descending' ? (
                                            <ArrowDropDownIcon className="dropdown-arrow" />
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </StyledTableCell>
                            ))}
                            <StyledTableCell
                                className="header"
                                align="center"
                            />
                        </TableRow>
                    </TableHead>
                    <TableBody className="table-body">
                        {items.map((user) => (
                            <StyledTableRow key={user._id}>
                                <StyledTableCell>
                                    {getInfo(user, 'name')}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {getInfo(user, 'email')}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {getRoles(user, 'custom:security_roles')}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {getInfo(user, 'custom:access')}
                                </StyledTableCell>
                                <StyledTableCell
                                    className="cell"
                                    align="center"
                                >
                                    <Link className="table-view-link">
                                        <IconButton>
                                            <img
                                                alt="status icon"
                                                width="18px"
                                                src={Eyecon}
                                            />
                                        </IconButton>{' '}
                                        {lang.components.table.edit}
                                    </Link>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

MainUserTable.propTypes = {
    languageData: LanguageDataType.isRequired,
    headers: PropTypes.arrayOf(TableHeaderType).isRequired,
    users: PropTypes.arrayOf(PropTypes.object),
};

export default MainUserTable;
