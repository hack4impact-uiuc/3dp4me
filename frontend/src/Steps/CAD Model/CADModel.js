import React, {useState} from 'react'
import Download from '../../Components/File Download/Download'
import Notes from '../../Components/Notes/Notes';

const CADModel = (props) => {
    const [downloadCAD, setDownloadCAD] = useState();
    const [CADNotes, setCADNotes] = useState("");

    const handleDownloadCAD = (e) => {

    }

    return (
        <div>
            <h1>CAD</h1>
            <h3>Last edited by Evan Eckels on 10/05/2020 9:58PM</h3>
            <Download title="CAD File" fileName="file_name.SCAN" state={setDownloadCAD} />
            <Notes title="Notes" value={CADNotes} state={setCADNotes} />
        </div>
    )
}

export default CADModel;