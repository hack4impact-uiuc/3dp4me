import React, {useEffect, useState} from 'react'
import BottomBar from '../../Components/BottomBar/BottomBar';
import Download from '../../Components/File Download/Download';
import Notes from '../../Components/Notes/Notes';
import swal from 'sweetalert'

const Printing = (props) => {

    const info = props.info
    const [trigger, reset] = useState(true);
    const [edit, setEdit] = useState(false);
    const [downloadPrint, setDownloadPrint] = useState();
    const [printNotes, setPrintNotes] = useState("");
    const formFields = {
        download: downloadPrint,
        notes: printNotes,
    }

    const lang = props.lang.data;
    const key = props.lang.key; 

    const handleDownloadPrint = (e) => {

    }

    useEffect(() => {
        setPrintNotes(info.notes);
    }, [trigger]);

    const saveData = (e) => {
        setEdit(false);
        swal(lang[key].components.bottombar.savedMessage.print, "", "success");
    }

    const discardData = (e) => {
        swal({
            title: lang[key].components.button.discard.question,
            text: lang[key].components.button.discard.warningMessage,
            icon: "warning",
            buttons: true,
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
            <h1>{lang[key].patientView.printing.title}</h1>
            <p>Last edited by Evan Eckels on 10/05/2020 9:58PM</p>
            <Download lang={props.lang} title={lang[key].components.file.title} fileName="file_name.SCAN" state={setDownloadPrint} />
            <Notes disabled={!edit} title={lang[key].components.notes.title} value={printNotes} state={setPrintNotes} />
            <BottomBar discard={{state: trigger, setState: discardData}} save={saveData} status={props.status} edit={edit} setEdit={setEdit} lang={props.lang} />
        </div>
    )
}

export default Printing;