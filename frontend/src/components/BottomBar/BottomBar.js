import React from 'react';
import { AppBar, Button, MenuItem, Select, Toolbar } from '@material-ui/core';

import { LanguageDataType } from '../../utils/custom-proptypes';
import './BottomBar.scss';
import check from '../../assets/check.svg';
import exclamation from '../../assets/exclamation.svg';
import halfCircle from '../../assets/half-circle.svg';

const BottomBar = (props) => {
    const key = props.languageData.selectedLanguage;
    const lang = props.languageData.translations[key];

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
                    {`${lang.components.bottombar.lastEdit.split('...')[0]} ${
                        props.lastEditedBy
                    } ${lang.components.bottombar.lastEdit.split('...')[1]} ${
                        props.lastEdited
                    }`}
                </div>
                {props.edit ? (
                    <div>
                        {key !== 'AR' ? (
                            <div>
                                <Select
                                    className="status-selector"
                                    MenuProps={{ disableScrollLock: true }}
                                    onClick={(e) => props.status.setStatus(e)}
                                    defaultValue={props.status.value}
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
                                    onClick={() => props.save()}
                                >
                                    {lang.components.button.save}
                                </Button>
                                <Button
                                    className="discard-button"
                                    onClick={() => props.discard.setState()}
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
                                    onClick={(e) => props.status.setStatus(e)}
                                    defaultValue={props.status.value}
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
                                    onClick={() => props.save()}
                                >
                                    {lang.components.button.save}
                                </Button>
                                <Button
                                    className="discard-button"
                                    onClick={() => props.discard.setState()}
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
                            className={`status ${props.status.value}`}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            {statusIcons[props.status.value]}{' '}
                            {lang.components.bottombar[props.status.value]}
                        </div>
                        <Button
                            className="edit-button"
                            onClick={() => props.setEdit(true)}
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
};

export default BottomBar;
