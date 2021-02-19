import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import './StepContent.scss';
import swal from 'sweetalert';
import {
    CircularProgress,
    Divider,
    Button,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Backdrop,
} from '@material-ui/core';

import { getStepMetadata } from '../../utils/api';
import Notes from '../../components/Notes/Notes';
import BottomBar from '../../components/BottomBar/BottomBar';
import { updateStage } from '../../utils/api';
import {
    LanguageDataType,
    StringGetterSetterType,
} from '../../utils/custom-proptypes';

const StepContent = ({
    // metaData,
    // stepData,
    languageData,
    stepKey,
    id,
    updatePatientFile,
}) => {
    const stageName = 'patientInfo';

    const [trigger, reset] = useState(true);
    const [metaData, setMetaData] = useState(null);
    const [stepData, setStepData] = useState(null);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(true);

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    useEffect(() => {
        fetchData();
    }, [trigger]);

    const fetchData = async () => {
        const response = await getStepMetadata(stepKey);
        if (response != null) setMetaData(response);

        setLoading(false);
    };

    const handleSimpleUpdate = (key, value) => {
        let updatedStepData = _.cloneDeep(stepData);
        updatedStepData[key] = value;
        setStepData(updatedStepData);
    };

    const saveData = () => {
        updateStage(id, stageName, stepData);
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

        let fields = _.cloneDeep(metaData.fields);
        fields.sort((a, b) => a.fieldNumber - b.fieldNumber);
        return fields.map((field) => {
            if (field.fieldType == 'String') {
                return (
                    <div>
                        <h3>{field.displayName[key]}</h3>
                        <TextField
                            disabled={!edit}
                            className={edit ? 'active-input' : 'input-field'}
                            variant="outlined"
                            onChange={handleSimpleUpdate}
                            // TODO
                            // value={dob}
                        />
                    </div>
                );
            } else if (field.fieldType == 'MultilineString') {
                return (
                    <div>
                        <Notes
                            disabled={!edit}
                            state={handleSimpleUpdate}
                            title={field.displayName[key]}
                            // value={notes}
                        />
                    </div>
                );
            } else if (field.fieldType == 'Date') {
                return (
                    <div>
                        <h3>{field.displayName[key]}</h3>
                        <TextField
                            disabled={!edit}
                            className={edit ? 'active-input' : 'input-field'}
                            variant="outlined"
                            onChange={handleSimpleUpdate}
                            // TODO
                            // value={dob}
                        />
                    </div>
                );
            } else if (field.fieldType == 'Phone') {
                return (
                    <div>
                        <h3>{field.displayName[key]}</h3>
                        <TextField
                            disabled={!edit}
                            className={edit ? 'active-input' : 'input-field'}
                            variant="outlined"
                            onChange={handleSimpleUpdate}
                            // TODO
                            // value={dob}
                        />
                    </div>
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

    return (
        <form className="medical-info">
            <Backdrop className="backdrop" open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {generateHeader()}
            {/* TODO: Get real data from DB */}
            <p>Created by Evan Eckels on 10/05/2020 9:58PM</p>
            <p>Last edited by Anisha Rao on 10/08/2020 11:58PM</p>

            {/* TODO: Add dividers */}
            {/* <div className="patient-divider-wrapper">
                <h2>{lang.patientView.patientInfo.patientSection}</h2>
                <Divider className="patient-divider" />
            </div> */}
            {genereateFields()}

            {/* <BottomBar
                lastEditedBy={info.lastEditedBy}
                lastEdited={info.lastEdited}
                discard={{ state: trigger, setState: discardData }}
                save={saveData}
                status={status}
                edit={edit}
                setEdit={setEdit}
                languageData={languageData}
            /> */}
        </form>
    );
};

StepContent.propTypes = {
    languageData: LanguageDataType.isRequired,
    information: PropTypes.object.isRequired,
    status: StringGetterSetterType,
    id: PropTypes.string.isRequired,
    updatePatientFile: PropTypes.func.isRequired,
};

export default StepContent;
