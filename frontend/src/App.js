import React, { useEffect, useState } from 'react';
import { Amplify, Auth } from 'aws-amplify';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { awsconfig } from './aws/aws-exports';
import Dashboard from './pages/Dashboard/Dashboard';
import AccountManagement from './pages/AccountManagement/AccountManagment';
import Metrics from './pages/Metrics/Metrics';
import Patients from './pages/Patients/Patients';
import Navbar from './components/Navbar/Navbar';
import SectionTab from './components/SectionTab/SectionTab';
import Controller from './steps/Controller/Controller';
import translations from './translations.json';
import Login from './components/Login/Login';
import {
    UNDEFINED_AUTH,
    AUTHENTICATED,
    UNAUTHENTICATED,
    setAuthListener,
} from './aws/aws-auth';
import { getCurrentUserInfo } from './aws/aws-helper';

Amplify.configure(awsconfig);

function App() {
    const [selectedLang, setSelectedLang] = useState('EN');
    const [authLevel, setAuthLevel] = useState(UNDEFINED_AUTH);
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');

    // Data is the raw JSON for EN and AR. Key is the currently selected selectedLanguage.
    const languageData = {
        translations,
        selectedLanguage: selectedLang,
    };

    useEffect(() => {
        const getUserInfo = async () => {
            const userInfo = await getCurrentUserInfo();
            setUsername(userInfo.username);
            setUserEmail(userInfo.email);

            if (
                userInfo.attributes &&
                ['EN', 'AR'].includes(userInfo.attributes['custom:language'])
            )
                setSelectedLang(userInfo.attributes['custom:language']);
        };

        Auth.currentAuthenticatedUser()
            .then(() => {
                setAuthLevel(AUTHENTICATED);
            })
            .catch(() => {
                setAuthLevel(UNAUTHENTICATED);
            });

        getUserInfo();
    }, []);

    setAuthListener((newAuthLevel) => setAuthLevel(newAuthLevel));

    if (authLevel === UNDEFINED_AUTH)
        return <p>{translations[selectedLang].components.login.authLoading}</p>;

    if (authLevel === UNAUTHENTICATED) return <Login />;

    if (authLevel === AUTHENTICATED)
        return (
            <div dir={selectedLang === 'AR' ? 'rtl' : 'ltr'}>
                <Router>
                    <Navbar
                        languageData={languageData}
                        setSelectedLang={setSelectedLang}
                        username={username}
                        userEmail={userEmail}
                    />
                    <div
                        className={`${
                            selectedLang === 'AR' ? 'flip' : ''
                        } content`}
                    >
                        <Switch>
                            {/* Path = BASE_URL */}
                            <Route exact path="/">
                                <Dashboard languageData={languageData} />
                            </Route>
                            {/* Path = BASE_URL/account */}
                            <Route exact path="/account">
                                <AccountManagement
                                    languageData={languageData}
                                />
                            </Route>
                            {/* Path = BASE_URL/metrics */}
                            <Route exact path="/metrics">
                                <Metrics languageData={languageData} />
                            </Route>
                            {/* Path = BASE_URL/patients */}
                            <Route exact path="/patients">
                                <Patients languageData={languageData} />
                            </Route>
                            {/* Path = BASE_URL/patient-info/PATIENT_ID */}
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
}

export default App;
