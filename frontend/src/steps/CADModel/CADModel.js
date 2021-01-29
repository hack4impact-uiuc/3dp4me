import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';

import BottomBar from '../../components/BottomBar/BottomBar';
import Files from '../../components/Files/Files';
import Notes from '../../components/Notes/Notes';

import './CADModel.scss';

import {
    downloadFile,
    uploadFile,
    deleteFile,
    updateStage,
} from '../../utils/api';

const CADModel = (props) => {
    const [info, setInfo] = useState(props.info);
    const stageName = 'modelInfo';
    const [trigger, reset] = useState(true);
    const [edit, setEdit] = useState(false);
    const [CADNotes, setCADNotes] = useState('');
    const [leftCADFiles, setLeftCADFiles] = useState(
        info.files
            .map((file_info) => {
                return file_info.filename;
            })
            .filter((filename) => {
                return filename.startsWith('LEFT_');
            }),
    );
    const [rightCADFiles, setRightCADFiles] = useState(
        info.files
            .map((file_info) => {
                return file_info.filename;
            })
            .filter((filename) => {
                return filename.startsWith('RIGHT_');
            }),
    );
    const formFields = {
        notes: CADNotes,
    };

    const lang = props.lang.data;
    const { key } = props.lang;

    const handleDownload = (fileName) => {
        downloadFile(props.id, stageName, fileName);
    };

    const handleLeftDelete = async (fileName) => {
        deleteFile(props.id, stageName, fileName);
        setLeftCADFiles(leftCADFiles.filter((file) => file !== fileName));
        const info_copy = info;
        info_copy.files = info_copy.files.filter(
            (file_info) => file_info.filename != fileName,
        );
        setInfo(info_copy);
        props.updatePatientFile(stageName, info_copy);
    };

    const handleRightDelete = async (fileName) => {
        deleteFile(props.id, stageName, fileName);
        setRightCADFiles(rightCADFiles.filter((file) => file !== fileName));
        const info_copy = info;
        info_copy.files = info_copy.files.filter(
            (file_info) => file_info.filename != fileName,
        );
        setInfo(info_copy);
        props.updatePatientFile(stageName, info_copy);
    };

    const handleLeftUpload = async (e) => {
        const fileToUpload = e.target.files[0];
        setLeftCADFiles((files) =>
            files.concat(`LEFT_${fileToUpload.name.toUpperCase()}`),
        );
        const res = await uploadFile(
            props.id,
            stageName,
            fileToUpload,
            `LEFT_${fileToUpload.name.toUpperCase()}`,
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

    const handleRightUpload = async (e) => {
        const fileToUpload = e.target.files[0];
        setRightCADFiles((files) =>
            files.concat(`RIGHT_${fileToUpload.name.toUpperCase()}`),
        );
        const res = await uploadFile(
            props.id,
            stageName,
            fileToUpload,
            `RIGHT_${fileToUpload.name.toUpperCase()}`,
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
        setCADNotes(info.notes);
    }, [trigger]);

    const saveData = (e) => {
        const info_copy = info;
        info_copy.notes = CADNotes;
        setInfo(info_copy);
        updateStage(props.id, stageName, info_copy);
        props.updatePatientFile(stageName, info_copy);
        setEdit(false);
        swal(lang[key].components.bottombar.savedMessage.model, '', 'success');
    };

    const discardData = (e) => {
        swal({
            title: lang[key].components.button.discard.question,
            text: lang[key].components.button.discard.warningMessage,
            icon: 'warning',
            dangerMode: true,
            buttons: [
                lang[key].components.button.discard.cancelButton,
                lang[key].components.button.discard.confirmButton,
            ],
        }).then((willDelete) => {
            if (willDelete) {
                swal({
                    title: lang[key].components.button.discard.success,
                    icon: 'success',
                    buttons: lang[key].components.button.discard.confirmButton,
                });
                reset(!trigger);
                setEdit(false);
            }
        });
    };

    return (
        <div className="cad-wrapper">
            <h1>{lang[key].patientView.CADModeling.title}</h1>
            <p>Last edited by Evan Eckels on 10/05/2020 9:58PM</p>
            <div className="cad-files">
                <Files
                    lang={props.lang}
                    title={lang[key].patientView.CADModeling.fileHeaderLeft}
                    fileNames={leftCADFiles}
                    handleDownload={handleDownload}
                    handleUpload={handleLeftUpload}
                    handleDelete={handleLeftDelete}
                />
                <Files
                    lang={props.lang}
                    title={lang[key].patientView.CADModeling.fileHeaderRight}
                    fileNames={rightCADFiles}
                    handleDownload={handleDownload}
                    handleUpload={handleRightUpload}
                    handleDelete={handleRightDelete}
                />
            </div>
            <Notes
                disabled={!edit}
                title={lang[key].components.notes.title}
                value={CADNotes}
                state={setCADNotes}
            />
            <BottomBar
                lastEditedBy={info.lastEditedBy}
                lastEdited={info.lastEdited}
                discard={{ state: trigger, setState: discardData }}
                save={saveData}
                status={props.status}
                edit={edit}
                setEdit={setEdit}
                lang={props.lang}
            />
        </div>
    );
};

export default CADModel;
