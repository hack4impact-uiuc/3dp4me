import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';
import PropTypes from 'prop-types';

import BottomBar from '../../components/BottomBar/BottomBar';
import Files from '../../components/Files/Files';
import Notes from '../../components/Notes/Notes';
import {
    LanguageDataType,
    StringGetterSetterType,
} from '../../utils/custom-proptypes';
import './CADModel.scss';
import {
    downloadFile,
    uploadFile,
    deleteFile,
    updateStage,
} from '../../utils/api';

const CADModel = ({
    languageData,
    id,
    updatePatientFile,
    status,
    information,
}) => {
    const [info, setInfo] = useState(information);
    const stageName = 'modelInfo';
    const [trigger, reset] = useState(true);
    const [edit, setEdit] = useState(false);
    const [CADNotes, setCADNotes] = useState('');
    const [leftCADFiles, setLeftCADFiles] = useState(
        info.files
            .map((fileInfo) => {
                return fileInfo.filename;
            })
            .filter((filename) => {
                return filename.startsWith('LEFT_');
            }),
    );
    const [rightCADFiles, setRightCADFiles] = useState(
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
        setLeftCADFiles(leftCADFiles.filter((file) => file !== fileName));
        const infoCopy = info;
        infoCopy.files = infoCopy.files.filter(
            (fileInfo) => fileInfo.filename !== fileName,
        );
        setInfo(infoCopy);
        updatePatientFile(stageName, infoCopy);
    };

    const handleRightDelete = async (fileName) => {
        deleteFile(id, stageName, fileName);
        setRightCADFiles(rightCADFiles.filter((file) => file !== fileName));
        const infoCopy = info;
        infoCopy.files = infoCopy.files.filter(
            (fileInfo) => fileInfo.filename !== fileName,
        );
        setInfo(infoCopy);
        updatePatientFile(stageName, infoCopy);
    };

    const handleLeftUpload = async (e) => {
        const fileToUpload = e.target.files[0];
        setLeftCADFiles((files) =>
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
        const fileToUpload = e.target.files[0];
        setRightCADFiles((files) =>
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
        setCADNotes(info.notes);
    }, [trigger, info.notes]);

    const saveData = () => {
        const infoCopy = info;
        infoCopy.notes = CADNotes;
        setInfo(infoCopy);
        updateStage(id, stageName, infoCopy);
        updatePatientFile(stageName, infoCopy);
        setEdit(false);
        swal(lang.components.bottombar.savedMessage.model, '', 'success');
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
        <div className="cad-wrapper">
            <h1>{lang.patientView.CADModeling.title}</h1>
            <p>Last edited by Evan Eckels on 10/05/2020 9:58PM</p>
            <div className="cad-files">
                <Files
                    languageData={languageData}
                    title={lang.patientView.CADModeling.fileHeaderLeft}
                    fileNames={leftCADFiles}
                    handleDownload={handleDownload}
                    handleUpload={handleLeftUpload}
                    handleDelete={handleLeftDelete}
                />
                <Files
                    languageData={languageData}
                    title={lang.patientView.CADModeling.fileHeaderRight}
                    fileNames={rightCADFiles}
                    handleDownload={handleDownload}
                    handleUpload={handleRightUpload}
                    handleDelete={handleRightDelete}
                />
            </div>
            <Notes
                disabled={!edit}
                title={lang.components.notes.title}
                value={CADNotes}
                state={setCADNotes}
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

CADModel.propTypes = {
    languageData: LanguageDataType.isRequired,
    information: PropTypes.object.isRequired,
    status: StringGetterSetterType,
    id: PropTypes.string.isRequired,
    updatePatientFile: PropTypes.func.isRequired,
};

export default CADModel;
