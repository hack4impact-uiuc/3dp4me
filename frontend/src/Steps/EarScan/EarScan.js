import React, { useEffect, useState } from 'react'
<<<<<<< HEAD:frontend/src/Steps/Ear Scan/EarScan.js
<<<<<<< HEAD
import { Button, Fab, IconButton } from '@material-ui/core';
=======
import './EarScan.css'
import { Button, Fab, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
>>>>>>> origin/aws-backend-auth
import Notes from '../../Components/Notes/Notes';
import Download from '../../Components/File Download/Download';
import NoChangeDialog from '../../Components/No Change Dialog/NoChangeDialog';
import BottomBar from '../../Components/BottomBar/BottomBar';
=======
import { Button, Fab, IconButton } from '@material-ui/core';
import Notes from '../../components/Notes/Notes';
import Download from '../../components/FileDownload/Download';
import NoChangeDialog from '../../components/NoChangeDialog/NoChangeDialog';
import BottomBar from '../../components/BottomBar/BottomBar';
>>>>>>> origin/master:frontend/src/Steps/EarScan/EarScan.js
import swal from 'sweetalert';
<<<<<<< HEAD

const EarScan = (props) => {
=======

const EarScan = (props) => {
<<<<<<< HEAD:frontend/src/Steps/Ear Scan/EarScan.js
    const classes = useStyles();

>>>>>>> origin/aws-backend-auth
=======
>>>>>>> origin/master:frontend/src/Steps/EarScan/EarScan.js
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