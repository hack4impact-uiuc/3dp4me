import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Dashboard from './pages/Dashboard/Dashboard';
import AccountManagement from './pages/AccountManagement/AccountManagment';
import Patients from './pages/Patients/Patients';
import Navbar from './components/Navbar/Navbar';
import SectionTab from './components/SectionTab/SectionTab';
import PatientDetail from './pages/PatientDetail/PatientDetail';
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
    const contentClassNames =
        selectedLang === LANGUAGES.AR ? 'flip content' : 'content';

    /**
     * Gets the user's preferred language and sets it in the store
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
                console.error(
                    `Your preferred language is invalid!: ${language}`,
                );
            }
        };

        setLanguage();
    }, [dispatch]);

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
            <Router>
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
                            <SectionTab />
                        </Route>
                        <Route
                            exact
                            path={`${ROUTES.PATIENT_DETAIL}/:patientId`}
                        >
                            <PatientDetail />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default AppContent;
