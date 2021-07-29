import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Dashboard from './pages/Dashboard/Dashboard';
import AccountManagement from './pages/AccountManagement/AccountManagment';
import Patients from './pages/Patients/Patients';
import Navbar from './components/Navbar/Navbar';
import SectionTab from './components/SectionTab/SectionTab';
import Controller from './steps/Controller/Controller';
import ErrorModal from './components/ErrorModal/ErrorModal';
import {
    REDUCER_ACTIONS,
    LANGUAGES,
    COGNITO_ATTRIBUTES,
    ROUTES,
} from './utils/constants';
import { Context } from './store/Store';
import { useTranslations } from './hooks/useTranslations';
import { getCurrentUserInfo } from './aws/aws-helper';

function AppContent({ username, userEmail }) {
    const [state, dispatch] = useContext(Context);
    const selectedLang = useTranslations()[1];

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
            }
        };

        setLanguage();
    }, [dispatch]);

    const isLanguageValid = (language) => {
        return Object.values(LANGUAGES).includes(language);
    };

    const handleErrorModalClose = () => {
        dispatch({ type: REDUCER_ACTIONS.CLEAR_ERROR });
    };

    const renderAppContent = () => {
        return (
            <div dir={selectedLang === LANGUAGES.AR ? 'rtl' : 'ltr'}>
                <Router>
                    <Navbar username={username} userEmail={userEmail} />

                    {/* Global error popup */}
                    <ErrorModal
                        message={state.error}
                        isOpen={state.isErrorVisible}
                        onClose={handleErrorModalClose}
                    />

                    <div
                        className={`${
                            selectedLang === LANGUAGES.AR ? 'flip' : ''
                        } content`}
                    >
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
                            <Route
                                exact
                                path={`${ROUTES.PATIENT_DETAIL}/:patientId`}
                            >
                                <Controller />
                            </Route>
                            <Route exact path={ROUTES.DASHBOARD_MANAGEMENT}>
                                <SectionTab />
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    };

    return renderAppContent();
}

export default AppContent;
