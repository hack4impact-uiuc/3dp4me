import React, { useEffect, useState } from 'react'
<<<<<<< HEAD
import Notes from '../../Components/Notes/Notes'
import { TextField } from '@material-ui/core';
import BottomBar from '../../Components/BottomBar/BottomBar';
import swal from 'sweetalert';
import './Feedback.scss';
=======
import { makeStyles } from '@material-ui/core/styles'
import Notes from '../../Components/Notes/Notes'
import { TextField } from '@material-ui/core';
import BottomBar from '../../Components/BottomBar/BottomBar';
import colors from '../../colors.json'
import swal from 'sweetalert';

const useStyles = makeStyles(theme => ({
    inputField: {
        background: colors.secondary,
        marginLeft: '13px'
    },
    activeInput: {
        background: 'white',
        marginLeft: '13px'
    },
}))
>>>>>>> origin/aws-backend-auth

const Feedback = (props) => {
    const classes = useStyles();

    const info = props.info
    const [trigger, reset] = useState(true);
    const [edit, setEdit] = useState(false);
    const [intialFeedback, setInitialFeedback] = useState("");
    const [initialFeedbackDate, setInitialFeedbackDate] = useState("")
    const [sixMonthFeedback, setSixMonthFeedback] = useState("");
    const [sixMonthFeedbackDate, setSixMonthFeedbackDate] = useState("")
    const [oneYearFeedback, setOneYearFeedback] = useState("");
    const [oneYearFeedbackDate, setOneYearFeedbackDate] = useState("")
    const [twoYearFeedback, setTwoYearFeedback] = useState("");
    const [twoYearFeedbackDate, setTwoYearFeedbackDate] = useState("")

    const lang = props.lang.data;
    const key = props.lang.key;

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
        setEdit(false);
        swal(lang[key].components.bottombar.savedMessage.feedback, "", "success");
    }

    const discardData = (e) => {
        swal({
            title: lang[key].components.button.discard.question,
            text: lang[key].components.button.discard.warningMessage,
            icon: "warning",
            buttons: true,
            dangerMode: true,
            buttons: [lang[key].components.button.discard.cancelButton, lang[key].components.button.discard.confirmButton]
          })
          .then((willDelete) => {
            if (willDelete) {
              swal({
                title: lang[key].components.button.discard.success,
                icon: "success",
                buttons: lang[key].components.button.discard.confirmButton
            });
            reset(!trigger);
            setEdit(false)
            } 
          });
    }


    const info = props.info
    const [trigger, reset] = useState(true);
    const [edit, setEdit] = useState(false);
    const [intialFeedback, setInitialFeedback] = useState("");
    const [initialFeedbackDate, setInitialFeedbackDate] = useState("")
    const [sixMonthFeedback, setSixMonthFeedback] = useState("");
    const [sixMonthFeedbackDate, setSixMonthFeedbackDate] = useState("")
    const [oneYearFeedback, setOneYearFeedback] = useState("");
    const [oneYearFeedbackDate, setOneYearFeedbackDate] = useState("")
    const [twoYearFeedback, setTwoYearFeedback] = useState("");
    const [twoYearFeedbackDate, setTwoYearFeedbackDate] = useState("")

    const lang = props.lang.data;
    const key = props.lang.key;

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
        setEdit(false);
        swal(lang[key].components.bottombar.savedMessage.feedback, "", "success");
    }

    const discardData = (e) => {
        swal({
            title: lang[key].components.button.discard.question,
            text: lang[key].components.button.discard.warningMessage,
            icon: "warning",
            buttons: true,
            dangerMode: true,
            buttons: [lang[key].components.button.discard.cancelButton, lang[key].components.button.discard.confirmButton]
          })
          .then((willDelete) => {
            if (willDelete) {
              swal({
                title: lang[key].components.button.discard.success,
                icon: "success",
                buttons: lang[key].components.button.discard.confirmButton
            });
            reset(!trigger);
            setEdit(false)
            } 
          });
    }


    return (
<<<<<<< HEAD
        <div className="feedback-wrapper">
=======
        <div>
>>>>>>> origin/aws-backend-auth
            <h1>{lang[key].patientView.feedback.title}</h1>
            <p>Clinic XYZ on 10/05/2020 9:58PM</p>
            <Notes disabled={!edit} title={lang[key].patientView.feedback.initial} value={intialFeedback} state={setInitialFeedback} />
            <div style={{ display: 'flex' }}>
                <h3>{lang[key].patientView.feedback.collected} </h3>
<<<<<<< HEAD
                <TextField className={edit ? "active-input" : "input-field"} disabled={!edit} variant="outlined" value={initialFeedbackDate} onChange={(e) => setInitialFeedbackDate(e.target.value)} />
=======
                <TextField className={edit ? classes.activeInput : classes.inputField} disabled={!edit} variant="outlined" value={initialFeedbackDate} onChange={(e) => setInitialFeedbackDate(e.target.value)} />
>>>>>>> origin/aws-backend-auth
            </div>
            <Notes disabled={!edit} title={lang[key].patientView.feedback.sixMonth} value={sixMonthFeedback} state={setSixMonthFeedback} />
            <div style={{ display: 'flex' }}>
                <h3>{lang[key].patientView.feedback.collected} </h3>
<<<<<<< HEAD
                <TextField className={edit ? "active-input" : "input-field"} disabled={!edit} variant="outlined" value={sixMonthFeedbackDate} onChange={(e) => setSixMonthFeedbackDate(e.target.value)} />
=======
                <TextField className={edit ? classes.activeInput : classes.inputField} disabled={!edit} variant="outlined" value={sixMonthFeedbackDate} onChange={(e) => setSixMonthFeedbackDate(e.target.value)} />
>>>>>>> origin/aws-backend-auth
            </div>
            <Notes disabled={!edit} title={lang[key].patientView.feedback.oneYear} value={oneYearFeedback} state={setOneYearFeedback} />
            <div style={{ display: 'flex' }}>
                <h3>{lang[key].patientView.feedback.collected} </h3>
<<<<<<< HEAD
                <TextField className={edit ? "active-input" : "input-field"} disabled={!edit} variant="outlined" value={oneYearFeedbackDate} onChange={(e) => setOneYearFeedbackDate(e.target.value)} />
=======
                <TextField className={edit ? classes.activeInput : classes.inputField} disabled={!edit} variant="outlined" value={oneYearFeedbackDate} onChange={(e) => setOneYearFeedbackDate(e.target.value)} />
>>>>>>> origin/aws-backend-auth
            </div>
            <Notes disabled={!edit} title={lang[key].patientView.feedback.twoYear} value={twoYearFeedback} state={setTwoYearFeedback} />
            <div style={{ display: 'flex' }}>
                <h3>{lang[key].patientView.feedback.collected}</h3>
<<<<<<< HEAD
                <TextField className={edit ? "active-input" : "input-field"} disabled={!edit} variant="outlined" value={twoYearFeedbackDate} onChange={(e) => setTwoYearFeedbackDate(e.target.value)} />
=======
                <TextField className={edit ? classes.activeInput : classes.inputField} disabled={!edit} variant="outlined" value={twoYearFeedbackDate} onChange={(e) => setTwoYearFeedbackDate(e.target.value)} />
>>>>>>> origin/aws-backend-auth
            </div>
            <BottomBar discard={{state: trigger, setState: discardData}} save={saveData} status={props.status} edit={edit} setEdit={setEdit} lang={props.lang} />
        </div>
    )
}

export default Feedback;