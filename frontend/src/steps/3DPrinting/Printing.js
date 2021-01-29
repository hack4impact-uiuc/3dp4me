import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';

import BottomBar from '../../components/BottomBar/BottomBar';
import Files from '../../components/Files/Files';
import Notes from '../../components/Notes/Notes';
import {
    deleteFile,
    downloadFile,
    uploadFile,
    updateStage,
} from '../../utils/api';

const Printing = (props) => {
    const [info, setInfo] = useState(props.info);
    const stageName = 'printingInfo';
    const [trigger, reset] = useState(true);
    const [edit, setEdit] = useState(false);
    const [printFiles, setPrintFiles] = useState(
        info.files.map((file_info) => {
            return file_info.filename;
        }),
    );
    const [printNotes, setPrintNotes] = useState('');
    const formFields = {
        notes: printNotes,
    };

    const key = props.languageData.selectedLanguage;
    const lang = props.languageData.translations[key];

    const handleDownload = async (fileName) => {
        downloadFile(props.id, stageName, fileName);
    };

    const handleDelete = async (fileName) => {
        deleteFile(props.id, stageName, fileName);
        setPrintFiles(printFiles.filter((file) => file !== fileName));
        const info_copy = info;
        info_copy.files = info_copy.files.filter(
            (file_info) => file_info.filename != fileName,
        );
        setInfo(info_copy);
        props.updatePatientFile(stageName, info_copy);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const fileToUpload = e.target.files[0];
        setPrintFiles((files) => files.concat(fileToUpload.name.toUpperCase()));
        const res = await uploadFile(
            props.id,
            stageName,
            fileToUpload,
            fileToUpload.name.toUpperCase(),
        );
        const info_copy = info;
        info_copy.files = info_copy.files.concat({
            filename: res.data.data.name,
            uploadedBy: res.data.data.uploadedGy,
            uploadDate: res.data.data.uploadName,
        });
        setInfo(info_copy);
        props.updatePatientFile(stageName, info_copy);
    };

    useEffect(() => {
        setPrintNotes(info.notes);
    }, [trigger]);

    const saveData = (e) => {
        const info_copy = info;
        info_copy.notes = printNotes;
        setInfo(info_copy);
        updateStage(props.id, stageName, info_copy);
        props.updatePatientFile(stageName, info_copy);
        setEdit(false);
        swal(lang.components.bottombar.savedMessage.print, '', 'success');
    };

    const discardData = (e) => {
        swal({
            title: lang.components.button.discard.question,
            text: lang.components.button.discard.warningMessage,
            icon: 'warning',
            dangerMode: true,
            buttons: [
                lang.components.button.discard.cancelButton,
                lang.components.button.discard.confirmButton,
            ],
        }).then((willDelete) => {
            if (willDelete) {
                swal({
                    title: lang.components.button.discard.success,
                    icon: 'success',
                    buttons: lang.components.button.discard.confirmButton,
                });
                reset(!trigger);
                setEdit(false);
            }
        });
    };

    return (
        <div>
            <h1>{lang.patientView.printing.title}</h1>
            <Files
                languageData={props.languageData}
                title={lang.components.file.title}
                fileNames={printFiles}
                handleDownload={handleDownload}
                handleUpload={handleUpload}
                handleDelete={handleDelete}
            />
            <Notes
                disabled={!edit}
                title={lang.components.notes.title}
                value={printNotes}
                state={setPrintNotes}
            />
            <BottomBar
                lastEditedBy={info.lastEditedBy}
                lastEdited={info.lastEdited}
                discard={{ state: trigger, setState: discardData }}
                save={saveData}
                status={props.status}
                edit={edit}
                setEdit={setEdit}
                languageData={props.languageData}
            />
        </div>
    );
};

export default Printing;
