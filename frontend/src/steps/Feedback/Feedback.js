import React, { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import swal from 'sweetalert';

import { LanguageDataType } from '../../utils/custom-proptypes';
import Notes from '../../components/Notes/Notes';
import BottomBar from '../../components/BottomBar/BottomBar';
import './Feedback.scss';
import { updateStage } from '../../utils/api';

const Feedback = ({
    information,
    status,
    languageData,
    id,
    updatePatientFile,
}) => {
    const stageName = 'feedbackInfo';
    const [info, setInfo] = useState(information);
    const [trigger, reset] = useState(true);
    const [edit, setEdit] = useState(false);
    const [intialFeedback, setInitialFeedback] = useState('');
    const [initialFeedbackDate, setInitialFeedbackDate] = useState('');
    const [sixMonthFeedback, setSixMonthFeedback] = useState('');
    const [sixMonthFeedbackDate, setSixMonthFeedbackDate] = useState('');
    const [oneYearFeedback, setOneYearFeedback] = useState('');
    const [oneYearFeedbackDate, setOneYearFeedbackDate] = useState('');
    const [twoYearFeedback, setTwoYearFeedback] = useState('');
    const [twoYearFeedbackDate, setTwoYearFeedbackDate] = useState('');

    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    useEffect(() => {
        setInitialFeedback(info.initial.notes);
        setInitialFeedbackDate(info.initial.date);
        setSixMonthFeedback(info.sixMonth.notes);
        setSixMonthFeedbackDate(info.sixMonth.date);
        setOneYearFeedback(info.oneYear.notes);
        setOneYearFeedbackDate(info.oneYear.date);
        setTwoYearFeedback(info.twoYear.notes);
        setTwoYearFeedbackDate(info.twoYear.date);
    }, [trigger]);

    const saveData = (e) => {
        const info_copy = info;
        info.initial.notes = intialFeedback;
        info.initial.date = initialFeedbackDate;
        info.sixMonth.notes = sixMonthFeedback;
        info.sixMonth.date = sixMonthFeedbackDate;
        info.oneYear.notes = oneYearFeedback;
        info.oneYear.date = oneYearFeedbackDate;
        info.twoYear.notes = twoYearFeedback;
        info.twoYear.date = twoYearFeedbackDate;
        setInfo(info_copy);
        updateStage(id, stageName, info_copy);
        updatePatientFile(stageName, info_copy);
        setEdit(false);
        swal(lang.components.bottombar.savedMessage.feedback, '', 'success');
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
        <div className="feedback-wrapper">
            <h1>{lang.patientView.feedback.title}</h1>
            <p>Clinic XYZ on 10/05/2020 9:58PM</p>
            <Notes
                disabled={!edit}
                title={lang.patientView.feedback.initial}
                value={intialFeedback}
                state={setInitialFeedback}
            />
            <div className="collected-wrapper">
                <h3>{lang.patientView.feedback.collected} </h3>
                <TextField
                    className={edit ? 'active-input' : 'input-field'}
                    disabled={!edit}
                    variant="outlined"
                    value={initialFeedbackDate}
                    onChange={(e) => setInitialFeedbackDate(e.target.value)}
                />
            </div>
            <Notes
                disabled={!edit}
                title={lang.patientView.feedback.sixMonth}
                value={sixMonthFeedback}
                state={setSixMonthFeedback}
            />
            <div className="collected-wrapper">
                <h3>{lang.patientView.feedback.collected} </h3>
                <TextField
                    className={edit ? 'active-input' : 'input-field'}
                    disabled={!edit}
                    variant="outlined"
                    value={sixMonthFeedbackDate}
                    onChange={(e) => setSixMonthFeedbackDate(e.target.value)}
                />
            </div>
            <Notes
                disabled={!edit}
                title={lang.patientView.feedback.oneYear}
                value={oneYearFeedback}
                state={setOneYearFeedback}
            />
            <div className="collected-wrapper">
                <h3>{lang.patientView.feedback.collected} </h3>
                <TextField
                    className={edit ? 'active-input' : 'input-field'}
                    disabled={!edit}
                    variant="outlined"
                    value={oneYearFeedbackDate}
                    onChange={(e) => setOneYearFeedbackDate(e.target.value)}
                />
            </div>
            <Notes
                disabled={!edit}
                title={lang.patientView.feedback.twoYear}
                value={twoYearFeedback}
                state={setTwoYearFeedback}
            />
            <div className="collected-wrapper">
                <h3>{lang.patientView.feedback.collected}</h3>
                <TextField
                    className={edit ? 'active-input' : 'input-field'}
                    disabled={!edit}
                    variant="outlined"
                    value={twoYearFeedbackDate}
                    onChange={(e) => setTwoYearFeedbackDate(e.target.value)}
                />
            </div>
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

Feedback.propTypes = {
    languageData: LanguageDataType.isRequired,
};

export default Feedback;
