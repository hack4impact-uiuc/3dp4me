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
import { IconButton, Button } from '@material-ui/core';
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
import { ACCESS_LEVELS } from '../../utils/constants';

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

const MainUserTable = ({
    languageData,
    users,
    roleData,
    headers,
    onUserSelected,
}) => {
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];
    const UNSORTED_DATA = users;
    const { items, requestSort, sortConfig } = useSortableData(
        users,
        UNSORTED_DATA,
    );

    const statusStyle = {
        [ACCESS_LEVELS.GRANTED]: (
            <div style={{ color: '#65d991' }}>
                {lang.accountManagement.Approved}
            </div>
        ),
        [ACCESS_LEVELS.PENDING]: (
            <div style={{ color: 'red' }}>
                <b>{lang.accountManagement.Pending}</b>
            </div>
        ),
        [ACCESS_LEVELS.REVOKED]: (
            <div style={{ color: 'red' }}>{lang.accountManagement.Revoked}</div>
        ),
    };

    const getInfo = (user, atr) => {
        return user?.Attributes?.find((attribute) => attribute.Name === atr)
            ?.Value;
    };

    const getAccessLevelValue = (user) => {
        return getInfo(user, 'custom:access') || ACCESS_LEVELS.PENDING;
    };

    const getAccessLevel = (user) => {
        const access = getAccessLevelValue(user);
        return statusStyle[access];
    };

    const getName = (user) => {
        return getInfo(user, 'name') || user.Username;
    };

    const getRolesValue = (user) => {
        const info = getInfo(user, 'custom:security_roles');
        return info ? JSON.parse(info) : [];
    };

    const getRoles = (user) => {
        let roles = getRolesValue(user);
        if (roles.length == 0) return 'Not Assigned';

        roles = roles.map((r) => {
            for (let i = 0; i < roleData.length; i += 1) {
                if (r === roleData[i]._id) return roleData[i]?.Question[key];
            }

            return 'Unrecognized role';
        });

        return roles.join(', ');
    };

    const onSelected = (item) => {
        onUserSelected({
            userName: getName(item),
            userEmail: getInfo(item, 'email'),
            roles: getRolesValue(item),
            accessLevel: getAccessLevelValue(item),
        });
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
                                    {getName(user)}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {getInfo(user, 'email')}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {getRoles(user)}
                                </StyledTableCell>
                                <StyledTableCell>
                                    {getAccessLevel(user)}
                                </StyledTableCell>
                                <StyledTableCell
                                    className="cell"
                                    align="center"
                                >
                                    <IconButton
                                        onClick={() => onSelected(user)}
                                    >
                                        <img
                                            alt="status icon"
                                            width="18px"
                                            src={Eyecon}
                                        />
                                    </IconButton>{' '}
                                    {lang.components.table.edit}
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
