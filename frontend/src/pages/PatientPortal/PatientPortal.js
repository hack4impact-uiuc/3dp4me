import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useTranslations } from '../../hooks/useTranslations';
import { redirectAndAuthenticate } from '../../api/axios-patient-auth';

const PatientPortal = () => {
    const params = useParams();
    const { patientId } = params;
    const [shouldRender, setShouldRender] = useState();
    const translations = useTranslations()[0];

    useEffect(async () => {
        const isAuth = await redirectAndAuthenticate(patientId);

        setShouldRender(isAuth);
    }, []);

    if (!shouldRender) {
        return <div>{translations.patientPortal.authenticating}</div>;
    }

    return <div>{shouldRender && <div>Hi</div>}</div>;
};

export default PatientPortal;
