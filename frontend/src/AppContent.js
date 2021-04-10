import React, { useContext, useEffect } from 'react';
import { Modal, RootRef } from '@material-ui/core';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import AccountManagement from './pages/AccountManagement/AccountManagment';
import Metrics from './pages/Metrics/Metrics';
import Patients from './pages/Patients/Patients';
import Navbar from './components/Navbar/Navbar';
import SectionTab from './components/SectionTab/SectionTab';
import Controller from './steps/Controller/Controller';
import { REDUCER_ACTIONS } from './utils/constants';
import { Context } from './store/Store';
import { useErrorWrap } from './hooks/useErrorWrap';

function AppContent({ languageData, onLanguageChange, username, userEmail }) {
    const [state, dispatch] = useContext(Context);
    const key = languageData.selectedLanguage;
    const lang = languageData.translations[key];

    const ErrorModal = ({ message, isOpen, onClose }) => {
        return (
            <Modal
                open={isOpen}
                onClose={onClose}
                container={() => RootRef.current}
            >
                <div>
                    <h1>{message}</h1>
                </div>
            </Modal>
        );
    };

    const handleErrorModalClose = () => {
        dispatch({ action: REDUCER_ACTIONS.CLEAR_ERROR });
    };

    const renderAppContent = () => {
        // TODO: Add some state for if the user can't authenticate
        return (
            <div dir={key === 'AR' ? 'rtl' : 'ltr'}>
                <Router>
                    <Navbar
                        languageData={languageData}
                        setSelectedLang={onLanguageChange}
                        username={username}
                        userEmail={userEmail}
                    />
                    <div className={`${key === 'AR' ? 'flip' : ''} content`}>
                        <Switch>
                            <Route exact path="/">
                                <ErrorModal
                                    message={state.error}
                                    isOpen={state.isErrorVisible}
                                    onClose={handleErrorModalClose}
                                />
                                <Dashboard languageData={languageData} />
                            </Route>
                            <Route exact path="/account">
                                <AccountManagement
                                    languageData={languageData}
                                />
                            </Route>
                            <Route exact path="/metrics">
                                <Metrics languageData={languageData} />
                            </Route>
                            <Route exact path="/patients">
                                <Patients languageData={languageData} />
                            </Route>
                            <Route exact path="/patient-info/:patientId">
                                <Controller languageData={languageData} />
                            </Route>
                            <Route exact path="/section-tab">
                                <SectionTab languageData={languageData} />
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
