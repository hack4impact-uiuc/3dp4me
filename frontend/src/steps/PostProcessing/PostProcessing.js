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
    downloadFile,
    uploadFile,
    deleteFile,
    updateStage,
} from '../../utils/api';

const PostProcessing = ({
    information,
    status,
    languageData,
    id,
    updatePatientFile,
}) => {
    const [info, setInfo] = useState(information);
    const stageName = 'processingInfo';
    const [trigger, reset] = useState(true);
    const [edit, setEdit] = useState(false);
    const [processingNotes, setProcessingNotes] = useState('');
    const [processingFiles, setProcessingFiles] = useState(
        info.files.map((fileInfo) => {
            return fileInfo.filename;
        }),
    );
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const handleDownload = (fileName) => {
        downloadFile(id, stageName, fileName);
    };

    const handleDelete = async (fileName) => {
        deleteFile(id, stageName, fileName);
        setProcessingFiles(processingFiles.filter((file) => file !== fileName));
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
        setProcessingFiles((files) =>
            files.concat(fileToUpload.name.toUpperCase()),
        );
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
        setProcessingNotes(info.notes);
    }, [trigger]);

    const saveData = () => {
        const infoCopy = info;
        infoCopy.notes = processingNotes;
        setInfo(infoCopy);
        updateStage(id, stageName, infoCopy);
        updatePatientFile(stageName, infoCopy);
        setEdit(false);
        swal(lang.components.bottombar.savedMessage.processing, '', 'success');
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
            <h1>{lang.patientView.postProcessing.title}</h1>
            <p>Last edited by Im Tired on 10/05/2020 9:58PM</p>
            <Files
                languageData={languageData}
                title={lang.components.file.title}
                fileNames={processingFiles}
                handleDownload={handleDownload}
                handleUpload={handleUpload}
                handleDelete={handleDelete}
            />
            <Notes
                disabled={!edit}
                title={lang.components.notes.title}
                value={processingNotes}
                state={setProcessingNotes}
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

PostProcessing.propTypes = {
    languageData: LanguageDataType.isRequired,
    information: PropTypes.object.isRequired,
    status: StringGetterSetterType,
    id: PropTypes.string.isRequired,
    updatePatientFile: PropTypes.func.isRequired,
};

export default PostProcessing;
