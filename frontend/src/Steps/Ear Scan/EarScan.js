import React, { useEffect, useState } from 'react'
import './EarScan.css'
import { Button, Fab, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import Notes from '../../Components/Notes/Notes';
import Download from '../../Components/File Download/Download';
import NoChangeDialog from '../../Components/No Change Dialog/NoChangeDialog';
import BottomBar from '../../Components/BottomBar/BottomBar';
import swal from 'sweetalert';

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

    const info = props.info
    const [trigger, reset] = useState(true);
    const [notes, setNotes] = useState("");
    const [download, setDownload] = useState();
    const [edit, setEdit] = useState(false);
    const formFields = {
        download: download,
        notes: notes,
    }
    const lang = props.lang.data;
    const key = props.lang.key;

    const handleDownload = (e) => {

    }

    const postData = (e) => {

    }

    useEffect(() => {
        setNotes(info.notes);
    }, [trigger]);

    const saveData = (e) => {
        setEdit(false);
        swal(lang[key].components.bottombar.savedMessage.earScan, "", "success");
    }

    const discardData = (e) => {
        swal({
            title: lang[key].components.button.discard.question,
            text: lang[key].components.button.discard.warningMessage,
            icon: "warning",
            buttons: true,
            dangerMode: true,
            buttons: [lang[key].components.button.discard.cancelButton, lang[key].components.button.discard.confirmButton]
          })
          .then((willDelete) => {
            if (willDelete) {
              swal({
                title: lang[key].components.button.discard.success,
                icon: "success",
                buttons: lang[key].components.button.discard.confirmButton
            });
            reset(!trigger);
            setEdit(false)
            } 
          });
    }

    return (
        <div>
            <h1>{lang[key].patientView.earScan.title}</h1>
            <p>Clinic XYZ on 10/05/2020 9:58PM</p>
            <Download lang={props.lang} title={lang[key].patientView.earScan.fileHeader} fileName="file_name.SCAN" state={handleDownload} />
            <Notes disabled={!edit} value={notes} state={setNotes} title={lang[key].components.notes.title} />
            <BottomBar discard={{state: trigger, setState: discardData}} save={saveData} status={props.status} edit={edit} setEdit={setEdit} lang={props.lang} />

        </div>
    )
}

export default EarScan;