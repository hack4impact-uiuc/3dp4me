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
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

import { resolveObjPath } from '../../utils/object';
import useSortableData from '../../hooks/useSortableData';
import finishedIcon from '../../assets/check.svg';
import partiallyIcon from '../../assets/half-circle.svg';
import unfinishedIcon from '../../assets/exclamation.svg';
import Eyecon from '../../assets/view.svg';
import { TableHeaderType } from '../../utils/custom-proptypes';
import {
    LANGUAGES,
    PATIENT_STATUS,
    SIGNATURE_STATUS,
} from '../../utils/constants';
import { formatDate } from '../../utils/date';
import { useTranslations } from '../../hooks/useTranslations';

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

const MainTable = ({ patients, headers, rowIds }) => {
    const [translations, selectedLang] = useTranslations();

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
                {translations.components.bottombar.finished}
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
                {translations.components.bottombar.partial}
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
                {translations.components.bottombar.unfinished}
            </div>
        ),
        [PATIENT_STATUS.ACTIVE]: (
            <div style={{ color: '#65d991' }}>
                {translations.components.bottombar.active}
            </div>
        ),
        [PATIENT_STATUS.ARCHIVE]: (
            <div style={{ color: 'black' }}>
                <b>{translations.components.bottombar.archived}</b>
            </div>
        ),
        [PATIENT_STATUS.FEEDBACK]: (
            <div style={{ color: '#5395f8' }}>
                {translations.components.bottombar.feedback}
            </div>
        ),
    };

    const signatureStyles = {
        [SIGNATURE_STATUS.SIGNED]: (
            <div style={{ color: '#65d991' }}>
                <CheckIcon />
            </div>
        ),
        [SIGNATURE_STATUS.UNSIGNED]: (
            <div style={{ color: 'red' }}>
                <CloseIcon />
            </div>
        ),
    };

    const getPatientField = (patient, fieldKey, fieldType) => {
        const rawData = resolveObjPath(patient, fieldKey);
        switch (fieldType) {
            case FIELD_TYPES.STRING:
            case FIELD_TYPES.NUMBER:
                return rawData;
            case FIELD_TYPES.DATE:
                return formatDate(new Date(rawData), key);
            case FIELD_TYPES.SIGNATURE: {
                const status = rawData?.signatureData?.length
                    ? SIGNATURE_STATUS.SIGNED
                    : SIGNATURE_STATUS.UNSIGNED;
                return signatureStyles[status];
            }
            default:
                return rawData;
        }
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
                                    align={
                                        selectedLang === LANGUAGES.AR
                                            ? 'right'
                                            : 'left'
                                    }
                                >
                                    <div
                                        className={
                                            selectedLang === LANGUAGES.AR
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
                                {rowData.map(({ id, dataType }) => (
                                    <StyledTableCell
                                        className={
                                            selectedLang === LANGUAGES.AR
                                                ? 'cell-rtl'
                                                : 'cell'
                                        }
                                        key={patient._id + id}
                                        align={
                                            selectedLang === LANGUAGES.AR
                                                ? 'right'
                                                : 'left'
                                        }
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
                                            getPatientField(
                                                patient,
                                                id,
                                                dataType,
                                            )
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
                                        {translations.components.table.view}
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
    headers: PropTypes.arrayOf(TableHeaderType).isRequired,
    rowData: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            dataType: PropTypes.string,
        }),
    ),
    patients: PropTypes.arrayOf(PropTypes.object),
};

export default MainTable;
