import React, { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import swal from 'sweetalert';

import Notes from '../../components/Notes/Notes';
import BottomBar from '../../components/BottomBar/BottomBar';

import './Feedback.scss';
import { updateStage } from '../../utils/api';

const Feedback = (props) => {
    const stageName = 'feedbackInfo';
    const [info, setInfo] = useState(props.info);
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

    const lang = props.lang.data;
    const { key } = props.lang;

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
        updateStage(props.id, stageName, info_copy);
        props.updatePatientFile(stageName, info_copy);
        setEdit(false);
        swal(
            lang[key].components.bottombar.savedMessage.feedback,
            '',
            'success',
        );
    };

    const discardData = (e) => {
        swal({
            title: lang[key].components.button.discard.question,
            text: lang[key].components.button.discard.warningMessage,
            icon: 'warning',
            buttons: true,
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
        <div className="feedback-wrapper">
            <h1>{lang[key].patientView.feedback.title}</h1>
            <p>Clinic XYZ on 10/05/2020 9:58PM</p>
            <Notes
                disabled={!edit}
                title={lang[key].patientView.feedback.initial}
                value={intialFeedback}
                state={setInitialFeedback}
            />
            <div className="collected-wrapper">
                <h3>{lang[key].patientView.feedback.collected} </h3>
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
                title={lang[key].patientView.feedback.sixMonth}
                value={sixMonthFeedback}
                state={setSixMonthFeedback}
            />
            <div className="collected-wrapper">
                <h3>{lang[key].patientView.feedback.collected} </h3>
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
                title={lang[key].patientView.feedback.oneYear}
                value={oneYearFeedback}
                state={setOneYearFeedback}
            />
            <div className="collected-wrapper">
                <h3>{lang[key].patientView.feedback.collected} </h3>
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
                title={lang[key].patientView.feedback.twoYear}
                value={twoYearFeedback}
                state={setTwoYearFeedback}
            />
            <div className="collected-wrapper">
                <h3>{lang[key].patientView.feedback.collected}</h3>
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
                status={props.status}
                edit={edit}
                setEdit={setEdit}
                lang={props.lang}
            />
        </div>
    );
};

export default Feedback;
