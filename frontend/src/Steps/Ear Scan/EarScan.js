import React, { useState } from 'react'
import './EarScan.css'
import { Button, Fab, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import Notes from '../../Components/Notes/Notes';
import Download from '../../Components/File Download/Download';
import NoChangeDialog from '../../Components/No Change Dialog/NoChangeDialog';

const useStyles = makeStyles((theme) => ({
    patientDivider: {
        padding: 1,
        background: 'black',
        width: '80%',
        margin: 'auto',
    },
    inputField: {
        background: '#e5f0ff',
    },
    activeInput: {
        background: 'white'
    },
    patientBtns: {
        background: '#6295e0',
        color: 'white',
        margin: 'auto',
        marginRight: '35px',
        '&:hover': {
            background: '#6295e0'
        }
    },
    approveBtn: {
        position: 'fixed',
        bottom: 15,
        right: 15,
        marginRight: 15,
        padding: 15,
    },
    saveBtn: {
        position: 'fixed',
        bottom: 15,
        right: 240,
        marginRight: 15,
        padding: 15,
    },
    FAB: {
        background: '#6295e0',
        color: 'white',
        '&:hover': {
            background: '#6295e0'
        }
    }
}));

const EarScan = (props) => {
    const classes = useStyles();

    const [notes, setNotes] = useState("");
    const [download, setDownload] = useState();
    const [edit, setEdit] = useState(false);
    const lang = props.lang.data;
    const key = props.lang.key;

    const handleDownload = (e) => {

    }

    const postData = (e) => {

    }

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <h1 style={{ flexGrow: 1 }}>{lang[key].patientView.earScan.title}</h1>
            </div>
            <h3>Clinic XYZ on 10/05/2020 9:58PM</h3>
            <Download lang={props.lang} title={lang[key].patientView.earScan.fileHeader} fileName="file_name.SCAN" state={handleDownload} />
            <Notes disabled={!edit} value={notes} state={setNotes} title={lang[key].components.notes.title} />

            <div className={classes.approveBtn}>
                
            </div>
            
        </div>
    )
}

export default EarScan;