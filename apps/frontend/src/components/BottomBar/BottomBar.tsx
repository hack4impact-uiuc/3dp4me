import React, { MouseEventHandler } from 'react';
import { AppBar, Button, MenuItem, Select, Toolbar } from '@material-ui/core';
import PropTypes from 'prop-types';

import './BottomBar.scss';
import check from '../../assets/check.svg';
import exclamation from '../../assets/exclamation.svg';
import halfCircle from '../../assets/half-circle.svg';
import { LANGUAGES, STEP_STATUS } from '../../utils/constants';
import { useTranslations } from '../../hooks/useTranslations';
import { PatientStatus, StepPathToField, StepStatus } from '@3dp4me/types';

interface BottomBarProps {
    isEditing: boolean
    onAddField?: (step: string, key: StepPathToField) => void
    onStatusChange?: (status: 'status', value: StepStatus) => void
    onSave: () => void
    onDiscard: () => void
    onEdit: () => void
    status?: StepStatus
    shouldShowStatus?: boolean
    selectedStep?: string
}

const BottomBar = ({
    isEditing,
    onAddField,
    onStatusChange = () => {},
    onSave,
    onDiscard,
    onEdit,
    status = StepStatus.UNFINISHED,
    shouldShowStatus = true,
    selectedStep,
}: BottomBarProps) => {
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

    const onStatusSelected: MouseEventHandler<HTMLDivElement> = (e) => {
        onStatusChange('status', (e.target as any).value);
    }

    /**
     * Renders the dropdown for step status. If status is null, then this isn't rendered at all.
     */
    const renderStatusSelector = () => {
        if (!status || !shouldShowStatus) return null;
        const className =
            selectedLang === LANGUAGES.AR
                ? 'status-selector-ar'
                : 'status-selector';

        return (
            <Select
                className={className}
                MenuProps={{ disableScrollLock: true }}
                onClick={onStatusSelected}
                value={status}
            >
                <MenuItem value={STEP_STATUS.UNFINISHED}>
                    {translations.components.bottombar.Unfinished}
                </MenuItem>
                <MenuItem value={STEP_STATUS.PARTIALLY_FINISHED}>
                    {translations.components.bottombar.Partial}
                </MenuItem>
                <MenuItem value={STEP_STATUS.FINISHED}>
                    {translations.components.bottombar.Finished}
                </MenuItem>
            </Select>
        );
    };

    /**
     * Renders the status icon and text
     */
    const renderStatus = () => {
        if (!status || !shouldShowStatus) return null;

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

        const discardBtnClassName =
            selectedLang === LANGUAGES.AR
                ? 'discard-button-ar'
                : 'discard-button';

        return [
            <Button
                key="bottom-bar-save"
                className={saveBtnClassName}
                onClick={onSave}
            >
                {translations.components.button.save}
            </Button>,
            <Button
                key="bottom-bar-discard"
                className={discardBtnClassName}
                onClick={onDiscard}
            >
                <b>{translations.components.button.discard.title}</b>
            </Button>,
        ];
    };

    /**
     * Renders the edit controls for the bottom bar (status selector, save, discard)
     */
    const renderToolbarControls = () => {
        if (isEditing) {
            return (
                <div
                    className={
                        selectedLang === LANGUAGES.AR && !!onAddField
                            ? 'toolbar-editing-div-ar'
                            : 'toolbar-editing-div'
                    }
                >
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

    /**
     *
     * @returns Renders the controls for adding a field
     */

    const renderAddFieldButton = () => {
        let button = null;

        let buttonClassName = 'add-field-button';

        if (selectedLang !== LANGUAGES.AR) {
            buttonClassName += ` ${
                isEditing
                    ? 'add-field-expanded-width'
                    : 'add-field-retracted-width'
            }`;
        }

        if (isEditing && onAddField && selectedStep) {
            button = (
                <Button
                    className={buttonClassName}
                    onClick={() => onAddField(selectedStep, 'fields')}
                >
                    {translations.components.bottombar.addField}
                </Button>
            );
        }

        return <div className="add-field-div">{button}</div>;
    };

    // The edit steps and discard button needs to remain in the same location on the screen,
    // regardless of the language. This allows the user to keep the mouse in the same position when
    // switching between the Editing-Not Editing state. In order to allow this, the order of the
    // add field button and toolbar controls needs to flip below. This counters the flip in left-right
    // orientation made to the entire website when the language switches to Arabic.
    const controlToolbar =
        selectedLang === LANGUAGES.AR && onAddField ? (
            <>
                {renderToolbarControls()}
                {renderAddFieldButton()}
            </>
        ) : (
            <>
                {renderAddFieldButton()}
                {renderToolbarControls()}
            </>
        );

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
            <Toolbar className="bottom-toolbar">{controlToolbar}</Toolbar>
        </AppBar>
    );
};

export default BottomBar;
