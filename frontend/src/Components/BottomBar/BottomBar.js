import React from 'react';
import { AppBar, Button, MenuItem, Select, Toolbar } from '@material-ui/core';
import colors from '../../colors.json';
<<<<<<< HEAD
import './BottomBar.scss';
=======
>>>>>>> origin/aws-backend-auth

const BottomBar = (props) => {

    const lang = props.lang.data;
    const key = props.lang.key;

    const statusColor = {
        unfinished: "#ffe1e1",
        partial: '#f2e9c7',
        finished: '#05ca4f'
    }

    return (
<<<<<<< HEAD
        <AppBar className="bottom-bar-wrapper" color="white" style={{ top: 'auto', bottom: '0' }}>
=======
        <AppBar color="white" style={{ top: 'auto', bottom: '0' }}>
>>>>>>> origin/aws-backend-auth
            <Toolbar>
                <div style={{ flexGrow: 1 }} />
                {props.edit ? (
                    <div>
                        {key !== "AR" ? (
                            <div>
<<<<<<< HEAD
                                <Select className="status-selector" MenuProps={{ disableScrollLock: true }} onClick={(e) => props.status.setStatus(e)} defaultValue={props.status.value}>
=======
                                <Select MenuProps={{ disableScrollLock: true }} onClick={(e) => props.status.setStatus(e)} style={{ marginRight: '10px', padding: '10px 30px 10px 30px' }} defaultValue={props.status.value}>
>>>>>>> origin/aws-backend-auth
                                    <MenuItem disabled value="default">{lang[key].components.bottombar.default}</MenuItem>
                                    <MenuItem value="unfinished">{lang[key].components.bottombar.unfinished}</MenuItem>
                                    <MenuItem value="partial">{lang[key].components.bottombar.partial}</MenuItem>
                                    <MenuItem value="finished">{lang[key].components.bottombar.finished}</MenuItem>
                                </Select>
<<<<<<< HEAD
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
                    <div>
                        <span className="status" style={key !== "AR" ? { background: statusColor[props.status.value] } : { background: statusColor[props.status.value] }}>
                            {lang[key].components.bottombar[props.status.value]}
                        </span>
                        <Button className="edit-button" onClick={() => props.setEdit(true)}>
                            {lang[key].components.button.edit}
                        </Button>
                    </div>
                )}
=======
                                <Button onClick={() => props.save()} style={{ backgroundColor: colors.button, color: 'white', padding: '10px 30px 10px 30px' }}>{lang[key].components.button.save}</Button>
                                <Button onClick={() => props.discard.setState()} style={{ backgroundColor: 'white', color: 'black', padding: '10px 30px 10px 30px' }}><b>{lang[key].components.button.discard.title}</b></Button>
                            </div>
                        ) : (
                                <div>
                                    <Select MenuProps={{ disableScrollLock: true }} onClick={(e) => props.status.setStatus(e)} style={{ marginLeft: '15px', padding: '10px 30px 10px 30px' }} defaultValue={props.status.value}>
                                        <MenuItem disabled value="default">{lang[key].components.bottombar.default}</MenuItem>
                                        <MenuItem value="unfinished">{lang[key].components.bottombar.unfinished}</MenuItem>
                                        <MenuItem value="partial">{lang[key].components.bottombar.partial}</MenuItem>
                                        <MenuItem value="finished">{lang[key].components.bottombar.finished}</MenuItem>
                                    </Select>
                                    <Button onClick={() => props.save()} style={{ backgroundColor: colors.button, color: 'white', padding: '10px 50px 10px 50px' }}>{lang[key].components.button.save}</Button>
                                    <Button onClick={() => props.discard.setState()} style={{ backgroundColor: 'white', color: 'black', padding: '10px 30px 10px 30px' }}><b>{lang[key].components.button.discard.title}</b></Button>
                                </div>
                            )}
                    </div>
                ) : (
                        <div>
                            <span style={key !== "AR" ?
                                { background: statusColor[props.status.value], padding: '5px 40px 5px 20px', border: 'solid black 1px', marginRight: '10px' }
                                :
                                { background: statusColor[props.status.value], padding: '5px 40px 5px 20px', border: 'solid black 1px', marginLeft: '10px' }}>{lang[key].components.bottombar[props.status.value]}</span>
                            <Button onClick={() => props.setEdit(true)} style={{ backgroundColor: colors.button, color: 'white', padding: '10px 30px 10px 30px' }}>
                                {lang[key].components.button.edit}
                            </Button>
                        </div>
                    )}
>>>>>>> origin/aws-backend-auth
            </Toolbar>
        </AppBar>
    );
}

export default BottomBar;