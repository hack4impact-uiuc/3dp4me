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
import { resolveObjPath } from '../../utils/object';
import useSortableData from '../../hooks/useSortableData';
import finishedIcon from '../../assets/check.svg';
import partiallyIcon from '../../assets/half-circle.svg';
import unfinishedIcon from '../../assets/exclamation.svg';
import Eyecon from '../../assets/view.svg';
import {
    LanguageDataType,
    TableHeaderType,
} from '../../utils/custom-proptypes';
import { PATIENT_STATUS } from '../../utils/constants';

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

const MainTable = ({ languageData, patients, headers, rowIds }) => {
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const UNSORTED_DATA = patients;
    const { items, requestSort, sortConfig } = useSortableData(
        patients,
        UNSORTED_DATA,
    );

    const statusStyle = {
        Finished: (
            <div>
                <img
                    alt="complete"
                    style={{ marginRight: '6px' }}
                    width="16px"
                    src={finishedIcon}
                />
                {lang.components.bottombar.finished}
            </div>
        ),
        'Partially Complete': (
            <div style={{ color: '#ff9d00' }}>
                <img
                    alt="partial"
                    style={{ marginRight: '6px' }}
                    width="16px"
                    src={partiallyIcon}
                />{' '}
                {lang.components.bottombar.partial}
            </div>
        ),
        Unfinished: (
            <div style={{ color: 'red' }}>
                <img
                    alt="incomplete"
                    style={{ marginRight: '6px' }}
                    width="16px"
                    src={unfinishedIcon}
                />{' '}
                {lang.components.bottombar.unfinished}
            </div>
        ),
        [PATIENT_STATUS.ACTIVE]: (
            <div style={{ color: '#65d991' }}>
                {lang.components.bottombar.active}
            </div>
        ),
        [PATIENT_STATUS.ARCHIVE]: (
            <div style={{ color: 'black' }}>
                <b>{lang.components.bottombar.archived}</b>
            </div>
        ),
        [PATIENT_STATUS.FEEDBACK]: (
            <div style={{ color: '#5395f8' }}>
                {lang.components.bottombar.feedback}
            </div>
        ),
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
                                    key={header.title}
                                    align={key === 'AR' ? 'right' : 'left'}
                                >
                                    <div
                                        className={
                                            key === 'AR'
                                                ? 'cell-align-rtl'
                                                : 'cell-align'
                                        }
                                    >
                                        {header.title}
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
                        {items.map((patient) => (
                            <StyledTableRow key={patient._id}>
                                {rowIds.map((id) => (
                                    <StyledTableCell
                                        className={
                                            key === 'AR' ? 'cell-rtl' : 'cell'
                                        }
                                        key={patient._id + id}
                                        align={key === 'AR' ? 'right' : 'left'}
                                    >
                                        {id === 'status' ? (
                                            <>
                                                {Object.values(
                                                    PATIENT_STATUS,
                                                ).includes(
                                                    resolveObjPath(patient, id),
                                                ) ? (
                                                    <b>
                                                        {
                                                            statusStyle[
                                                                resolveObjPath(
                                                                    patient,
                                                                    id,
                                                                )
                                                            ]
                                                        }
                                                    </b>
                                                ) : (
                                                    statusStyle[
                                                        resolveObjPath(
                                                            patient,
                                                            id,
                                                        )
                                                    ]
                                                )}
                                            </>
                                        ) : (
                                            resolveObjPath(patient, id)
                                        )}
                                    </StyledTableCell>
                                ))}
                                <StyledTableCell
                                    className="cell"
                                    align="center"
                                >
                                    <Link
                                        className="table-view-link"
                                        to={`/patient-info/${patient._id}`}
                                    >
                                        <IconButton>
                                            <img
                                                alt="status icon"
                                                width="18px"
                                                src={Eyecon}
                                            />
                                        </IconButton>{' '}
                                        {lang.components.table.view}
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

MainTable.propTypes = {
    languageData: LanguageDataType.isRequired,
    headers: PropTypes.arrayOf(TableHeaderType).isRequired,
    rowIds: PropTypes.arrayOf(PropTypes.string),
    patients: PropTypes.arrayOf(PropTypes.object),
};

export default MainTable;
