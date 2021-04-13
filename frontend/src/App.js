import React, { useEffect, useState } from 'react';
import { Amplify, Auth } from 'aws-amplify';

import Store from './store/Store';
import AppContent from './AppContent';
import { awsconfig } from './aws/aws-exports';
import translations from './translations.json';
import Login from './components/Login/Login';
import { registerLocale } from 'react-datepicker';
import { enUS, arSA } from 'date-fns/locale';
import {
    UNDEFINED_AUTH,
    AUTHENTICATED,
    UNAUTHENTICATED,
    setAuthListener,
} from './aws/aws-auth';
import { getCurrentUserInfo } from './aws/aws-helper';

Amplify.configure(awsconfig);
registerLocale('EN', enUS);
registerLocale('AR', arSA);

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
            <Store>
                <AppContent
                    languageData={languageData}
                    onLanguageChange={setSelectedLang}
                    username={username}
                    userEmail={userEmail}
                />
            </Store>
        );
}

export default App;
