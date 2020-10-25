import React, {useState} from 'react'
import Download from '../../Components/File Download/Download';
import Notes from '../../Components/Notes/Notes';

const Printing = (props) => {

    const [downloadPrint, setDownloadPrint] = useState();
    const [printNotes, setPrintNotes] = useState("");

    const handleDownloadPrint = (e) => {

    }

    return (
        <div>
            <h1>3D Printing</h1>
            <h3>Last edited by Evan Eckels on 10/05/2020 9:58PM</h3>
            <Download title="3D Printing File" fileName="file_name.SCAN" state={setDownloadPrint} />
            <Notes title="Notes" value={printNotes} state={setPrintNotes} />
        </div>
    )
}

export default Printing;