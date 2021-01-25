import React, { useEffect, useState } from 'react'
import { Button, Fab, IconButton } from '@material-ui/core';
import Notes from '../../components/Notes/Notes';
import Files from '../../components/Files/Files';
import NoChangeDialog from '../../components/NoChangeDialog/NoChangeDialog';
import BottomBar from '../../components/BottomBar/BottomBar';
import swal from 'sweetalert';

import './EarScan.scss';

const EarScan = (props) => {
    const info = props.info
    const [trigger, reset] = useState(true);
    const [notes, setNotes] = useState("");
    const [download, setDownload] = useState();
    const [edit, setEdit] = useState(false);
    const [leftEarFiles, setLeftEarFiles] = useState(info.files.map((file_info) => {return file_info.filename}).filter((filename) => {return filename.startsWith("LEFT_")}));
    const [rightEarFiles, setRightEarFiles] = useState(info.files.map((file_info) => {return file_info.filename}).filter((filename) => {return filename.startsWith("RIGHT_")}));
    const formFields = {
        download: download,
        notes: notes,
    }
    const lang = props.lang.data;
    const key = props.lang.key;

    const handleDownload = (e) => {
        
    }

    const handleLeftUpload = (e) => {
        e.preventDefault();
        const fileToUpload = e.target.files[0];
        let formData = new FormData();
        setLeftEarFiles(files => files.concat("LEFT_" + fileToUpload.name.toUpperCase()));
        formData.append("file", fileToUpload);
        // TODO: Call file upload endpoint
    }

    const handleRightUpload = (e) => {
        e.preventDefault();
        const fileToUpload = e.target.files[0];
        let formData = new FormData();
        setRightEarFiles(files => files.concat("RIGHT_" + fileToUpload.name.toUpperCase()));
        formData.append("file", fileToUpload);
        // TODO: Call file upload endpoint
    }

    const handleDelete = (fileName) => {
        let index = leftEarFiles.indexOf(fileName);
        if (index > -1) {
            setLeftEarFiles(leftEarFiles.filter(file => file !== fileName));
        } else {
            setRightEarFiles(rightEarFiles.filter(file => file !== fileName));
        }
        // TODO: Call file delete endpoint
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
        <div className="ear-scan-wrapper">
            <h1>{lang[key].patientView.earScan.title}</h1>
            <p>Clinic XYZ on 10/05/2020 9:58PM</p>
            <div className="ear-scan-files">
                <Files lang={props.lang} title={lang[key].patientView.earScan.fileHeaderLeft} fileNames={leftEarFiles} handleDownload={handleDownload} handleUpload={handleLeftUpload} handleDelete={handleDelete} />
                <Files lang={props.lang} title={lang[key].patientView.earScan.fileHeaderRight} fileNames={rightEarFiles} handleDownload={handleDownload} handleUpload={handleRightUpload} handleDelete={handleDelete} />
            </div>
            <Notes disabled={!edit} value={notes} state={setNotes} title={lang[key].components.notes.title} />
            <BottomBar lastEditedBy={info.lastEditedBy} lastEdited={info.lastEdited} discard={{state: trigger, setState: discardData}} save={saveData} status={props.status} edit={edit} setEdit={setEdit} lang={props.lang} />
        </div>
    )
}

export default EarScan;