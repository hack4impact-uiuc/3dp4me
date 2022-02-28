import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Auth } from 'aws-amplify';

import { Context } from '../store/Store';
import Navbar from '../components/Navbar/Navbar';
import AccountManagement from '../pages/AccountManagement/AccountManagment';
import Dashboard from '../pages/Dashboard/Dashboard';
import DashboardManagement from '../pages/DashboardManagement/DashboardManagement';
import PatientDetail from '../pages/PatientDetail/PatientDetail';
import Patients from '../pages/Patients/Patients';
import {
    REDUCER_ACTIONS,
    ROUTES,
    LANGUAGES,
    COGNITO_ATTRIBUTES,
} from '../utils/constants';
import Login from '../pages/Login/Login';
import { useErrorWrap } from '../hooks/useErrorWrap';
import { getCurrentUserInfo } from '../aws/aws-helper';
import {
    UNDEFINED_AUTH,
    AUTHENTICATED,
    UNAUTHENTICATED,
    setAuthListener,
} from '../aws/aws-auth';
import { getSelf } from '../api/api';

const AWSRoutes = () => {
    const [authLevel, setAuthLevel] = useState(UNDEFINED_AUTH);
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [state, dispatch] = useContext(Context);
    const errorWrap = useErrorWrap();

    /**
     * Gets the user's preferred language and sets it in the store
     * Also checks if the user is an admin and updates store
     */
    useEffect(() => {
        const setLanguage = async () => {
            const userInfo = await getCurrentUserInfo();
            if (!userInfo?.attributes) return;

            const language = userInfo.attributes[COGNITO_ATTRIBUTES.LANGUAGE];
            if (isLanguageValid(language)) {
                dispatch({
                    type: REDUCER_ACTIONS.SET_LANGUAGE,
                    language,
                });
            } else {
                console.error(`Language is invalid: ${language}`);
            }
        };

        const setAdminStatus = async () => {
            const selfRes = await getSelf();
            dispatch({
                type: REDUCER_ACTIONS.SET_ADMIN_STATUS,
                isAdmin: selfRes?.result?.isAdmin,
            });
        };

        setLanguage();
        if (authLevel === AUTHENTICATED) {
            errorWrap(setAdminStatus);
        }
    }, [dispatch, errorWrap]);

    /**
     * Returns true if the given string is a valid language identifier
     */
    const isLanguageValid = (language) => {
        return Object.values(LANGUAGES).includes(language);
    };

    /**
     * Attempts to authenticate the user and get their name/email
     */
    useEffect(() => {
        const getUserInfo = async () => {
            const userInfo = await getCurrentUserInfo();
            setUsername(userInfo?.attributes?.name);
            setUserEmail(userInfo?.attributes?.email);
        };

        updateAuthLevel();
        getUserInfo();
    }, []);

    /**
     * Checks if the current user is authenticated and updates the auth
     * level accordingly
     */
    const updateAuthLevel = async () => {
        try {
            await Auth.currentAuthenticatedUser();
            setAuthLevel(AUTHENTICATED);
        } catch (error) {
            setAuthLevel(UNAUTHENTICATED);
        }
    };

    // We get the auth level at startup, then set a listener to get notified when it changes.
    setAuthListener((newAuthLevel) => setAuthLevel(newAuthLevel));

    // If we're not sure of the user's status, say we're authenticating
    if (authLevel === UNDEFINED_AUTH) return <p>Authenticating User</p>;

    // If the user is unauthenticated, show login screen
    if (authLevel === UNAUTHENTICATED)
        return (
            <Route>
                <Login />
            </Route>
        );

    return (
        <Switch>
            <Route exact path={ROUTES.DASHBOARD}>
                <Navbar username={username} userEmail={userEmail} />
                <Dashboard />
            </Route>
            <Route exact path={ROUTES.ACCOUNT}>
                <Navbar username={username} userEmail={userEmail} />
                <AccountManagement />
            </Route>
            <Route exact path={ROUTES.PATIENTS}>
                <Navbar username={username} userEmail={userEmail} />
                <Patients />
            </Route>
            <Route exact path={ROUTES.DASHBOARD_MANAGEMENT}>
                <Navbar username={username} userEmail={userEmail} />
                <DashboardManagement />
            </Route>
            <Route exact path={`${ROUTES.PATIENT_DETAIL}/:patientId`}>
                <Navbar username={username} userEmail={userEmail} />
                <PatientDetail />
            </Route>
            <Route>
                <Navbar username={username} userEmail={userEmail} />
                <Dashboard />
            </Route>
        </Switch>
    );
};

export default AWSRoutes;
