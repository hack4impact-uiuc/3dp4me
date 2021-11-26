import PropTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import { getSelf } from './api/api';
import { getCurrentUserInfo } from './aws/aws-helper';
import ErrorModal from './components/ErrorModal/ErrorModal';
import Navbar from './components/Navbar/Navbar';
import { useErrorWrap } from './hooks/useErrorWrap';
import { useTranslations } from './hooks/useTranslations';
import AccountManagement from './pages/AccountManagement/AccountManagment';
import Dashboard from './pages/Dashboard/Dashboard';
import DashboardManagement from './pages/DashboardManagement/DashboardManagement';
import PatientDetail from './pages/PatientDetail/PatientDetail';
import Patients from './pages/Patients/Patients';
import Patient2FA from './pages/Patient2FALogin/Patient2FALogin';
import { Context } from './store/Store';
import {
    COGNITO_ATTRIBUTES,
    LANGUAGES,
    REDUCER_ACTIONS,
    ROUTES,
} from './utils/constants';
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from './components/LoadingIndicator/LoadingIndicator';

const AppContent = ({ username, userEmail }) => {
    const errorWrap = useErrorWrap();
    const [state, dispatch] = useContext(Context);
    const selectedLang = useTranslations()[1];
    const contentClassNames =
        selectedLang === LANGUAGES.AR ? 'flip content' : 'content';

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
            const selfRes = await trackPromise(getSelf());
            dispatch({
                type: REDUCER_ACTIONS.SET_ADMIN_STATUS,
                isAdmin: selfRes?.result?.isAdmin,
            });
        };

        setLanguage();
        errorWrap(setAdminStatus);
    }, [dispatch, errorWrap]);

    /**
     * Returns true if the given string is a valid language identifier
     */
    const isLanguageValid = (language) => {
        return Object.values(LANGUAGES).includes(language);
    };

    /**
     * Sets store when the global error modal should be closed
     */
    const handleErrorModalClose = () => {
        dispatch({ type: REDUCER_ACTIONS.CLEAR_ERROR });
    };

    return (
        <div dir={selectedLang === LANGUAGES.AR ? 'rtl' : 'ltr'}>
            <LoadingIndicator />
            <Router>
                <QueryParamProvider ReactRouterRoute={Route}>
                    <Navbar username={username} userEmail={userEmail} />

                    {/* Global error popup */}
                    <ErrorModal
                        message={state.error}
                        isOpen={state.isErrorVisible}
                        onClose={handleErrorModalClose}
                    />

                    {/* Routes */}
                    <div className={contentClassNames}>
                        <Switch>
                            <Route exact path={ROUTES.DASHBOARD}>
                                <Dashboard />
                            </Route>
                            <Route exact path={ROUTES.ACCOUNT}>
                                <AccountManagement />
                            </Route>
                            <Route exact path={ROUTES.PATIENTS}>
                                <Patients />
                            </Route>
                            <Route exact path={ROUTES.DASHBOARD_MANAGEMENT}>
                                <DashboardManagement />
                            </Route>
                            <Route
                                exact
                                path={`${ROUTES.PATIENT_2FA}/:patientId`}
                            >
                                <Patient2FA />
                            </Route>
                            <Route
                                exact
                                path={`${ROUTES.PATIENT_DETAIL}/:patientId`}
                            >
                                <PatientDetail />
                            </Route>
                        </Switch>
                    </div>
                </QueryParamProvider>
            </Router>
        </div>
    );
};

AppContent.propTypes = {
    username: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
};

export default AppContent;
