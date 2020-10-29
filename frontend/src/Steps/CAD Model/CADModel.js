import React, {useState} from 'react'
import Download from '../../Components/File Download/Download'
import Notes from '../../Components/Notes/Notes';

const CADModel = (props) => {
    const [downloadCAD, setDownloadCAD] = useState();
    const [CADNotes, setCADNotes] = useState("");
    const lang = props.lang.data;
    const key = props.lang.key;

    const handleDownloadCAD = (e) => {

    }

    return (
        <div>
            <h1>{lang[key].patientView.CADModeling.title}</h1>
            <h3>Last edited by Evan Eckels on 10/05/2020 9:58PM</h3>
            <Download lang={props.lang} title={lang[key].patientView.CADModeling.fileHeader} fileName="file_name.SCAN" state={setDownloadCAD} />
            <Notes title={lang[key].components.notes.title} value={CADNotes} state={setCADNotes} />
        </div>
    )
}

export default CADModel;