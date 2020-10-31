import React, {useState} from 'react';
import Download from '../../Components/File Download/Download';
import Notes from '../../Components/Notes/Notes';

const PostProcessing = (props) => {

    const [downloadProcessing, setDownloadProcessing] = useState();
    const [processingNotes, setProcessingNotes] = useState("");

    const lang = props.lang.data;
    const key = props.lang.key; 

    const handleDownloadProcessing = (e) => {

    }

    return (
        <div>
            <h1>{lang[key].patientView.postProcessing.title}</h1>
            <h3>Last edited by Im Tired on 10/05/2020 9:58PM</h3>
            <Download lang={props.lang} title={lang[key].components.file.title} fileName="file_name.SCAN" state={setDownloadProcessing} />
            <Notes title={lang[key].components.notes.title} value={processingNotes} state={setProcessingNotes} />
        </div>
    )
}

export default PostProcessing;