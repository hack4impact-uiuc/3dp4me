import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import './StepContent.scss';
import swal from 'sweetalert';
import Files from '../../components/Files/Files';
import {
    CircularProgress,
    Divider,
    Button,
    FormControlLabel,
    Radio,
    RadioGroup,
    Backdrop,
} from '@material-ui/core';
import {
    downloadFile,
    uploadFile,
    deleteFile,
    updateStage,
} from '../../utils/api';
import TextField from '../../components/Fields/TextField';
import { getStepMetadata, getStepData } from '../../utils/api';
import Notes from '../../components/Notes/Notes';
import BottomBar from '../../components/BottomBar/BottomBar';
import {
    LanguageDataType,
    StringGetterSetterType,
} from '../../utils/custom-proptypes';

const StepContent = ({
    languageData,
    stepKey,
    patientId,
    updatePatientFile,
}) => {
    const stageName = stepKey;

    const [trigger, reset] = useState(true);
    const [metaData, setMetaData] = useState(null);
    const [stepData, setStepData] = useState(null);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [completionStatus, setCompletionStatus] = useState(null);

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    useEffect(() => {
        fetchData();
    }, [trigger]);

    const fetchData = async () => {
        const metadataResponse = await getStepMetadata(stepKey);
        if (metadataResponse != null) setMetaData(metadataResponse);

        const response = await getStepData(stepKey);
        if (response != null) setStepData(response);

        setCompletionStatus(response.status);
        setLoading(false);
    };

    const handleFileDelete = async (key, file) => {
        deleteFile(patientId, stageName, file.fileName);
        let updatedFiles = _.cloneDeep(stepData[key]);
        updatedFiles = updatedFiles.filter((f) => f.fileName !== file.fileName);

        handleSimpleUpdate(key, updatedFiles);
    };

    const handleFileDownload = (fileName) => {
        downloadFile(patientId, stageName, fileName);
    };

    const handleFileUpload = async (key, file) => {
        const formattedFileName = `LEFT_${file.name}`;
        const res = await uploadFile(
            patientId,
            stageName,
            file,
            formattedFileName,
        );

        // TODO: Display error if res is null
        let files = _.cloneDeep(stepData[key]);
        files = files.concat({
            fileName: res.data.data.name,
            uploadedBy: res.data.data.uploadedBy,
            uploadDate: res.data.data.uploadDate,
        });

        handleSimpleUpdate(key, files);
        // updatePatientFile(stageName, infoCopy);
    };

    const handleSimpleUpdate = (key, value) => {
        let updatedStepData = _.cloneDeep(stepData);
        updatedStepData[key] = value;
        setStepData(updatedStepData);
    };

    const saveData = () => {
        updateStage(patientId, stageName, stepData);
        updatePatientFile(stageName, stepData);
        setEdit(false);
        swal(lang.components.bottombar.savedMessage.patientInfo, '', 'success');
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

    const generateHeader = () => {
        if (metaData == null || metaData.displayName == null) return null;

        return <h1>{metaData.displayName[key]}</h1>;
    };

    const genereateFields = () => {
        if (metaData == null || metaData.fields == null) return null;
        if (stepData == null) return null;

        let fields = _.cloneDeep(metaData.fields);
        fields.sort((a, b) => a.fieldNumber - b.fieldNumber);
        return fields.map((field) => {
            if (field.fieldType == 'String') {
                return (
                    <TextField
                        displayName={field.displayName[key]}
                        isDisabled={!edit}
                        onChange={handleSimpleUpdate}
                        key={field.key}
                        fieldId={field.key}
                        value={stepData[field.key]}
                    />
                );
            } else if (field.fieldType == 'MultilineString') {
                return (
                    <div>
                        <Notes
                            disabled={!edit}
                            state={handleSimpleUpdate}
                            title={field.displayName[key]}
                            value={stepData[field.key]}
                        />
                    </div>
                );
            } else if (field.fieldType == 'Date') {
                return (
                    <TextField
                        displayName={field.displayName[key]}
                        isDisabled={!edit}
                        onChange={handleSimpleUpdate}
                        key={field.key}
                        fieldId={field.key}
                        value={stepData[field.key]}
                    />
                );
            } else if (field.fieldType == 'Phone') {
                return (
                    <TextField
                        displayName={field.displayName[key]}
                        isDisabled={!edit}
                        onChange={handleSimpleUpdate}
                        fieldId={field.key}
                        key={field.key}
                        value={stepData[field.key]}
                    />
                );
            } else if (field.fieldType == 'File') {
                return (
                    <Files
                        languageData={languageData}
                        title={field.displayName[key]}
                        files={stepData[field.key]}
                        fieldKey={field.key}
                        handleDownload={handleFileDownload}
                        handleUpload={handleFileUpload}
                        handleDelete={handleFileDelete}
                    />
                );
            } else if (field.fieldType == 'Divider') {
                return (
                    <div className="patient-divider-wrapper">
                        <h2>{field.displayName[key]}</h2>
                        <Divider className="patient-divider" />
                    </div>
                );
            } else if (field.fieldType == 'Header') {
                return <h3>{field.displayName[key]}</h3>;
            }

            return null;
        });
    };

    const generateFooter = () => {
        if (stepData == null) return null;

        return (
            <BottomBar
                // lastEditedBy={info.lastEditedBy}
                // lastEdited={info.lastEdited}
                discard={{ state: trigger, setState: discardData }}
                save={saveData}
                status={completionStatus}
                setStatus={setCompletionStatus}
                edit={edit}
                setEdit={setEdit}
                languageData={languageData}
            />
        );
    };

    return (
        <form className="medical-info">
            <Backdrop className="backdrop" open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {generateHeader()}
            {/* TODO: Get real data from DB */}
            <p>Created by Evan Eckels on 10/05/2020 9:58PM</p>
            <p>Last edited by Anisha Rao on 10/08/2020 11:58PM</p>
            {genereateFields()}
            {generateFooter()}
        </form>
    );
};

StepContent.propTypes = {
    languageData: LanguageDataType.isRequired,
    information: PropTypes.object.isRequired,
    status: StringGetterSetterType,
    patientId: PropTypes.string.isRequired,
    updatePatientFile: PropTypes.func.isRequired,
};

export default StepContent;
