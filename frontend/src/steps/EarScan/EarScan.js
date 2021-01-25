import React, { useEffect, useState } from 'react'
import { Button, Fab, IconButton } from '@material-ui/core';
import Notes from '../../components/Notes/Notes';
import Files from '../../components/Files/Files';
import NoChangeDialog from '../../components/NoChangeDialog/NoChangeDialog';
import BottomBar from '../../components/BottomBar/BottomBar';
import swal from 'sweetalert';

import './EarScan.scss';
import { downloadFile, uploadFile, deleteFile, updateStage } from '../../utils/api';

const EarScan = (props) => {
    const [info, setInfo] = useState(props.info);
    const stageName = "earScanInfo";
    const [trigger, reset] = useState(true);
    const [notes, setNotes] = useState("");
    const [edit, setEdit] = useState(false);
    const [leftEarFiles, setLeftEarFiles] = useState(info.files.map((file_info) => {return file_info.filename}).filter((filename) => {return filename.startsWith("LEFT_")}));
    const [rightEarFiles, setRightEarFiles] = useState(info.files.map((file_info) => {return file_info.filename}).filter((filename) => {return filename.startsWith("RIGHT_")}));
    const formFields = {
        notes: notes,
    }

    const lang = props.lang.data;
    const key = props.lang.key;
    

    const handleDownload = (fileName) => {
        downloadFile(props.id, stageName, fileName);
    }

    const handleLeftDelete = async (fileName) => {
        deleteFile(props.id, stageName, fileName);
        setLeftEarFiles(leftEarFiles.filter(file => file !== fileName));
        let info_copy = info;
        info_copy.files = info_copy.files.filter((file_info) => file_info.filename != fileName)
        setInfo(info_copy);
        props.updatePatientFile(stageName, info_copy);
    }

    const handleRightDelete = async (fileName) => {
        deleteFile(props.id, stageName, fileName);
        setRightEarFiles(rightEarFiles.filter(file => file !== fileName));
        let info_copy = info;
        info_copy.files = info_copy.files.filter((file_info) => file_info.filename != fileName)
        setInfo(info_copy);
        props.updatePatientFile(stageName, info_copy);
    }

    const handleLeftUpload = async (e) => {
        e.preventDefault();
        const fileToUpload = e.target.files[0];
        setLeftEarFiles(files => files.concat("LEFT_" + fileToUpload.name.toUpperCase()));
        let res = await uploadFile(props.id, stageName, fileToUpload, "LEFT_" + fileToUpload.name.toUpperCase());
        let info_copy = info;
        info_copy.files = info_copy.files.concat({filename: res.data.data.name, uploadedBy: res.data.data.uploadedGy, uploadDate: res.data.data.uploadName});
        setInfo(info_copy);
        props.updatePatientFile(stageName, info_copy);
    }

    const handleRightUpload = async (e) => {
        e.preventDefault();
        const fileToUpload = e.target.files[0];
        setRightEarFiles(files => files.concat("RIGHT_" + fileToUpload.name.toUpperCase()));
        let res = await uploadFile(props.id, stageName, fileToUpload, "RIGHT_" + fileToUpload.name.toUpperCase());
        let info_copy = info;
        info_copy.files = info_copy.files.concat({filename: res.data.data.name, uploadedBy: res.data.data.uploadedGy, uploadDate: res.data.data.uploadName});
        setInfo(info_copy);
        props.updatePatientFile(stageName, info_copy);
    }

    useEffect(() => {
        setNotes(info.notes);
    }, [trigger]);

    const saveData = (e) => {
        let info_copy = info;
        info_copy.notes = notes;
        setInfo(info_copy);
        updateStage(props.id, stageName, info_copy);
        props.updatePatientFile(stageName, info_copy);
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
                <Files lang={props.lang} title={lang[key].patientView.earScan.fileHeaderLeft} fileNames={leftEarFiles} handleDownload={handleDownload} handleUpload={handleLeftUpload} handleDelete={handleLeftDelete} />
                <Files lang={props.lang} title={lang[key].patientView.earScan.fileHeaderRight} fileNames={rightEarFiles} handleDownload={handleDownload} handleUpload={handleRightUpload} handleDelete={handleRightDelete} />
            </div>
            <Notes disabled={!edit} value={notes} state={setNotes} title={lang[key].components.notes.title} />
            <BottomBar lastEditedBy={info.lastEditedBy} lastEdited={info.lastEdited} discard={{state: trigger, setState: discardData}} save={saveData} status={props.status} edit={edit} setEdit={setEdit} lang={props.lang} />
        </div>
    )
}

export default EarScan;