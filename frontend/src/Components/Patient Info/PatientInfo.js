import React, { useState, useEffect } from 'react'

import './PatientInfo.css'

const PatientInfo = (props) => {

    useEffect(() => {
        // we need to call the data for this patient from the id? 
        console.log("testing");
    }, []);


    return (
        <div className="patient-info">
            <div className="sidebar">
                <div className="sidebar-content">
                    <input disabled id="name" value="Test Name" />
                    <input disabled id="order-id" value="#123456789" />
                    <div id="notes-section">
                        
                    </div>
                </div>
            </div>
            <div className="patient-content">
                <h4>Patient Information</h4>
            </div>
        </div>
    )
}

export default PatientInfo;