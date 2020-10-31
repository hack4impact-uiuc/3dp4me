import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Notes from '../../Components/Notes/Notes'
import { TextField } from '@material-ui/core';
import BottomBar from '../../Components/BottomBar/BottomBar';
import colors from '../../colors.json'

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

const Feedback = (props) => {
    const classes = useStyles();
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

    return (
        <div>
            <h1>{lang[key].patientView.feedback.title}</h1>
            <p>Clinic XYZ on 10/05/2020 9:58PM</p>
            <Notes disabled={!edit} title={lang[key].patientView.feedback.initial} value={intialFeedback} state={setInitialFeedback} />
            <div style={{ display: 'flex' }}>
                <h3>{lang[key].patientView.feedback.collected} </h3>
                <TextField className={edit ? classes.activeInput : classes.inputField} disabled={!edit} variant="outlined" value={initialFeedbackDate} onChange={(e) => setInitialFeedbackDate(e.target.value)} />
            </div>
            <Notes disabled={!edit} title={lang[key].patientView.feedback.sixMonth} value={sixMonthFeedback} state={setSixMonthFeedback} />
            <div style={{ display: 'flex' }}>
                <h3>{lang[key].patientView.feedback.collected} </h3>
                <TextField className={edit ? classes.activeInput : classes.inputField} disabled={!edit} variant="outlined" value={sixMonthFeedbackDate} onChange={(e) => setSixMonthFeedbackDate(e.target.value)} />
            </div>
            <Notes disabled={!edit} title={lang[key].patientView.feedback.oneYear} value={oneYearFeedback} state={setOneYearFeedback} />
            <div style={{ display: 'flex' }}>
                <h3>{lang[key].patientView.feedback.collected} </h3>
                <TextField className={edit ? classes.activeInput : classes.inputField} disabled={!edit} variant="outlined" value={oneYearFeedbackDate} onChange={(e) => setOneYearFeedbackDate(e.target.value)} />
            </div>
            <Notes disabled={!edit} title={lang[key].patientView.feedback.twoYear} value={twoYearFeedback} state={setTwoYearFeedback} />
            <div style={{ display: 'flex' }}>
                <h3>{lang[key].patientView.feedback.collected}</h3>
                <TextField className={edit ? classes.activeInput : classes.inputField} disabled={!edit} variant="outlined" value={twoYearFeedbackDate} onChange={(e) => setTwoYearFeedbackDate(e.target.value)} />
            </div>
            <BottomBar edit={edit} setEdit={setEdit} lang={props.lang} />
        </div>
    )
}

export default Feedback;