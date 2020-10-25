import React, { useState } from 'react';
import Files from '../../Components/Files/Files';
import Notes from '../../Components/Notes/Notes';

const PostProcessing = (props) => {
    const [processingNotes, setProcessingNotes] = useState();


    return (
        <div>
            <h1>Post Processing</h1>
            <h3>Clinic XYZ on 10/05/2020 9:58PM</h3>
            <Files title="Files" files ={['file_name1.SCAN', 'file_name2.SCAN', 'file_name3.SCAN']} />
            <Notes title="Notes" value={processingNotes} state={setProcessingNotes} />
        </div>
    )
}

export default PostProcessing;