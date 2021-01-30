import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';
import PropTypes from 'prop-types';

import {
    LanguageDataType,
    StringGetterSetterType,
} from '../../utils/custom-proptypes';
import BottomBar from '../../components/BottomBar/BottomBar';
import Files from '../../components/Files/Files';
import Notes from '../../components/Notes/Notes';
import {
    deleteFile,
    downloadFile,
    uploadFile,
    updateStage,
} from '../../utils/api';

const Printing = ({
    languageData,
    id,
    information,
    updatePatientFile,
    status,
}) => {
    const [info, setInfo] = useState(information);
    const stageName = 'printingInfo';
    const [trigger, reset] = useState(true);
    const [edit, setEdit] = useState(false);
    const [printNotes, setPrintNotes] = useState('');
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];
    const [printFiles, setPrintFiles] = useState(
        info.files.map((fileInfo) => {
            return fileInfo.filename;
        }),
    );

    const handleDownload = async (fileName) => {
        downloadFile(id, stageName, fileName);
    };

    const handleDelete = async (fileName) => {
        deleteFile(id, stageName, fileName);
        setPrintFiles(printFiles.filter((file) => file !== fileName));
        const infoCopy = info;
        infoCopy.files = infoCopy.files.filter(
            (fileInfo) => fileInfo.filename !== fileName,
        );
        setInfo(infoCopy);
        updatePatientFile(stageName, infoCopy);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const fileToUpload = e.target.files[0];
        setPrintFiles((files) => files.concat(fileToUpload.name.toUpperCase()));
        const res = await uploadFile(
            id,
            stageName,
            fileToUpload,
            fileToUpload.name.toUpperCase(),
        );
        const infoCopy = info;
        infoCopy.files = infoCopy.files.concat({
            filename: res.data.data.name,
            uploadedBy: res.data.data.uploadedGy,
            uploadDate: res.data.data.uploadName,
        });
        setInfo(infoCopy);
        updatePatientFile(stageName, infoCopy);
    };

    useEffect(() => {
        setPrintNotes(info.notes);
    }, [trigger, info.notes]);

    const saveData = () => {
        const infoCopy = info;
        infoCopy.notes = printNotes;
        setInfo(infoCopy);
        updateStage(id, stageName, infoCopy);
        updatePatientFile(stageName, infoCopy);
        setEdit(false);
        swal(lang.components.bottombar.savedMessage.print, '', 'success');
    };

    const discardData = () => {
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
                languageData={languageData}
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
                status={status}
                edit={edit}
                setEdit={setEdit}
                languageData={languageData}
            />
        </div>
    );
};

Printing.propTypes = {
    languageData: LanguageDataType.isRequired,
    information: PropTypes.object.isRequired,
    status: StringGetterSetterType,
    id: PropTypes.string.isRequired,
    updatePatientFile: PropTypes.func.isRequired,
};

export default Printing;
