import React from 'react';
import { AppBar, Button, MenuItem, Select, Toolbar } from '@material-ui/core';
import PropTypes from 'prop-types';

import { formatDate } from '../../utils/date';
import './BottomBar.scss';
import check from '../../assets/check.svg';
import exclamation from '../../assets/exclamation.svg';
import halfCircle from '../../assets/half-circle.svg';
import { LANGUAGES, STEP_STATUS } from '../../utils/constants';
import { useTranslations } from '../../hooks/useTranslations';

const BottomBar = ({
    edit,
    lastEdited,
    lastEditedBy,
    status = null,
    style = null,
    onStatusChange,
    onSave,
    onDiscard,
    setEdit,
}) => {
    const [translations, selectedLang] = useTranslations();

    const statusIcons = {
        [STEP_STATUS.FINISHED]: (
            <img alt="complete" src={check} className="status-icon" />
        ),
        [STEP_STATUS.UNFINISHED]: (
            <img alt="incomplete" src={exclamation} className="status-icon" />
        ),
        [STEP_STATUS.PARTIALLY_FINISHED]: (
            <img alt="partial" src={halfCircle} className="status-icon" />
        ),
    };

    const renderStatusSelector = () => {
        if (!status) return null;

        return (
            <Select
                className="status-selector"
                MenuProps={{ disableScrollLock: true }}
                onClick={(e) => onStatusChange('status', e.target.value)}
                defaultValue={status}
            >
                <MenuItem disabled value="default">
                    {translations.components.bottombar.default}
                </MenuItem>
                <MenuItem value={STEP_STATUS.UNFINISHED}>
                    {translations.components.bottombar.unfinished}
                </MenuItem>
                <MenuItem value={STEP_STATUS.PARTIALLY_FINISHED}>
                    {translations.components.bottombar.partial}
                </MenuItem>
                <MenuItem value={STEP_STATUS.FINISHED}>
                    {translations.components.bottombar.finished}
                </MenuItem>
            </Select>
        );
    };

    const renderStatus = () => {
        if (!status) return null;

        return (
            <div
                className={`status ${status}`}
                style={{ display: 'flex', alignItems: 'center' }}
            >
                {statusIcons[status]}{' '}
                {translations.components.bottombar[status]}
            </div>
        );
    };

    const getLastEditedString = () => {
        if (!lastEdited || !lastEditedBy) return '';

        return `${
            translations.components.bottombar.lastEditedBy
        } ${lastEditedBy} ${translations.components.bottombar.on} ${formatDate(
            new Date(lastEdited),
            selectedLang,
        )}`;
    };

    return (
        <AppBar
            className="bottom-bar-wrapper"
            color="inherit"
            style={{
                top: 'auto',
                bottom: '0',
                boxShadow: '0 0px 4px 2px rgba(0, 0, 0, 0.15)',
            }}
        >
            <Toolbar className="bottom-toolbar">
                <div className="editor-section" style={style?.editorSection}>
                    {getLastEditedString()}
                </div>
                {edit ? (
                    <div>
                        {selectedLang !== LANGUAGES.AR ? (
                            <div>
                                {renderStatusSelector()}
                                <Button
                                    className="save-button"
                                    onClick={onSave}
                                >
                                    {translations.components.button.save}
                                </Button>
                                <Button
                                    className="discard-button"
                                    onClick={onDiscard}
                                >
                                    <b>
                                        {
                                            translations.components.button
                                                .discard.title
                                        }
                                    </b>
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <Select
                                    className="status-selector-ar"
                                    MenuProps={{ disableScrollLock: true }}
                                    onClick={(e) =>
                                        onStatusChange('status', e.target.value)
                                    }
                                    defaultValue={status}
                                >
                                    <MenuItem disabled value="default">
                                        {
                                            translations.components.bottombar
                                                .default
                                        }
                                    </MenuItem>
                                    <MenuItem value={STEP_STATUS.UNFINISHED}>
                                        {
                                            translations.components.bottombar
                                                .unfinished
                                        }
                                    </MenuItem>
                                    <MenuItem
                                        value={STEP_STATUS.PARTIALLY_FINISHED}
                                    >
                                        {
                                            translations.components.bottombar
                                                .partial
                                        }
                                    </MenuItem>
                                    <MenuItem value={STEP_STATUS.FINISHED}>
                                        {
                                            translations.components.bottombar
                                                .finished
                                        }
                                    </MenuItem>
                                </Select>
                                <Button
                                    className="save-button-ar"
                                    onClick={onSave}
                                >
                                    {translations.components.button.save}
                                </Button>
                                <Button
                                    className="discard-button"
                                    onClick={onDiscard}
                                >
                                    <b>
                                        {
                                            translations.components.button
                                                .discard.title
                                        }
                                    </b>
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {renderStatus()}
                        <Button
                            className="edit-button"
                            onClick={() => setEdit(true)}
                        >
                            {translations.components.button.edit}
                        </Button>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );
};

BottomBar.propTypes = {
    style: PropTypes.object,
    edit: PropTypes.bool.isRequired,
    lastEdited: PropTypes.string,
    lastEditedBy: PropTypes.string,
    status: PropTypes.string,
    onStatusChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDiscard: PropTypes.func.isRequired,
    setEdit: PropTypes.func.isRequired,
};

export default BottomBar;
