import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Dashboard from './pages/Dashboard/Dashboard';
import AccountManagement from './pages/AccountManagement/AccountManagment';
import Metrics from './pages/Metrics/Metrics';
import Patients from './pages/Patients/Patients';
import Navbar from './components/Navbar/Navbar';
import SectionTab from './components/SectionTab/SectionTab';
import Controller from './steps/Controller/Controller';
import ErrorModal from './components/ErrorModal/ErrorModal';
import {
    REDUCER_ACTIONS,
    LANGUAGES,
    LANGUAGE_ATTRIBUTE_KEY,
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

            const language = userInfo.attributes[LANGUAGE_ATTRIBUTE_KEY];
            if (isLanguageValid(language)) {
                dispatch({
                    type: REDUCER_ACTIONS.SET_LANGUAGE,
                    language: language,
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
                            <Route exact path="/">
                                <Dashboard />
                            </Route>
                            <Route exact path="/account">
                                <AccountManagement />
                            </Route>
                            <Route exact path="/metrics">
                                <Metrics />
                            </Route>
                            <Route exact path="/patients">
                                <Patients />
                            </Route>
                            <Route exact path="/patient-info/:patientId">
                                <Controller />
                            </Route>
                            <Route exact path="/section-tab">
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
