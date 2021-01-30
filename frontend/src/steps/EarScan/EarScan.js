import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';
import PropTypes from 'prop-types';

import {
    LanguageDataType,
    StringGetterSetterType,
} from '../../utils/custom-proptypes';
import Notes from '../../components/Notes/Notes';
import Files from '../../components/Files/Files';
import BottomBar from '../../components/BottomBar/BottomBar';
import './EarScan.scss';
import {
    downloadFile,
    uploadFile,
    deleteFile,
    updateStage,
} from '../../utils/api';

const EarScan = ({
    information,
    status,
    languageData,
    id,
    updatePatientFile,
}) => {
    const [info, setInfo] = useState(information);
    const stageName = 'earScanInfo';
    const [trigger, reset] = useState(true);
    const [notes, setNotes] = useState('');
    const [edit, setEdit] = useState(false);
    const [leftEarFiles, setLeftEarFiles] = useState(
        info.files
            .map((fileInfo) => {
                return fileInfo.filename;
            })
            .filter((filename) => {
                return filename.startsWith('LEFT_');
            }),
    );
    const [rightEarFiles, setRightEarFiles] = useState(
        info.files
            .map((fileInfo) => {
                return fileInfo.filename;
            })
            .filter((filename) => {
                return filename.startsWith('RIGHT_');
            }),
    );

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const handleDownload = (fileName) => {
        downloadFile(id, stageName, fileName);
    };

    const handleLeftDelete = async (fileName) => {
        deleteFile(id, stageName, fileName);
        setLeftEarFiles(leftEarFiles.filter((file) => file !== fileName));
        const infoCopy = info;
        infoCopy.files = infoCopy.files.filter(
            (fileInfo) => fileInfo.filename !== fileName,
        );
        setInfo(infoCopy);
        updatePatientFile(stageName, infoCopy);
    };

    const handleRightDelete = async (fileName) => {
        deleteFile(id, stageName, fileName);
        setRightEarFiles(rightEarFiles.filter((file) => file !== fileName));
        const infoCopy = info;
        infoCopy.files = infoCopy.files.filter(
            (fileInfo) => fileInfo.filename !== fileName,
        );
        setInfo(infoCopy);
        updatePatientFile(stageName, infoCopy);
    };

    const handleLeftUpload = async (e) => {
        e.preventDefault();
        const fileToUpload = e.target.files[0];
        setLeftEarFiles((files) =>
            files.concat(`LEFT_${fileToUpload.name.toUpperCase()}`),
        );
        const res = await uploadFile(
            id,
            stageName,
            fileToUpload,
            `LEFT_${fileToUpload.name.toUpperCase()}`,
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

    const handleRightUpload = async (e) => {
        e.preventDefault();
        const fileToUpload = e.target.files[0];
        setRightEarFiles((files) =>
            files.concat(`RIGHT_${fileToUpload.name.toUpperCase()}`),
        );
        const res = await uploadFile(
            id,
            stageName,
            fileToUpload,
            `RIGHT_${fileToUpload.name.toUpperCase()}`,
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
        setNotes(info.notes);
    }, [trigger, info.notes]);

    const saveData = () => {
        const infoCopy = info;
        infoCopy.notes = notes;
        setInfo(infoCopy);
        updateStage(id, stageName, infoCopy);
        updatePatientFile(stageName, infoCopy);
        setEdit(false);
        swal(lang.components.bottombar.savedMessage.earScan, '', 'success');
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
        <div className="ear-scan-wrapper">
            <h1>{lang.patientView.earScan.title}</h1>
            <p>Clinic XYZ on 10/05/2020 9:58PM</p>
            <div className="ear-scan-files">
                <Files
                    languageData={languageData}
                    title={lang.patientView.earScan.fileHeaderLeft}
                    fileNames={leftEarFiles}
                    handleDownload={handleDownload}
                    handleUpload={handleLeftUpload}
                    handleDelete={handleLeftDelete}
                />
                <Files
                    languageData={languageData}
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
                status={status}
                edit={edit}
                setEdit={setEdit}
                languageData={languageData}
            />
        </div>
    );
};

EarScan.propTypes = {
    languageData: LanguageDataType.isRequired,
    information: PropTypes.object.isRequired,
    status: StringGetterSetterType,
    id: PropTypes.string.isRequired,
    updatePatientFile: PropTypes.func.isRequired,
};

export default EarScan;
