import React, {useEffect, useState} from 'react';
import BottomBar from '../../components/BottomBar/BottomBar';
import Files from '../../components/Files/Files';
import Notes from '../../components/Notes/Notes';
import swal from 'sweetalert';
import { downloadFile, uploadFile } from '../../utils/api';

const PostProcessing = (props) => {

    const info = props.info;
    const stageName = "processingInfo";
    const [trigger, reset] = useState(true);
    const [edit, setEdit] = useState(false);
    const [processingNotes, setProcessingNotes] = useState("");
    const [processingFiles, setProcessingFiles] = useState(info.files.map((file_info) => {return file_info.filename}));


    const lang = props.lang.data;
    const key = props.lang.key; 

    const handleDownload = (fileName) => {
        downloadFile(props.id, stageName, fileName);
    }

    const handleUpload = (e) => {
        e.preventDefault();
        const fileToUpload = e.target.files[0];
        setProcessingFiles(files => files.concat(fileToUpload.name.toUpperCase()));
        uploadFile(props.id, stageName, fileToUpload, fileToUpload.name.toUpperCase());
    }

    useEffect(() => {
        setProcessingNotes(info.notes);
    }, [trigger]);

    const saveData = (e) => {
        setEdit(false);
        swal(lang[key].components.bottombar.savedMessage.processing, "", "success");
    }

    const discardData = (e) => {
        swal({
            title: lang[key].components.button.discard.question,
            text: lang[key].components.button.discard.warningMessage,
            icon: "warning",
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
            <h1>{lang[key].patientView.postProcessing.title}</h1>
            <p>Last edited by Im Tired on 10/05/2020 9:58PM</p>
            <Files lang={props.lang} title={lang[key].components.file.title} fileNames={processingFiles} handleDownload={handleDownload} handleUpload={handleUpload}/>
            <Notes disabled={!edit} title={lang[key].components.notes.title} value={processingNotes} state={setProcessingNotes} />
            <BottomBar lastEditedBy={info.lastEditedBy} lastEdited={info.lastEdited} discard={{state: trigger, setState: discardData}} save = {saveData} status={props.status} edit={edit} setEdit={setEdit} lang={props.lang} />
        </div>
    )
}

export default PostProcessing;