import React, {useState} from 'react'
import BottomBar from '../../Components/BottomBar/BottomBar';
import Download from '../../Components/File Download/Download'
import Notes from '../../Components/Notes/Notes';

const CADModel = (props) => {
    const [edit, setEdit] = useState(false);
    const [downloadCAD, setDownloadCAD] = useState();
    const [CADNotes, setCADNotes] = useState("");
    const lang = props.lang.data;
    const key = props.lang.key;

    const handleDownloadCAD = (e) => {

    }

    return (
        <div>
            <h1>{lang[key].patientView.CADModeling.title}</h1>
            <p>Last edited by Evan Eckels on 10/05/2020 9:58PM</p>
            <Download lang={props.lang} title={lang[key].components.file.title} fileName="file_name.SCAN" state={setDownloadCAD} />
            <Notes disabled={!edit} title={lang[key].components.notes.title} value={CADNotes} state={setCADNotes} />
            <BottomBar status={props.status} edit={edit} setEdit={setEdit} lang={props.lang} />
        </div>
    )
}

export default CADModel;