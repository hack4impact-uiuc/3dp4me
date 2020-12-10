import React from 'react';
import { AppBar, Button, MenuItem, Select, Toolbar } from '@material-ui/core';
import './BottomBar.scss';
import check from '../../assets/check.svg';
import exclamation from '../../assets/exclamation.svg';
import halfCircle from '../../assets/half-circle.svg';


const BottomBar = (props) => {

    const lang = props.lang.data;
    const key = props.lang.key;

    const statusIcons = {
        finished: <img alt="complete" src={check} className="status-icon" />,
        unfinished: <img alt="incomplete" src={exclamation} className="status-icon" />,
        partial: <img alt="partial" src={halfCircle} className="status-icon" />
    }
    return (
        <AppBar className="bottom-bar-wrapper" color="white" style={{ top: 'auto', bottom: '0', boxShadow: "0 0px 4px 2px rgba(0, 0, 0, 0.15)" }}>
            <Toolbar className="bottom-toolbar">
                <div style={{ flexGrow: 1 }} />
                {props.edit ? (
                    <div>
                        {key !== "AR" ? (
                            <div>
                                <Select className="status-selector" MenuProps={{ disableScrollLock: true }} onClick={(e) => props.status.setStatus(e)} defaultValue={props.status.value}>
                                    <MenuItem disabled value="default">{lang[key].components.bottombar.default}</MenuItem>
                                    <MenuItem value="unfinished">{lang[key].components.bottombar.unfinished}</MenuItem>
                                    <MenuItem value="partial">{lang[key].components.bottombar.partial}</MenuItem>
                                    <MenuItem value="finished">{lang[key].components.bottombar.finished}</MenuItem>
                                </Select>
                                <Button className="save-button" onClick={() => props.save()}>{lang[key].components.button.save}</Button>
                                <Button className="discard-button" onClick={() => props.discard.setState()}><b>{lang[key].components.button.discard.title}</b></Button>
                            </div>
                        ) : (
                            <div>
                                <Select className="status-selector-ar" MenuProps={{ disableScrollLock: true }} onClick={(e) => props.status.setStatus(e)} defaultValue={props.status.value}>
                                    <MenuItem disabled value="default">{lang[key].components.bottombar.default}</MenuItem>
                                    <MenuItem value="unfinished">{lang[key].components.bottombar.unfinished}</MenuItem>
                                    <MenuItem value="partial">{lang[key].components.bottombar.partial}</MenuItem>
                                    <MenuItem value="finished">{lang[key].components.bottombar.finished}</MenuItem>
                                </Select>
                                <Button className="save-button-ar" onClick={() => props.save()}>{lang[key].components.button.save}</Button>
                                <Button className="discard-button" onClick={() => props.discard.setState()}><b>{lang[key].components.button.discard.title}</b></Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div className={`status ${props.status.value}`} style={{display: 'flex', alignItems: 'center'}}>
                            {statusIcons[props.status.value]} {lang[key].components.bottombar[props.status.value]}
                        </div>
                        <Button className="edit-button" onClick={() => props.setEdit(true)}>
                            {lang[key].components.button.edit}
                        </Button>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default BottomBar;