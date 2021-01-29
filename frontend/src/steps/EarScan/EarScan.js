import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';

import Notes from '../../components/Notes/Notes';
import Files from '../../components/Files/Files';
import BottomBar from '../../components/BottomBar/BottomBar';
import { LanguageDataType } from '../../utils/custom-proptypes';
import './EarScan.scss';
import {
    downloadFile,
    uploadFile,
    deleteFile,
    updateStage,
} from '../../utils/api';

const EarScan = (props) => {
    const [info, setInfo] = useState(props.info);
    const stageName = 'earScanInfo';
    const [trigger, reset] = useState(true);
    const [notes, setNotes] = useState('');
    const [edit, setEdit] = useState(false);
    const [leftEarFiles, setLeftEarFiles] = useState(
        info.files
            .map((file_info) => {
                return file_info.filename;
            })
            .filter((filename) => {
                return filename.startsWith('LEFT_');
            }),
    );
    const [rightEarFiles, setRightEarFiles] = useState(
        info.files
            .map((file_info) => {
                return file_info.filename;
            })
            .filter((filename) => {
                return filename.startsWith('RIGHT_');
            }),
    );

    const key = props.languageData.selectedLanguage;
    const lang = props.languageData.translations[key];

    const handleDownload = (fileName) => {
        downloadFile(props.id, stageName, fileName);
    };

    const handleLeftDelete = async (fileName) => {
        deleteFile(props.id, stageName, fileName);
        setLeftEarFiles(leftEarFiles.filter((file) => file !== fileName));
        const info_copy = info;
        info_copy.files = info_copy.files.filter(
            (file_info) => file_info.filename != fileName,
        );
        setInfo(info_copy);
        props.updatePatientFile(stageName, info_copy);
    };

    const handleRightDelete = async (fileName) => {
        deleteFile(props.id, stageName, fileName);
        setRightEarFiles(rightEarFiles.filter((file) => file !== fileName));
        const info_copy = info;
        info_copy.files = info_copy.files.filter(
            (file_info) => file_info.filename != fileName,
        );
        setInfo(info_copy);
        props.updatePatientFile(stageName, info_copy);
    };

    const handleLeftUpload = async (e) => {
        e.preventDefault();
        const fileToUpload = e.target.files[0];
        setLeftEarFiles((files) =>
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
        e.preventDefault();
        const fileToUpload = e.target.files[0];
        setRightEarFiles((files) =>
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
        setNotes(info.notes);
    }, [trigger]);

    const saveData = (e) => {
        const info_copy = info;
        info_copy.notes = notes;
        setInfo(info_copy);
        updateStage(props.id, stageName, info_copy);
        props.updatePatientFile(stageName, info_copy);
        setEdit(false);
        swal(lang.components.bottombar.savedMessage.earScan, '', 'success');
    };

    const discardData = (e) => {
        swal({
            title: lang.components.button.discard.question,
            text: lang.components.button.discard.warningMessage,
            icon: 'warning',
            buttons: true,
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
        <div className="ear-scan-wrapper">
            <h1>{lang.patientView.earScan.title}</h1>
            <p>Clinic XYZ on 10/05/2020 9:58PM</p>
            <div className="ear-scan-files">
                <Files
                    languageData={props.languageData}
                    title={lang.patientView.earScan.fileHeaderLeft}
                    fileNames={leftEarFiles}
                    handleDownload={handleDownload}
                    handleUpload={handleLeftUpload}
                    handleDelete={handleLeftDelete}
                />
                <Files
                    languageData={props.languageData}
                    title={lang.patientView.earScan.fileHeaderRight}
                    fileNames={rightEarFiles}
                    handleDownload={handleDownload}
                    handleUpload={handleRightUpload}
                    handleDelete={handleRightDelete}
                />
            </div>
            <Notes
                disabled={!edit}
                value={notes}
                state={setNotes}
                title={lang.components.notes.title}
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

EarScan.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default EarScan;
