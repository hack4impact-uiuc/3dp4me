import React, { useEffect } from 'react'

import { randomMethod } from '../../api/axios-patient-auth'

const PatientPortal = () => {
    useEffect(() => {
       randomMethod(); 
    }, []);

    return (
        <div>
            Hi
        </div>
    )
}

export default PatientPortal