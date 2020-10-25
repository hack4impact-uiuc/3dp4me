import React, {useState} from 'react'
import './EarScan.css'
import { Button, IconButton } from '@material-ui/core';
import Notes from '../../Components/Notes/Notes';
import Download from '../../Components/File Download/Download';

const EarScan = (props) => {
    const [notes, setNotes ] = useState("");
    const [download, setDowload] = useState();

    const handleDownload = (e) => {

    }

    return (
        <div>
            <h1>Ear Scan</h1>
            <h3>Clinic XYZ on 10/05/2020 9:58PM</h3>
            <Download title="Ear Scan File" fileName="file_name.SCAN" state={handleDownload} />
            <Notes value={notes} state={setNotes} title="Notes" />
        </div>
    )
}

export default EarScan;