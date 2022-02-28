import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ROUTES } from '../utils/constants';
import Patient2FA from '../pages/Patient2FALogin/Patient2FALogin';
import PatientPortal from '../pages/PatientPortal/PatientPortal';

import AWSRoutes from './AWSRoutes';

const AllRoutes = () => {
    return (
        <Switch>
            <Route exact path={`${ROUTES.PATIENT_2FA}/:patientId`}>
                <Patient2FA />
            </Route>
            ,
            <Route exact path={`${ROUTES.PATIENT_PORTAL}/:patientId`}>
                <PatientPortal />
            </Route>
            ,
            <Route>
                <AWSRoutes />
            </Route>
        </Switch>
    );
};

export default AllRoutes;
