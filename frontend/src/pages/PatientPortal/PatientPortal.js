import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import { redirectAndAuthenticate } from '../../api/axios-patient-auth';

const PatientPortal = () => {
    const params = useParams();
    const { patientId } = params;
    const [shouldRender, setShouldRender] = useState();

    useEffect(() => {
        setShouldRender(redirectAndAuthenticate(patientId));
    }, []);

    return (
        <div>
            { shouldRender && <div>
                Hi
            </div> }
        </div>
    )
}

export default PatientPortal