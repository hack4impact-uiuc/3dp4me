import React, { useState } from 'react'
import Notes from '../../Components/Notes/Notes'
import { TextField } from '@material-ui/core';

const Feedback = (props) => {
    const [intialFeedback, setInitialFeedback] = useState("");
    const [initialFeedbackDate, setInitialFeedbackDate] = useState("")
    const [sixMonthFeedback, setSixMonthFeedback] = useState("");
    const [sixMonthFeedbackDate, setSixMonthFeedbackDate] = useState("")
    const [oneYearFeedback, setOneYearFeedback] = useState("");
    const [oneYearFeedbackDate, setOneYearFeedbackDate] = useState("")
    const [twoYearFeedback, setTwoYearFeedback] = useState("");
    const [twoYearFeedbackDate, setTwoYearFeedbackDate] = useState("")

    return (
        <div>
            <h1>Feedback</h1>
            <h3>Clinic XYZ on 10/05/2020 9:58PM</h3>
            <Notes title="Initial feedback" value={intialFeedback} state={setInitialFeedback} />
            <div style={{display: 'flex'}}>
                <h3>Collected on: </h3>
                <TextField style={{marginLeft: '13px'}} variant="outlined" value={initialFeedbackDate} onChange={(e) => setInitialFeedbackDate(e.target.value)} />
            </div>
            <Notes title="6 Month Feedback" value={sixMonthFeedback} state={setSixMonthFeedback} />
            <div style={{display: 'flex'}}>
                <h3>Collected on: </h3>
                <TextField style={{marginLeft: '13px'}} variant="outlined" value={sixMonthFeedbackDate} onChange={(e) => setSixMonthFeedbackDate(e.target.value)} />
            </div>
            <Notes title="1 Year Feedback" value={oneYearFeedback} state={setOneYearFeedback} />
            <div style={{display: 'flex'}}>
                <h3>Collected on: </h3>
                <TextField style={{marginLeft: '13px'}} variant="outlined" value={oneYearFeedbackDate} onChange={(e) => setOneYearFeedbackDate(e.target.value)} />
            </div>
            <Notes title="2 Year Feedback" value={twoYearFeedback} state={setTwoYearFeedback} />
            <div style={{display: 'flex'}}>
                <h3>Collected on: </h3>
                <TextField style={{marginLeft: '13px'}} variant="outlined" value={twoYearFeedbackDate} onChange={(e) => setTwoYearFeedbackDate(e.target.value)} />
            </div>
        </div>
    )
}

export default Feedback;