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
    isEditing,
    lastEdited,
    lastEditedBy,
    onStatusChange,
    onSave,
    onDiscard,
    onEdit,
    status = null,
    style = null,
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

    /**
     * Renders the dropdown for step status. If status is null, then this isn't rendered at all.
     */
    const renderStatusSelector = () => {
        if (!status) return null;
        const className =
            selectedLang === LANGUAGES.AR
                ? 'status-selector-ar'
                : 'status-selector';

        return (
            <Select
                className={className}
                MenuProps={{ disableScrollLock: true }}
                onClick={(e) => onStatusChange('status', e.target.value)}
                defaultValue={status}
            >
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

    /**
     * Renders the status icon and text
     */
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

    /**
     * Renders the discard and save buttons side by side
     */
    const renderDiscardAndSaveButtons = () => {
        const saveBtnClassName =
            selectedLang === LANGUAGES.AR ? 'save-button-ar' : 'save-button';

        return [
            <Button className={saveBtnClassName} onClick={onSave}>
                {translations.components.button.save}
            </Button>,
            <Button className="discard-button" onClick={onDiscard}>
                <b>{translations.components.button.discard.title}</b>
            </Button>,
        ];
    };

    /**
     * Renders all of the controls for the bottom bar (status selector, save, discard)
     */
    const renderToolbarControls = () => {
        if (isEditing) {
            return (
                <div>
                    {renderStatusSelector()}
                    {renderDiscardAndSaveButtons()}
                </div>
            );
        }

        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {renderStatus()}
                <Button className="edit-button" onClick={() => onEdit()}>
                    {translations.components.button.edit}
                </Button>
            </div>
        );
    };

    const getLastEditedString = () => {
        if (!lastEdited || !lastEditedBy) return '';

        const lastEditedDate = formatDate(new Date(lastEdited), selectedLang);
        return `${translations.components.bottombar.lastEditedBy} ${lastEditedBy} ${translations.components.bottombar.on} ${lastEditedDate}`;
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
                {renderToolbarControls()}
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
