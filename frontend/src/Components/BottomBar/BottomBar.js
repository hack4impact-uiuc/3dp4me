import React from 'react';
import { AppBar, Button, MenuItem, Select, Toolbar } from '@material-ui/core';
import colors from '../../colors.json';

const BottomBar = (props) => {

    const lang = props.lang.data;
    const key = props.lang.key;

    return (
        <AppBar color="white" style={{top: 'auto', bottom: '0'}}>
            <Toolbar>
                <div style={{ flexGrow: 1 }} />
                {props.edit ? (
                    <div>
                        {key !== "AR" ? (
                            <div>
                                <Select style={{ marginRight: '10px', padding: '10px 30px 10px 30px' }} defaultValue="Unfinished">
                                    <MenuItem value="Unfinished">{lang[key].components.bottombar.unfinished}</MenuItem>
                                    <MenuItem value="partial">{lang[key].components.bottombar.partial}</MenuItem>
                                    <MenuItem value="finished">{lang[key].components.bottombar.finished}</MenuItem>
                                </Select>
                                <Button onClick={() => props.setEdit(false)} style={{ backgroundColor: colors.button, color: 'white', padding: '10px 30px 10px 30px' }}>{lang[key].components.button.save}</Button>
                                <Button style={{ backgroundColor: 'white', color: 'black', padding: '10px 30px 10px 30px' }}><b>{lang[key].components.button.discard}</b></Button>
                            </div>
                        ) : (
                                <div>
                                    <Select style={{ marginLeft: '15px', padding: '10px 30px 10px 30px' }} defaultValue="Unfinished">
                                        <MenuItem value="Unfinished">{lang[key].components.bottombar.unfinished}</MenuItem>
                                        <MenuItem value="partial">{lang[key].components.bottombar.partial}</MenuItem>
                                        <MenuItem value="finished">{lang[key].components.bottombar.finished}</MenuItem>
                                    </Select>
                                    <Button onClick={() => props.setEdit(false)} style={{ backgroundColor: colors.button, color: 'white', padding: '10px 50px 10px 50px' }}>{lang[key].components.button.save}</Button>
                                    <Button style={{ backgroundColor: 'white', color: 'black', padding: '10px 30px 10px 30px' }}><b>{lang[key].components.button.discard}</b></Button>
                                </div>
                            )}
                    </div>
                ) : (
                        <div>
                            <span style={key !== "AR" ?
                                { background: '#05ca4f', padding: '5px 40px 5px 20px', border: 'solid black 1px', marginRight: '10px' }
                                :
                                { background: '#05ca4f', padding: '5px 40px 5px 20px', border: 'solid black 1px', marginLeft: '10px' }}>{lang[key].components.bottombar.status}</span>
                            <Button onClick={() => props.setEdit(true)} style={{ backgroundColor: colors.button, color: 'white', padding: '10px 30px 10px 30px' }}>
                                {lang[key].components.button.edit}
                            </Button>
                        </div>
                    )}
            </Toolbar>
        </AppBar>
    );
}

export default BottomBar;