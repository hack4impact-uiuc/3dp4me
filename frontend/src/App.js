import React, { useEffect, useState } from 'react';
import { Amplify, Auth, Hub } from 'aws-amplify';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import awsconfig from './aws/aws-exports.js';
import Dashboard from './pages/Dashboard/Dashboard';
import AccountManagement from './pages/AccountManagement/AccountManagment';
import Metrics from './pages/Metrics/Metrics';
import Patients from './pages/Patients/Patients';
import Navbar from './components/Navbar/Navbar';
import Controller from './steps/Controller/Controller';
import languageData from './language-data.json';
import Login from './components/Login/Login';
import {
    UNDEFINED_AUTH,
    AUTHENTICATED,
    UNAUTHENTICATED,
    setAuthListener,
} from './aws/aws-auth.js';
import { getCurrentUserInfo } from './aws/aws-helper.js';

Amplify.configure(awsconfig);

function App() {
    const [lang, setLang] = useState('EN');
    const [authLevel, setAuthLevel] = useState(UNDEFINED_AUTH);
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');

    // Data is the raw JSON for EN and AR. Key is the currently selected language.
    const langInfo = {
        data: languageData,
        lang: lang,
    };

    useEffect(() => {
        const getUserInfo = async () => {
            const userInfo = await getCurrentUserInfo();
            setUsername(userInfo.username);
            setUserEmail(userInfo.email);
        };

        Auth.currentAuthenticatedUser()
            .then(() => {
                setAuthLevel(AUTHENTICATED);
            })
            .catch(() => {
                setAuthLevel(UNAUTHENTICATED);
            });

        // TODO: get user session langauge
        setLang('EN');
        getUserInfo();
    }, []);

    setAuthListener((newAuthLevel) => setAuthLevel(newAuthLevel));

    if (authLevel == UNDEFINED_AUTH)
        return <p>{languageData[lang].components.login.authLoading}</p>;

    if (authLevel == UNAUTHENTICATED) return <Login />;

    if (authLevel == AUTHENTICATED)
        return (
            <body dir={lang === 'AR' ? 'rtl' : 'ltr'}>
                <Router>
                    <Navbar
                        lang={langInfo}
                        setLang={setLang}
                        username={username}
                        userEmail={userEmail}
                    />
                    <div className={`${lang == 'AR' ? 'flip' : ''}`}>
                        <Switch>
                            <div className="content">
                                {/* Path = BASE_URL */}
                                <Route exact path="/">
                                    <Dashboard lang={langInfo} />
                                </Route>
                                {/* Path = BASE_URL/account */}
                                <Route exact path="/account">
                                    <AccountManagement lang={langInfo} />
                                </Route>
                                {/* Path = BASE_URL/metrics */}
                                <Route exact path="/metrics">
                                    <Metrics lang={langInfo} />
                                </Route>
                                {/* Path = BASE_URL/patients */}
                                <Route exact path="/patients">
                                    <Patients lang={langInfo} />
                                </Route>
                                {/* Path = BASE_URL/patient-info/PATIENT_ID */}
                                <Route exact path="/patient-info/:id">
                                    <Controller lang={langInfo} />
                                </Route>
                            </div>
                        </Switch>
                    </div>
                </Router>
            </body>
        );
}

export default App;
