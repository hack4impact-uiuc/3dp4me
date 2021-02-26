import React from 'react';
import { AppBar, Button, MenuItem, Select, Toolbar } from '@material-ui/core';
import PropTypes from 'prop-types';

import './BottomBar.scss';
import check from '../../assets/check.svg';
import exclamation from '../../assets/exclamation.svg';
import halfCircle from '../../assets/half-circle.svg';
import {
    StringGetterSetterType,
    BoolGetterSetterType,
    LanguageDataType,
} from '../../utils/custom-proptypes';

const BottomBar = ({
    languageData,
    edit,
    lastEdited,
    lastEditedBy,
    status,
    onStatusChange,
    onSave,
    onDiscard,
    setEdit,
}) => {
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const statusIcons = {
        finished: <img alt="complete" src={check} className="status-icon" />,
        unfinished: (
            <img alt="incomplete" src={exclamation} className="status-icon" />
        ),
        partial: <img alt="partial" src={halfCircle} className="status-icon" />,
    };
    return (
        <AppBar
            className="bottom-bar-wrapper"
            color="white"
            style={{
                top: 'auto',
                bottom: '0',
                boxShadow: '0 0px 4px 2px rgba(0, 0, 0, 0.15)',
            }}
        >
            <Toolbar className="bottom-toolbar">
                <div
                    className="editor-section"
                    style={{ flexGrow: 1, color: 'black' }}
                >
                    {`${
                        lang.components.bottombar.lastEdit.split('...')[0]
                    } ${lastEditedBy} ${
                        lang.components.bottombar.lastEdit.split('...')[1]
                    } ${lastEdited}`}
                </div>
                {edit ? (
                    <div>
                        {key !== 'AR' ? (
                            <div>
                                <Select
                                    className="status-selector"
                                    MenuProps={{ disableScrollLock: true }}
                                    onClick={(e) =>
                                        onStatusChange('status', e.target.value)
                                    }
                                    defaultValue={status}
                                >
                                    <MenuItem disabled value="default">
                                        {lang.components.bottombar.default}
                                    </MenuItem>
                                    <MenuItem value="unfinished">
                                        {lang.components.bottombar.unfinished}
                                    </MenuItem>
                                    <MenuItem value="partial">
                                        {lang.components.bottombar.partial}
                                    </MenuItem>
                                    <MenuItem value="finished">
                                        {lang.components.bottombar.finished}
                                    </MenuItem>
                                </Select>
                                <Button
                                    className="save-button"
                                    onClick={onSave}
                                >
                                    {lang.components.button.save}
                                </Button>
                                <Button
                                    className="discard-button"
                                    onClick={onDiscard}
                                >
                                    <b>
                                        {lang.components.button.discard.title}
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
                                        {lang.components.bottombar.default}
                                    </MenuItem>
                                    <MenuItem value="unfinished">
                                        {lang.components.bottombar.unfinished}
                                    </MenuItem>
                                    <MenuItem value="partial">
                                        {lang.components.bottombar.partial}
                                    </MenuItem>
                                    <MenuItem value="finished">
                                        {lang.components.bottombar.finished}
                                    </MenuItem>
                                </Select>
                                <Button
                                    className="save-button-ar"
                                    onClick={onSave}
                                >
                                    {lang.components.button.save}
                                </Button>
                                <Button
                                    className="discard-button"
                                    onClick={onDiscard}
                                >
                                    <b>
                                        {lang.components.button.discard.title}
                                    </b>
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                            className={`status ${status}`}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            {statusIcons[status]}{' '}
                            {lang.components.bottombar[status]}
                        </div>
                        <Button
                            className="edit-button"
                            onClick={() => setEdit(true)}
                        >
                            {lang.components.button.edit}
                        </Button>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );
};

BottomBar.propTypes = {
    languageData: LanguageDataType.isRequired,
    edit: PropTypes.bool.isRequired,
    lastEdited: PropTypes.string.isRequired,
    lastEditedBy: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    onStatusChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDiscard: BoolGetterSetterType.isRequired,
    setEdit: PropTypes.func.isRequired,
};

export default BottomBar;
