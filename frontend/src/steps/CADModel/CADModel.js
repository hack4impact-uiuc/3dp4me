import React, {useEffect, useState} from 'react'
import BottomBar from '../../components/BottomBar/BottomBar';
import Files from '../../components/Files/Files'
import Notes from '../../components/Notes/Notes';
import swal from 'sweetalert'

import './CADModel.scss';

const CADModel = (props) => {

    const info = props.info;
    const [trigger, reset] = useState(true);
    const [edit, setEdit] = useState(false);
    const [downloadCAD, setDownloadCAD] = useState();
    const [CADNotes, setCADNotes] = useState("");
    const [leftCADFiles, setLeftCADFiles] = useState([]);
    const [rightCADFiles, setRightCADFiles] = useState([]);
    const formFields = {
        download: downloadCAD,
        notes: CADNotes,
    }
    const lang = props.lang.data;
    const key = props.lang.key;

    const handleDownloadCAD = (e) => {

    }

    const handleLeftUpload = (e) => {
        const fileToUpload = e.target.files[0];
        let formData = new FormData();
        setLeftCADFiles(files => files.concat(fileToUpload.name));
        formData.append("file", fileToUpload);
        // TODO: Call file upload endpoint
    }

    const handleRightUpload = (e) => {
        const fileToUpload = e.target.files[0];
        let formData = new FormData();
        setRightCADFiles(files => files.concat(fileToUpload.name));
        formData.append("file", fileToUpload);
        // TODO: Call file upload endpoint
    }

    useEffect(() => {
        setCADNotes(info.notes);
    }, [trigger]);

    const saveData = (e) => {
        setEdit(false);
        swal(lang[key].components.bottombar.savedMessage.model, "", "success");
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
        <div className="cad-wrapper">
            <h1>{lang[key].patientView.CADModeling.title}</h1>
            <p>Last edited by Evan Eckels on 10/05/2020 9:58PM</p>
            <div className="cad-files">
                <Files lang={props.lang} title={lang[key].patientView.CADModeling.fileHeaderLeft} fileNames={leftCADFiles} handleDownload={setDownloadCAD} handleUpload={handleLeftUpload} />
                <Files lang={props.lang} title={lang[key].patientView.CADModeling.fileHeaderRight} fileNames={rightCADFiles} handleDownload={setDownloadCAD} handleUpload={handleRightUpload} />
            </div>
            <Notes disabled={!edit} title={lang[key].components.notes.title} value={CADNotes} state={setCADNotes} />
            <BottomBar discard={{state: trigger, setState: discardData}} save={saveData} status={props.status} edit={edit} setEdit={setEdit} lang={props.lang} />
        </div>
    )
}

export default CADModel;