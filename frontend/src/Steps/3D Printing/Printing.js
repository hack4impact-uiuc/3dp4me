import React, {useState} from 'react'
import BottomBar from '../../Components/BottomBar/BottomBar';
import Download from '../../Components/File Download/Download';
import Notes from '../../Components/Notes/Notes';

const Printing = (props) => {
    const [edit, setEdit] = useState(false);
    const [downloadPrint, setDownloadPrint] = useState();
    const [printNotes, setPrintNotes] = useState("");

    const lang = props.lang.data;
    const key = props.lang.key; 

    const handleDownloadPrint = (e) => {

    }

    return (
        <div>
            <h1>{lang[key].patientView.printing.title}</h1>
            <p>Last edited by Evan Eckels on 10/05/2020 9:58PM</p>
            <Download lang={props.lang} title={lang[key].components.file.title} fileName="file_name.SCAN" state={setDownloadPrint} />
            <Notes disabled={!edit} title={lang[key].components.notes.title} value={printNotes} state={setPrintNotes} />
            <BottomBar status={props.status} edit={edit} setEdit={setEdit} lang={props.lang} />
        </div>
    )
}

export default Printing;